import { apiClient } from './client';
import { API_ENDPOINTS } from './endpoints';
import { Product, ProductStatus, CreateProductDto } from '../types/product';
import { INITIAL_PRODUCTS } from './mockData';

let productsCache: Product[] = (() => {
  const saved = localStorage.getItem('kolix_products');
  if (saved) {
    try { return JSON.parse(saved); } catch {}
  }
  return [...INITIAL_PRODUCTS];
})();

function persist() {
  localStorage.setItem('kolix_products', JSON.stringify(productsCache));
}

export const productsApi = {
  async getAll(): Promise<Product[]> {
    try {
      const res = await apiClient.get<{ data: Product[] }>(API_ENDPOINTS.PRODUCTS.BASE);
      return res.data;
    } catch {
      return [...productsCache];
    }
  },

  async bulkUpdateStatus(ids: string[], status: ProductStatus): Promise<Product[]> {
    try {
      const res = await apiClient.post<{ data: Product[] }>(API_ENDPOINTS.PRODUCTS.BULK_STATUS, { ids, status });
      return res.data;
    } catch {
      productsCache = productsCache.map(p => ids.includes(p.id) ? { ...p, status } : p);
      persist();
      return [...productsCache];
    }
  },

  async create(dto: CreateProductDto): Promise<Product> {
    try {
      const res = await apiClient.post<{ data: Product }>(API_ENDPOINTS.PRODUCTS.BASE, dto);
      return res.data;
    } catch {
      const newProduct: Product = {
        id: `prd_${Date.now()}`,
        name: dto.name,
        status: 'Actif',
        stockMain: `${dto.stockQuantity} en stock`,
        stockRest: '',
        stockQuantity: dto.stockQuantity,
        price: dto.price,
        priceOld: dto.priceOld,
        sales30d: 0,
        category: dto.category,
        type: dto.type,
        hasCountdown: dto.hasCountdown
      };
      productsCache.unshift(newProduct);
      persist();
      return newProduct;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await apiClient.delete(API_ENDPOINTS.PRODUCTS.DETAIL(id));
    } catch {
      productsCache = productsCache.filter(p => p.id !== id);
      persist();
    }
  }
};
