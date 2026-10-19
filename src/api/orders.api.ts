import { apiClient } from './client';
import { API_ENDPOINTS } from './endpoints';
import { Order, OrderStatus, CreateOrderDto } from '../types/order';
import { INITIAL_ORDERS } from './mockData';

// In-memory / localStorage cache for realistic interactivity
let ordersCache: Order[] = (() => {
  const saved = localStorage.getItem('kolix_orders');
  if (saved) {
    try { return JSON.parse(saved); } catch {}
  }
  return [...INITIAL_ORDERS];
})();

function persist() {
  localStorage.setItem('kolix_orders', JSON.stringify(ordersCache));
}

export const ordersApi = {
  async getAll(): Promise<Order[]> {
    try {
      const res = await apiClient.get<{ data: Order[] }>(API_ENDPOINTS.ORDERS.BASE);
      return res.data;
    } catch {
      return [...ordersCache];
    }
  },

  async getById(id: string): Promise<Order | null> {
    try {
      const res = await apiClient.get<{ data: Order }>(API_ENDPOINTS.ORDERS.DETAIL(id));
      return res.data;
    } catch {
      return ordersCache.find(o => o.id === id) || null;
    }
  },

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    try {
      const res = await apiClient.patch<{ data: Order }>(API_ENDPOINTS.ORDERS.UPDATE_STATUS(id), { status });
      return res.data;
    } catch {
      const order = ordersCache.find(o => o.id === id);
      if (order) {
        order.status = status;
        persist();
        return { ...order };
      }
      throw new Error('Commande non trouvée');
    }
  },

  async confirmPayment(id: string, method: 'Espèces' | 'Mobile Money · Wave' | 'Mobile Money · Orange'): Promise<Order> {
    try {
      const res = await apiClient.post<{ data: Order }>(API_ENDPOINTS.ORDERS.CONFIRM_PAYMENT(id), { method });
      return res.data;
    } catch {
      const order = ordersCache.find(o => o.id === id);
      if (order) {
        order.paid = method;
        order.status = 'Livrée';
        persist();
        return { ...order };
      }
      throw new Error('Commande non trouvée');
    }
  },

  async create(dto: CreateOrderDto): Promise<Order> {
    try {
      const res = await apiClient.post<{ data: Order }>(API_ENDPOINTS.ORDERS.BASE, dto);
      return res.data;
    } catch {
      const newId = `KX-${1049 + ordersCache.length - INITIAL_ORDERS.length}`;
      const newOrder: Order = {
        id: newId,
        date: 'Aujourd’hui · ' + new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        client: dto.client,
        phone: dto.phone,
        city: dto.city,
        place: dto.place,
        product: dto.product,
        amount: dto.amount,
        status: 'En cours',
        note: dto.note || '—',
        paid: null,
        qrPayload: `KOLIX-PAY:${newId}:${dto.amount}:XOF:${dto.client.replace(/\s+/g, '-')}`,
        paymentMode: 'COD_MOMO'
      };
      ordersCache.unshift(newOrder);
      persist();
      return newOrder;
    }
  }
};
