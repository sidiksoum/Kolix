import { apiClient } from './client';
import { API_ENDPOINTS } from './endpoints';
import { Order, OrderStatus, CreateOrderDto } from '../types/order';

// Clear any stale mock data in localStorage
try {
  const saved = localStorage.getItem('kolix_orders');
  if (saved && (saved.includes('Amadou Diallo') || saved.includes('KX-1048') && saved.includes('Écouteurs'))) {
    localStorage.removeItem('kolix_orders');
  }
} catch {}

let ordersCache: Order[] = (() => {
  const saved = localStorage.getItem('kolix_orders');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && !parsed.some(o => o.client === 'Amadou Diallo')) {
        return parsed;
      }
    } catch {}
  }
  return [];
})();

function persist() {
  localStorage.setItem('kolix_orders', JSON.stringify(ordersCache));
}

function mapBackendOrderToFrontend(item: any): Order {
  const dateStr = item.created_at
    ? new Date(item.created_at).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      })
    : item.date || 'Aujourd’hui';

  const productTitle = item.product_name 
    || item.offer_label 
    || item.items?.[0]?.product_name 
    || item.product 
    || 'Produit Kolix';

  return {
    id: item.id || item.order_id || `KX-${Math.floor(1000 + Math.random() * 9000)}`,
    date: item.date || dateStr,
    client: item.client_name || item.client || 'Client',
    phone: item.client_phone || item.phone || '',
    city: item.city || 'Abidjan',
    place: item.delivery_place || item.place || '',
    product: productTitle,
    amount: Number(item.total_amount ?? item.amount ?? 0),
    status: (item.status as OrderStatus) || 'En cours',
    note: item.note || '—',
    paid: item.paid_at ? (item.payment_mode === 'COD_CASH' ? 'Espèces' : 'Mobile Money') : (item.paid || null),
    paymentMode: item.payment_mode || 'COD_CASH',
    qrPayload: item.qr_payload || undefined,
    items: item.items?.map((it: any) => ({
      id: it.id || it.product_id || '',
      name: it.product_name,
      quantity: it.quantity,
      unitPrice: it.unit_price
    }))
  };
}

export const ordersApi = {
  async getAll(): Promise<Order[]> {
    try {
      const res = await apiClient.get<any>(API_ENDPOINTS.ORDERS.BASE);
      const items = res?.data || res;
      if (Array.isArray(items)) {
        const mapped = items.map(mapBackendOrderToFrontend);
        ordersCache = mapped;
        persist();
        return mapped;
      }
      return [...ordersCache];
    } catch {
      return [...ordersCache];
    }
  },

  async getById(id: string): Promise<Order | null> {
    try {
      const res = await apiClient.get<any>(API_ENDPOINTS.ORDERS.DETAIL(id));
      const item = res?.data || res;
      if (item && (item.id || item.order_id)) {
        return mapBackendOrderToFrontend(item);
      }
      return ordersCache.find(o => o.id === id) || null;
    } catch {
      return ordersCache.find(o => o.id === id) || null;
    }
  },

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    try {
      const res = await apiClient.patch<any>(API_ENDPOINTS.ORDERS.UPDATE_STATUS(id), { status });
      const raw = res?.data || res;
      const cached = ordersCache.find(o => o.id === id);
      const updated: Order = cached
        ? {
            ...cached,
            status,
            paid: status === 'Livrée' ? (cached.paymentMode === 'COD_CASH' ? 'Espèces' : 'Mobile Money') : cached.paid
          }
        : mapBackendOrderToFrontend(raw);

      ordersCache = ordersCache.map(o => o.id === id ? updated : o);
      persist();
      return updated;
    } catch {
      const order = ordersCache.find(o => o.id === id);
      if (order) {
        order.status = status;
        if (status === 'Livrée' && !order.paid) {
          order.paid = order.paymentMode === 'COD_CASH' ? 'Espèces' : 'Mobile Money';
        }
        persist();
        return { ...order };
      }
      throw new Error('Commande non trouvée');
    }
  },

  async confirmPayment(id: string, method: 'Espèces' | 'Mobile Money · Wave' | 'Mobile Money · Orange'): Promise<Order> {
    try {
      await apiClient.patch<any>(API_ENDPOINTS.ORDERS.UPDATE_STATUS(id), { status: 'Livrée' });
    } catch {
      // Graceful fallback
    }

    const order = ordersCache.find(o => o.id === id);
    if (order) {
      order.paid = method;
      order.status = 'Livrée';
      persist();
      return { ...order };
    }
    const fallback: Order = {
      id,
      date: 'Aujourd’hui',
      client: 'Client',
      phone: '',
      city: 'Abidjan',
      place: '',
      product: 'Produit Kolix',
      amount: 0,
      status: 'Livrée',
      note: '—',
      paid: method
    };
    ordersCache.unshift(fallback);
    persist();
    return fallback;
  },

  async create(dto: CreateOrderDto): Promise<Order> {
    const payload = {
      shop_id: dto.shop_id,
      shop_domain_or_slug: dto.shop_slug,
      product_id: dto.product_id,
      client_name: dto.client,
      client_phone: dto.phone,
      city: dto.city,
      delivery_place: dto.place,
      product_name: dto.product,
      amount: dto.amount,
      note: dto.note || '',
      payment_mode: 'COD_CASH',
      quantity: 1
    };

    let backendData: any = null;
    try {
      const res = await apiClient.post<any>(API_ENDPOINTS.ORDERS.BASE, payload);
      backendData = res?.data || res;
    } catch {
      try {
        const pubRes = await apiClient.post<any>('/api/v1/public/orders/checkout', payload);
        backendData = pubRes?.data || pubRes;
      } catch {
        // Offline
      }
    }

    const newOrder: Order = backendData
      ? mapBackendOrderToFrontend(backendData)
      : {
          id: `KX-${Math.floor(1000 + Math.random() * 9000)}`,
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
          paymentMode: 'COD_CASH'
        };

    ordersCache.unshift(newOrder);
    persist();
    return newOrder;
  }
};
