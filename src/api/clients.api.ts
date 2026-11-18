import { apiClient } from './client';
import { API_ENDPOINTS } from './endpoints';

export interface ClientItem {
  id?: string;
  name: string;
  phone: string;
  city: string;
  place: string;
  totalOrders: number;
  totalSpent: number;
  deliverySuccessRate?: number;
  lastOrderDate?: string;
}

export const clientsApi = {
  async getAll(search?: string): Promise<ClientItem[]> {
    try {
      const res = await apiClient.get<any>(
        API_ENDPOINTS.CLIENTS.BASE,
        search ? { search } : undefined
      );
      const items = res?.data || res;
      if (Array.isArray(items)) {
        return items.map((c: any) => ({
          id: c.id,
          name: c.name,
          phone: c.phone,
          city: c.city,
          place: c.place,
          totalOrders: c.total_orders ?? c.totalOrders ?? 1,
          totalSpent: Number(c.total_spent ?? c.totalSpent ?? 0),
          deliverySuccessRate: c.delivery_success_rate ?? c.deliverySuccessRate ?? 100,
          lastOrderDate: c.last_order_date ?? c.lastOrderDate
        }));
      }
      return [];
    } catch {
      return [];
    }
  },

  async exportCsv(): Promise<void> {
    try {
      const rawBase = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const token = apiClient.getToken();
      const res = await fetch(`${rawBase.replace(/\/+$/, '')}${API_ENDPOINTS.CLIENTS.EXPORT}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (!res.ok) throw new Error('Erreur de téléchargement');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `clients_repertoire_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Erreur export clients CSV', err);
      throw err;
    }
  }
};

