import { apiClient } from './client';
import { API_ENDPOINTS } from './endpoints';
import { StoreTemplate, MerchantStore, StoreCustomization, CreateStoreDto, UpdateStoreDto } from '../types/store';
import { Product } from '../types/product';
import { INITIAL_TEMPLATES, INITIAL_CUSTOMIZATION } from './mockData';

// Nettoyage proactif de tout vestige de boutiques mockées dans le navigateur
try {
  const saved = localStorage.getItem('kolix_my_stores');
  if (saved && (saved.includes('shp_abidjan') || saved.includes('Élégance & Tech'))) {
    localStorage.removeItem('kolix_my_stores');
  }
} catch {}

let templatesCache: StoreTemplate[] = [...INITIAL_TEMPLATES];
let storesCache: MerchantStore[] = [];
let customizationCache: StoreCustomization = { ...INITIAL_CUSTOMIZATION };

function getInitials(name: string): string {
  if (!name) return 'BK';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export const storeApi = {
  async getTemplates(): Promise<StoreTemplate[]> {
    try {
      const res = await apiClient.get<{ data: any[] }>(API_ENDPOINTS.STORE.TEMPLATES);
      if (res && Array.isArray(res.data) && res.data.length > 0) {
        return res.data.map((t: any) => ({
          id: String(t.id || t.slug),
          name: t.name,
          niche: t.niche || 'Toutes niches',
          style: t.style || 'Moderne',
          price: t.price || 0,
          priceLabel: t.price_label || (t.is_free ? 'Gratuit' : '9 000 FCFA'),
          isFree: t.is_free ?? true,
          accentColor: t.accent_color || '#6C4CF1',
          heroText: t.hero_text,
          subText: t.sub_text
        }));
      }
      return [...templatesCache];
    } catch {
      return [...templatesCache];
    }
  },

  async getMyStores(): Promise<MerchantStore[]> {
    try {
      const activeSavedId = localStorage.getItem('kolix_active_shop_id');
      const res = await apiClient.get<{ data: any[] }>(API_ENDPOINTS.STORE.MY_STORES);
      const items = res?.data || res;
      if (Array.isArray(items)) {
        const mapped = items.map((s: any, idx: number) => {
          const isAct = activeSavedId ? String(s.id) === activeSavedId : (s.is_active || idx === 0);
          return {
            id: String(s.id),
            name: s.name,
            domain: s.domain,
            custom_domain: s.custom_domain,
            customDomain: s.custom_domain,
            templateId: s.template_id || 'aura_eclat',
            templateName: s.template_name || 'Kolix Essentiel',
            productsCount: s.products_count ?? 0,
            ordersCount7d: s.orders_count_7d ?? 0,
            status: (s.status || 'En ligne') as any,
            isActive: isAct,
            initials: getInitials(s.name),
            accentColor: s.accent_color || '#6C4CF1',
            plan: s.plan || 'Grow',
            maxOrders: s.max_orders,
            ordersCount: s.orders_count,
            logoUrl: s.logo_url
          };
        });
        storesCache = mapped;
        try {
          localStorage.setItem('kolix_my_stores', JSON.stringify(mapped));
        } catch {}
        return mapped;
      }
    } catch {
      // Échec réseau : tentative de lecture du cache réel local
    }

    try {
      const saved = localStorage.getItem('kolix_my_stores');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && !parsed.some(s => s.id === 'shp_abidjan')) {
          return parsed;
        }
      }
    } catch {}

    return storesCache;
  },

  async createStore(data: CreateStoreDto): Promise<MerchantStore> {
    const res = await apiClient.post<{ data: any }>(API_ENDPOINTS.STORE.CREATE, data);
    const s = res.data;
    const newStore: MerchantStore = {
      id: String(s.id),
      name: s.name,
      domain: s.domain,
      custom_domain: s.custom_domain,
      customDomain: s.custom_domain,
      templateId: s.template_id || 'aura_eclat',
      templateName: s.template_name || 'Kolix Essentiel',
      productsCount: s.products_count ?? 0,
      ordersCount7d: s.orders_count_7d ?? 0,
      status: (s.status || 'En ligne') as any,
      isActive: true,
      initials: getInitials(s.name),
      accentColor: s.accent_color || '#6C4CF1',
      plan: s.plan || 'Grow',
      maxOrders: s.max_orders,
      ordersCount: s.orders_count,
      logoUrl: s.logo_url
    };
    storesCache = [newStore, ...storesCache];
    localStorage.setItem('kolix_active_shop_id', newStore.id);
    return newStore;
  },

  async updateStore(storeId: string, data: UpdateStoreDto): Promise<MerchantStore> {
    const res = await apiClient.put<{ data: any }>(API_ENDPOINTS.STORE.DETAIL(storeId), data);
    const s = res?.data || res;
    const updated: MerchantStore = {
      id: String(s.id),
      name: s.name,
      domain: s.domain,
      custom_domain: s.custom_domain,
      customDomain: s.custom_domain,
      templateId: s.template_id || 'aura_eclat',
      templateName: s.template_name || 'Kolix Essentiel',
      productsCount: s.products_count ?? 0,
      ordersCount7d: s.orders_count_7d ?? 0,
      status: (s.status || 'En ligne') as any,
      isActive: true,
      initials: getInitials(s.name),
      accentColor: s.accent_color || '#6C4CF1',
      plan: s.plan || 'Grow',
      maxOrders: s.max_orders,
      ordersCount: s.orders_count,
      logoUrl: s.logo_url
    };
    storesCache = storesCache.map(st => st.id === storeId ? updated : st);
    try {
      localStorage.setItem('kolix_my_stores', JSON.stringify(storesCache));
    } catch {}
    return updated;
  },

  async getStoreProducts(storeId: string): Promise<Product[]> {
    try {
      const res = await apiClient.get<{ data: any[] }>(API_ENDPOINTS.STORE.PRODUCTS(storeId));
      if (res && Array.isArray(res.data)) {
        return res.data.map((p: any) => ({
          id: String(p.id),
          name: p.name,
          slug: p.slug,
          category: p.category,
          price: Number(p.price),
          priceOld: p.price_old ? Number(p.price_old) : undefined,
          stockQuantity: p.stock_quantity ?? 0,
          stockMain: p.stock_main || 'Entrepôt Abidjan',
          stockRest: p.stock_rest || 'Rayon boutique',
          status: p.status || 'Actif',
          type: p.product_type || p.type || 'Simple',
          sales30d: p.sales_30d ?? 0,
          hasCountdown: Boolean(p.has_countdown),
          description: p.description || '',
          images: p.images || [],
          fiche_produit: p.fiche_produit,
          shop_id: p.shop_id,
          shop_name: p.shop_name,
          shop_domain: p.shop_domain,
          created_at: p.created_at
        }));
      }
      return [];
    } catch {
      return [];
    }
  },

  async getCustomization(storeId: string): Promise<StoreCustomization> {
    try {
      const res = await apiClient.get<{ data: any }>(API_ENDPOINTS.STORE.CUSTOMIZATION(storeId));
      if (res?.data) {
        return {
          storeId: String(res.data.shop_id || storeId),
          logoUrl: res.data.logo_url,
          bannerUrl: res.data.banner_url,
          primaryColor: res.data.primary_color || '#6C4CF1',
          sections: res.data.sections || customizationCache.sections
        };
      }
      return { ...customizationCache, storeId };
    } catch {
      return { ...customizationCache, storeId };
    }
  },

  async saveCustomization(storeId: string, custom: Partial<StoreCustomization>): Promise<StoreCustomization> {
    try {
      const payload: any = {
        primary_color: custom.primaryColor,
        logo_url: custom.logoUrl,
        banner_url: custom.bannerUrl,
        sections: custom.sections
      };
      const res = await apiClient.put<{ data: any }>(API_ENDPOINTS.STORE.CUSTOMIZATION(storeId), payload);
      return {
        storeId,
        logoUrl: res.data?.logo_url,
        bannerUrl: res.data?.banner_url,
        primaryColor: res.data?.primary_color || '#6C4CF1',
        sections: res.data?.sections || custom.sections || []
      };
    } catch {
      customizationCache = { ...customizationCache, ...custom, storeId };
      return { ...customizationCache };
    }
  },

  async setActiveTemplate(storeId: string, templateId: string): Promise<void> {
    try {
      await apiClient.put(API_ENDPOINTS.STORE.CUSTOMIZATION(storeId), { template_id: templateId });
    } catch {}
    templatesCache = templatesCache.map(t => ({
      ...t,
      isActive: t.id === templateId
    }));
    const tpl = templatesCache.find(t => t.id === templateId);
    storesCache = storesCache.map(s => {
      if (s.id === storeId && tpl) {
        return { ...s, templateId: tpl.id, templateName: tpl.name, accentColor: tpl.accentColor };
      }
      return s;
    });
  }
};
