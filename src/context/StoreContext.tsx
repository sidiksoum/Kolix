import React, { createContext, useContext, useState, useEffect } from 'react';
import { StoreTemplate, MerchantStore, StoreCustomization, CreateStoreDto, UpdateStoreDto } from '../types/store';
import { Product } from '../types/product';
import { storeApi } from '../api/store.api';
import { toast } from 'sonner';

interface StoreContextType {
  templates: StoreTemplate[];
  stores: MerchantStore[];
  activeStore: MerchantStore | null;
  activeTemplate: StoreTemplate | null;
  customization: StoreCustomization;
  storeProducts: Record<string, Product[]>;
  selectedNiche: string;
  setSelectedNiche: (niche: string) => void;
  selectedStyle: string;
  setSelectedStyle: (style: string) => void;
  selectedPrice: string;
  setSelectedPrice: (price: string) => void;
  setActiveTemplate: (templateId: string) => Promise<void>;
  switchActiveStore: (storeId: string) => Promise<void>;
  createStore: (data: CreateStoreDto) => Promise<MerchantStore>;
  updateStore: (storeId: string, data: UpdateStoreDto) => Promise<MerchantStore>;
  loadStoreProducts: (storeId: string) => Promise<Product[]>;
  updateCustomColor: (color: string) => void;
  saveCustomization: (custom: Partial<StoreCustomization>) => Promise<void>;
  moveSection: (index: number, direction: 'up' | 'down') => void;
  refreshStoreData: () => Promise<void>;
  isLoading: boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [templates, setTemplates] = useState<StoreTemplate[]>([]);
  const [stores, setStores] = useState<MerchantStore[]>([]);
  const [activeStore, setActiveStore] = useState<MerchantStore | null>(null);
  const [storeProducts, setStoreProducts] = useState<Record<string, Product[]>>({});
  const [customization, setCustomization] = useState<StoreCustomization>({
    storeId: '',
    primaryColor: '#6C4CF1',
    sections: [
      { id: 'header', label: 'En-tête et logo de la boutique', enabled: true, order: 1 },
      { id: 'banner', label: 'Bannière héro promotionnelle (1200×400)', enabled: true, order: 2 },
      { id: 'featured', label: 'Produits vedettes avec compte à rebours', enabled: true, order: 3 },
      { id: 'reviews', label: 'Témoignages clients & preuves sociales', enabled: true, order: 4 },
      { id: 'footer', label: 'Pied de page, WhatsApp & réassurance COD', enabled: true, order: 5 }
    ]
  });
  const [selectedNiche, setSelectedNiche] = useState<string>('all');
  const [selectedStyle, setSelectedStyle] = useState<string>('all');
  const [selectedPrice, setSelectedPrice] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadStoreProducts = async (storeId: string): Promise<Product[]> => {
    try {
      const prods = await storeApi.getStoreProducts(storeId);
      setStoreProducts(prev => ({ ...prev, [storeId]: prods }));
      return prods;
    } catch {
      return [];
    }
  };

  const refreshStoreData = async () => {
    try {
      setIsLoading(true);
      const [tpls, strs] = await Promise.all([
        storeApi.getTemplates(),
        storeApi.getMyStores()
      ]);
      setTemplates(tpls);
      setStores(strs);

      const savedActiveId = localStorage.getItem('kolix_active_shop_id');
      const found = strs.find(s => s.id === savedActiveId) || strs[0] || null;
      setActiveStore(found);

      if (found) {
        localStorage.setItem('kolix_active_shop_id', found.id);
        const [custom, prods] = await Promise.all([
          storeApi.getCustomization(found.id),
          storeApi.getStoreProducts(found.id)
        ]);
        setCustomization(custom);
        setStoreProducts(prev => ({ ...prev, [found.id]: prods }));
      }
    } catch {
      toast.error('Erreur lors du chargement des boutiques');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshStoreData();
  }, []);

