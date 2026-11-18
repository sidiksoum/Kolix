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

function mapBackendItemToFrontend(item: any): InventoryItem {
  const qr = item.qty_remaining ?? item.qr ?? 0;
  const qv = item.qty_sold ?? item.qv ?? 0;
  const q = item.qty_initial ?? item.q ?? (qr + qv);
  const seuil = item.threshold ?? item.seuil ?? globalSeuil;
  const pu = Number(item.unit_cost ?? item.pu ?? 0);
  const status = (item.status as StockStatus) || computeStatus(qr, seuil);

  return {
    id: String(item.id),
    num: item.num || `INV-${String(item.id).slice(0, 4).toUpperCase()}`,
    name: item.product_name || item.name || 'Produit',
    q,
    qv,
    qr,
    seuil,
    status,
    pu,
    total: qr * pu
  };
}

export const inventoryApi = {
  async getAll(): Promise<InventoryItem[]> {
    try {
      const res = await apiClient.get<any>(API_ENDPOINTS.INVENTORY.BASE);
      const items = res?.data || res;
      if (Array.isArray(items) && items.length > 0) {
        const mapped = items.map(mapBackendItemToFrontend);
        const idSet = new Set(mapped.map(m => m.id));
        const merged = [...mapped, ...inventoryCache.filter(c => !idSet.has(c.id))];
        inventoryCache = merged;
        persist();
        return merged;
      }
      return [...inventoryCache];
    } catch {
      return [...inventoryCache];
    }
  },

  async getKpis(): Promise<StockKpis> {
    try {
      const res = await apiClient.get<any>(API_ENDPOINTS.INVENTORY.KPIS);
      const raw = res?.data || res;
      if (raw && typeof raw === 'object' && ('total_value' in raw || 'totalValue' in raw)) {
        return {
          totalValue: Number(raw.total_value ?? raw.totalValue ?? 0),
          underThresholdCount: Number(raw.under_threshold_count ?? raw.underThresholdCount ?? 0),
          pendingRestockCount: Number(raw.pending_restock_count ?? raw.pendingRestockCount ?? 0),
          turnoverRate: String(raw.turnover_rate ?? raw.turnoverRate ?? '84 %'),
          outOfStockCount: Number(raw.out_of_stock_count ?? raw.outOfStockCount ?? 0)
        };
      }
    } catch {
      // Fallback
    }

    const underThreshold = inventoryCache.filter(i => i.qr <= i.seuil && i.qr > 0).length;
    const outOfStock = inventoryCache.filter(i => i.qr === 0).length;
    const totalVal = inventoryCache.reduce((sum, item) => sum + (item.qr * item.pu), 0);
    return {
      ...INITIAL_STOCK_KPIS,
      totalValue: totalVal,
      underThresholdCount: underThreshold,
      pendingRestockCount: underThreshold + outOfStock,
      outOfStockCount: outOfStock
    };
  },

  async getAlerts(): Promise<StockAlert[]> {
    const items = await this.getAll();
    return items
      .filter(item => item.qr <= item.seuil)
      .map(item => ({
        id: item.id,
        name: item.name,
        qr: item.qr,
        seuil: item.seuil,
        status: (item.qr === 0 ? 'Rupture' : item.qr <= 2 ? 'Critique' : 'Faible') as any
      }));
  },

  async updateQuantity(id: string, delta: number): Promise<InventoryItem> {
    try {
      const res = await apiClient.post<any>(API_ENDPOINTS.INVENTORY.RESTOCK(id), {
        quantity: delta,
        note: 'Ajustement inventaire'
      });
      const data = res?.data || res;
      if (data && (data.qty_remaining !== undefined || data.qr !== undefined)) {
        const updated = mapBackendItemToFrontend(data);
        inventoryCache = inventoryCache.map(i => i.id === id ? updated : i);
        persist();
        return updated;
      }
    } catch {
      // Fallback to local
    }

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
  },

  async setGlobalThreshold(newThreshold: number): Promise<number> {
    globalSeuil = Math.max(1, newThreshold);
    inventoryCache.forEach(i => {
      i.seuil = globalSeuil;
      i.status = computeStatus(i.qr, globalSeuil);
      // Try background update for backend if UUID
      if (i.id.includes('-')) {
        apiClient.put(API_ENDPOINTS.INVENTORY.SET_THRESHOLD(i.id), { threshold: globalSeuil }).catch(() => {});
      }
    });
    persist();
    return globalSeuil;
  },

  getThreshold(): number {
    return globalSeuil;
  }
};
