import { apiClient } from './client';
import { API_ENDPOINTS } from './endpoints';
import { InventoryItem, StockAlert, StockKpis, StockStatus } from '../types/inventory';
import { INITIAL_INVENTORY, INITIAL_STOCK_KPIS } from './mockData';

let inventoryCache: InventoryItem[] = (() => {
  const saved = localStorage.getItem('kolix_inventory');
  if (saved) {
    try { return JSON.parse(saved); } catch {}
  }
  return [...INITIAL_INVENTORY];
})();

let globalSeuil = 5;

function persist() {
  localStorage.setItem('kolix_inventory', JSON.stringify(inventoryCache));
}

function computeStatus(qr: number, seuil: number): StockStatus {
  if (qr === 0) return 'Rupture';
  if (qr <= 2) return 'Critique';
  if (qr <= seuil) return 'Faible';
  return 'Optimal';
}

export const inventoryApi = {
  async getAll(): Promise<InventoryItem[]> {
    try {
      const res = await apiClient.get<{ data: InventoryItem[] }>(API_ENDPOINTS.INVENTORY.BASE);
      return res.data;
    } catch {
      return [...inventoryCache];
    }
  },

  async getKpis(): Promise<StockKpis> {
    try {
      const res = await apiClient.get<{ data: StockKpis }>(API_ENDPOINTS.INVENTORY.KPIS);
      return res.data;
    } catch {
      const underThreshold = inventoryCache.filter(i => i.qr <= i.seuil).length;
      const outOfStock = inventoryCache.filter(i => i.qr === 0).length;
      const totalVal = inventoryCache.reduce((sum, item) => sum + (item.qr * item.pu), 0);
      return {
        ...INITIAL_STOCK_KPIS,
        totalValue: totalVal,
        underThresholdCount: underThreshold,
        outOfStockCount: outOfStock
      };
    }
  },

  async getAlerts(): Promise<StockAlert[]> {
    try {
      const res = await apiClient.get<{ data: StockAlert[] }>(API_ENDPOINTS.INVENTORY.ALERTS);
      return res.data;
    } catch {
      return inventoryCache
        .filter(item => item.qr <= item.seuil)
        .map(item => ({
          id: item.id,
          name: item.name,
          qr: item.qr,
          seuil: item.seuil,
          status: item.qr === 0 ? 'Rupture' : item.qr <= 2 ? 'Critique' : 'Faible'
        }));
    }
  },

  async updateQuantity(id: string, delta: number): Promise<InventoryItem> {
    try {
      const res = await apiClient.patch<{ data: InventoryItem }>(API_ENDPOINTS.INVENTORY.UPDATE_STOCK(id), { delta });
      return res.data;
    } catch {
      const item = inventoryCache.find(i => i.id === id);
      if (item) {
        item.qr = Math.max(0, item.qr + delta);
        item.q = Math.max(item.qr + item.qv, item.q);
        item.total = item.qr * item.pu;
        item.status = computeStatus(item.qr, item.seuil);
        persist();
        return { ...item };
      }
      throw new Error('Article non trouvé');
    }
  },

  async setGlobalThreshold(newThreshold: number): Promise<number> {
    try {
      await apiClient.post(API_ENDPOINTS.INVENTORY.SET_THRESHOLD, { threshold: newThreshold });
      globalSeuil = newThreshold;
      return globalSeuil;
    } catch {
      globalSeuil = Math.max(1, newThreshold);
      inventoryCache.forEach(i => {
        i.seuil = globalSeuil;
        i.status = computeStatus(i.qr, globalSeuil);
      });
      persist();
      return globalSeuil;
    }
  },

  getThreshold(): number {
    return globalSeuil;
  }
};
