import React, { createContext, useContext, useState, useEffect } from 'react';
import { StoreTemplate, MerchantStore, StoreCustomization } from '../types/store';
import { storeApi } from '../api/store.api';
import { toast } from 'sonner';

interface StoreContextType {
  templates: StoreTemplate[];
  stores: MerchantStore[];
  activeTemplate: StoreTemplate | null;
  customization: StoreCustomization;
  selectedNiche: string;
  setSelectedNiche: (niche: string) => void;
  selectedStyle: string;
  setSelectedStyle: (style: string) => void;
  selectedPrice: string;
  setSelectedPrice: (price: string) => void;
  setActiveTemplate: (templateId: string) => Promise<void>;
  updateCustomColor: (color: string) => void;
  moveSection: (index: number, direction: 'up' | 'down') => void;
  refreshStoreData: () => Promise<void>;
  isLoading: boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [templates, setTemplates] = useState<StoreTemplate[]>([]);
  const [stores, setStores] = useState<MerchantStore[]>([]);
  const [customization, setCustomization] = useState<StoreCustomization>({
    storeId: 'shp_abidjan',
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

  const refreshStoreData = async () => {
    try {
      setIsLoading(true);
      const [tpls, strs, custom] = await Promise.all([
        storeApi.getTemplates(),
        storeApi.getMyStores(),
        storeApi.getCustomization('shp_abidjan')
      ]);
      setTemplates(tpls);
      setStores(strs);
      setCustomization(custom);
    } catch {
      toast.error('Erreur lors du chargement des boutiques');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshStoreData();
  }, []);

  const activeTemplate = templates.find(t => t.isActive) || templates[0] || null;

  const setActiveTemplate = async (templateId: string) => {
    try {
      await storeApi.setActiveTemplate('shp_abidjan', templateId);
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
        activeTemplate,
        customization,
        selectedNiche,
        setSelectedNiche,
        selectedStyle,
        setSelectedStyle,
        selectedPrice,
        setSelectedPrice,
        setActiveTemplate,
        updateCustomColor,
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
