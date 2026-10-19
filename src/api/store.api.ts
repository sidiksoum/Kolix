import { apiClient } from './client';
import { API_ENDPOINTS } from './endpoints';
import { StoreTemplate, MerchantStore, StoreCustomization } from '../types/store';
import { INITIAL_TEMPLATES, INITIAL_STORES, INITIAL_CUSTOMIZATION } from './mockData';

let templatesCache: StoreTemplate[] = [...INITIAL_TEMPLATES];
let storesCache: MerchantStore[] = [...INITIAL_STORES];
let customizationCache: StoreCustomization = { ...INITIAL_CUSTOMIZATION };

export const storeApi = {
  async getTemplates(): Promise<StoreTemplate[]> {
    try {
      const res = await apiClient.get<{ data: StoreTemplate[] }>(API_ENDPOINTS.STORE.TEMPLATES);
      return res.data;
    } catch {
      return [...templatesCache];
    }
  },

  async getMyStores(): Promise<MerchantStore[]> {
    try {
      const res = await apiClient.get<{ data: MerchantStore[] }>(API_ENDPOINTS.STORE.MY_STORES);
      return res.data;
    } catch {
      return [...storesCache];
    }
  },

  async getCustomization(storeId: string): Promise<StoreCustomization> {
    try {
      const res = await apiClient.get<{ data: StoreCustomization }>(API_ENDPOINTS.STORE.CUSTOMIZATION(storeId));
      return res.data;
    } catch {
      return { ...customizationCache, storeId };
    }
  },

  async saveCustomization(storeId: string, custom: Partial<StoreCustomization>): Promise<StoreCustomization> {
    try {
      const res = await apiClient.put<{ data: StoreCustomization }>(API_ENDPOINTS.STORE.CUSTOMIZATION(storeId), custom);
      return res.data;
    } catch {
      customizationCache = { ...customizationCache, ...custom, storeId };
      return { ...customizationCache };
    }
  },

  async setActiveTemplate(storeId: string, templateId: string): Promise<void> {
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
