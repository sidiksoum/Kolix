import { apiClient } from './client';
import { API_ENDPOINTS } from './endpoints';
import { Product, ProductStatus, CreateProductDto } from '../types/product';

// Clear any stale mock data in localStorage
try {
  const saved = localStorage.getItem('kolix_products');
  if (saved && saved.includes('Écouteurs Sans Fil Pro')) {
    localStorage.removeItem('kolix_products');
  }
} catch {}

function normalizeProduct(raw: any): Product {
  return {
    id: String(raw.id),
    shop_id: raw.shop_id ? String(raw.shop_id) : undefined,
    slug: raw.slug || '',
    name: raw.name || '',
    status: (raw.status as ProductStatus) || 'Actif',
    stockMain: raw.stock_main ?? raw.stockMain ?? `${raw.stock_quantity ?? raw.stockQuantity ?? 0} en stock`,
    stockRest: raw.stock_rest ?? raw.stockRest ?? '',
    stockQuantity: Number(raw.stock_quantity ?? raw.stockQuantity ?? 0),
    price: Number(raw.price || 0),
    priceOld: raw.price_old ?? raw.priceOld ? Number(raw.price_old ?? raw.priceOld) : undefined,
    sales30d: Number(raw.sales_30d ?? raw.sales30d ?? 0),
    category: raw.category || 'Électronique',
    type: raw.product_type ?? raw.type ?? 'Simple',
    hasCountdown: Boolean(raw.has_countdown ?? raw.hasCountdown),
    images: Array.isArray(raw.images) ? raw.images : [],
    description: raw.description || '',
    fiche_produit: raw.fiche_produit || undefined
  };
}

let productsCache: Product[] = (() => {
  const saved = localStorage.getItem('kolix_products');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && !parsed.some(p => p.name.includes('Écouteurs Sans Fil'))) {
        return parsed;
      }
    } catch {}
  }
  return [];
})();

function persist() {
  localStorage.setItem('kolix_products', JSON.stringify(productsCache));
}

export const productsApi = {
  async getAll(): Promise<Product[]> {
    try {
      const res = await apiClient.get<any>(API_ENDPOINTS.PRODUCTS.BASE);
      const list = Array.isArray(res.data) ? res.data : (Array.isArray(res) ? res : []);
      const normalized = list.map(normalizeProduct);
      productsCache = normalized;
      persist();
      return normalized;
    } catch (err) {
      console.warn('API getAll fallback to cache:', err);
      return [...productsCache];
    }
  },

  async getByIdOrSlug(idOrSlug: string): Promise<Product | null> {
    try {
      // Try public endpoint first for storefront rendering
      const res = await apiClient.get<any>(`/api/v1/public/product/${idOrSlug}`);
      if (res?.data) {
        return normalizeProduct(res.data);
      }
    } catch {
      // Try detail endpoint
      try {
        const res = await apiClient.get<any>(API_ENDPOINTS.PRODUCTS.DETAIL(idOrSlug));
        if (res?.data) return normalizeProduct(res.data);
      } catch {}
    }
    // Fallback search in cache
    const found = productsCache.find(p => p.id === idOrSlug || p.slug === idOrSlug);
    return found || null;
  },

  async bulkUpdateStatus(ids: string[], status: ProductStatus): Promise<Product[]> {
    try {
      await apiClient.post(API_ENDPOINTS.PRODUCTS.BULK_STATUS, {
        product_ids: ids,
        new_status: status
      });
      return await this.getAll();
    } catch (err) {
      console.warn('bulkUpdateStatus API failed, updating local state:', err);
      productsCache = productsCache.map(p => ids.includes(p.id) ? { ...p, status } : p);
      persist();
      return [...productsCache];
    }
  },

  async create(dto: CreateProductDto): Promise<Product> {
    try {
      const payload: any = {
        name: dto.name,
        category: dto.category,
        price: dto.price,
        price_old: dto.priceOld || null,
        stock_quantity: dto.stockQuantity,
        stock_main: dto.stockMain || 'Entrepôt Abidjan',
        stock_rest: dto.stockRest || 'Rayon boutique',
        product_type: dto.type || 'Simple',
        has_countdown: dto.hasCountdown || false,
        description: dto.description || '',
        images: dto.images || [],
        fiche_produit: dto.fiche_produit || null
      };
      if (dto.shop_id) {
        payload.shop_id = dto.shop_id;
      }

      const res = await apiClient.post<any>(API_ENDPOINTS.PRODUCTS.BASE, payload);
      const created = normalizeProduct(res.data || res);
      productsCache.unshift(created);
      persist();
      return created;
    } catch (err) {
      console.warn('create product API failed, creating locally:', err);
      const newProduct: Product = {
        id: `prd_${Date.now()}`,
        slug: dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + `-${Date.now().toString(36)}`,
        name: dto.name,
        status: 'Actif',
        stockMain: dto.stockMain || `${dto.stockQuantity} en stock`,
        stockRest: dto.stockRest || 'Rayon boutique',
        stockQuantity: dto.stockQuantity,
        price: dto.price,
        priceOld: dto.priceOld,
        sales30d: 0,
        category: dto.category,
        type: dto.type || 'Simple',
        hasCountdown: dto.hasCountdown,
        description: dto.description,
        images: dto.images,
        fiche_produit: dto.fiche_produit
      };
      productsCache.unshift(newProduct);
      persist();
      return newProduct;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await apiClient.delete(API_ENDPOINTS.PRODUCTS.DETAIL(id));
    } catch (err) {
      console.warn('delete product API error:', err);
    }
    productsCache = productsCache.filter(p => p.id !== id);
    persist();
  }
};
