import { apiClient } from './client';
import { API_ENDPOINTS } from './endpoints';
import { InventoryItem, StockAlert, StockKpis, StockStatus } from '../types/inventory';

// Clear any stale mock data in localStorage
try {
  const saved = localStorage.getItem('kolix_inventory');
  if (saved && saved.includes('Écouteurs Pro Max')) {
    localStorage.removeItem('kolix_inventory');
  }
} catch {}

let inventoryCache: InventoryItem[] = (() => {
  const saved = localStorage.getItem('kolix_inventory');
  if (saved) {
    try { 
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0 && !parsed[0].name.includes('Écouteurs Pro')) {
        return parsed;
      }
    } catch {}
  }
  return [];
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
      if (Array.isArray(items)) {
        const mapped = items.map(mapBackendItemToFrontend);
        inventoryCache = mapped;
        persist();
        return mapped;
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
          turnoverRate: String(raw.turnover_rate ?? raw.turnoverRate ?? '—'),
          outOfStockCount: Number(raw.out_of_stock_count ?? raw.outOfStockCount ?? 0)
        };
      }
    } catch {
      // Fallback compute directly on active inventory items
    }

    const underThreshold = inventoryCache.filter(i => i.qr <= i.seuil && i.qr > 0).length;
    const outOfStock = inventoryCache.filter(i => i.qr === 0).length;
    const totalVal = inventoryCache.reduce((sum, item) => sum + (item.qr * item.pu), 0);
    const totalUnits = inventoryCache.reduce((sum, item) => sum + item.qr, 0);
    const estTurnover = totalUnits > 0 ? `${(totalUnits / 1.5).toFixed(1)}j` : '0j';
    return {
      totalValue: totalVal,
      underThresholdCount: underThreshold,
      pendingRestockCount: underThreshold + outOfStock,
      turnoverRate: estTurnover,
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
      // Local adjustment
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