  const switchActiveStore = async (storeId: string) => {
    const target = stores.find(s => s.id === storeId);
    if (!target) return;

    localStorage.setItem('kolix_active_shop_id', target.id);
    setActiveStore(target);
    setStores(prev => prev.map(s => ({ ...s, isActive: s.id === storeId })));

    try {
      const [custom, prods] = await Promise.all([
        storeApi.getCustomization(target.id),
        storeApi.getStoreProducts(target.id)
      ]);
      setCustomization(custom);
      setStoreProducts(prev => ({ ...prev, [target.id]: prods }));
      toast.success(`Boutique active : ${target.name}`);
    } catch {
      toast.error('Erreur lors de la synchronisation de la boutique');
    }
  };

  const createStore = async (data: CreateStoreDto): Promise<MerchantStore> => {
    try {
      const newSt = await storeApi.createStore(data);
      setStores(prev => [newSt, ...prev.map(s => ({ ...s, isActive: false }))]);
      setActiveStore(newSt);
      localStorage.setItem('kolix_active_shop_id', newSt.id);
      toast.success(`Boutique "${newSt.name}" créée avec succès !`);
      loadStoreProducts(newSt.id);
      return newSt;
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de la création de la boutique');
      throw err;
    }
  };

  const updateStore = async (storeId: string, data: UpdateStoreDto): Promise<MerchantStore> => {
    try {
      const updated = await storeApi.updateStore(storeId, data);
      setStores(prev => prev.map(s => s.id === storeId ? updated : s));
      if (activeStore?.id === storeId) {
        setActiveStore(updated);
      }
      toast.success(`Boutique "${updated.name}" mise à jour avec succès !`);
      return updated;
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de la mise à jour de la boutique');
      throw err;
    }
  };

  const activeTemplate = templates.find(t => t.isActive) || templates[0] || null;

  const setActiveTemplate = async (templateId: string) => {
    const storeId = activeStore?.id || stores[0]?.id || 'shp_abidjan';
    try {
      await storeApi.setActiveTemplate(storeId, templateId);
      setTemplates(prev => prev.map(t => ({ ...t, isActive: t.id === templateId })));
      const chosen = templates.find(t => t.id === templateId);
      if (chosen) {
        setCustomization(prev => ({ ...prev, primaryColor: chosen.accentColor }));
      }
      toast.success('Template appliqué à votre boutique en ligne !');
    } catch {
      toast.error('Erreur lors du changement de template');
    }
  };

  const updateCustomColor = (color: string) => {
    setCustomization(prev => ({ ...prev, primaryColor: color }));
    toast.success('Couleur mise à jour pour l’aperçu en direct');
  };

  const saveCustomization = async (custom: Partial<StoreCustomization>) => {
    const storeId = activeStore?.id || stores[0]?.id;
    if (!storeId) return;
    try {
      const saved = await storeApi.saveCustomization(storeId, custom);
      setCustomization(saved);
      toast.success('Personnalisation enregistrée avec succès !');
    } catch {
      toast.error('Erreur lors de l’enregistrement de la personnalisation');
    }
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...customization.sections];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newSections.length) return;

    const temp = newSections[index];
    newSections[index] = newSections[targetIdx];
    newSections[targetIdx] = temp;

    setCustomization(prev => ({ ...prev, sections: newSections }));
  };

  return (
    <StoreContext.Provider
      value={{
        templates,
        stores,
        activeStore,
        activeTemplate,
        customization,
        storeProducts,
        selectedNiche,
        setSelectedNiche,
        selectedStyle,
        setSelectedStyle,
        selectedPrice,
        setSelectedPrice,
        setActiveTemplate,
        switchActiveStore,
        createStore,
        updateStore,
        loadStoreProducts,
        updateCustomColor,
        saveCustomization,
        moveSection,
        refreshStoreData,
        isLoading
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within a StoreProvider');
  return context;
};
