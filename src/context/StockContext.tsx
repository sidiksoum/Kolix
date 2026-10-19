import React, { createContext, useContext, useState, useEffect } from 'react';
import { InventoryItem, StockAlert, StockKpis } from '../types/inventory';
import { inventoryApi } from '../api/inventory.api';
import { toast } from 'sonner';

interface StockContextType {
  inventory: InventoryItem[];
  kpis: StockKpis | null;
  alerts: StockAlert[];
  threshold: number;
  updateQuantity: (id: string, delta: number) => Promise<void>;
  updateThreshold: (newVal: number) => Promise<void>;
  refreshStock: () => Promise<void>;
  isLoading: boolean;
}

const StockContext = createContext<StockContextType | undefined>(undefined);

export const StockProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [kpis, setKpis] = useState<StockKpis | null>(null);
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [threshold, setThreshold] = useState<number>(5);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshStock = async () => {
    try {
      setIsLoading(true);
      const [items, stats, alertItems] = await Promise.all([
        inventoryApi.getAll(),
        inventoryApi.getKpis(),
        inventoryApi.getAlerts()
      ]);
      setInventory(items);
      setKpis(stats);
      setAlerts(alertItems);
      setThreshold(inventoryApi.getThreshold());
    } catch {
      toast.error('Erreur lors du chargement des stocks');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshStock();
  }, []);

  const updateQuantity = async (id: string, delta: number) => {
    try {
      const updated = await inventoryApi.updateQuantity(id, delta);
      setInventory(prev => prev.map(item => item.id === id ? updated : item));
      const alertItems = await inventoryApi.getAlerts();
      setAlerts(alertItems);
      const stats = await inventoryApi.getKpis();
      setKpis(stats);
      toast.success(`Stock mis à jour pour ${updated.name}`);
    } catch {
      toast.error('Erreur de mise à jour du stock');
    }
  };

  const updateThreshold = async (newVal: number) => {
    try {
      const val = await inventoryApi.setGlobalThreshold(newVal);
      setThreshold(val);
      const [items, stats, alertItems] = await Promise.all([
        inventoryApi.getAll(),
        inventoryApi.getKpis(),
        inventoryApi.getAlerts()
      ]);
      setInventory(items);
      setKpis(stats);
      setAlerts(alertItems);
      toast.success(`Seuil d'alerte configuré à ${val} unités`);
    } catch {
      toast.error('Erreur lors de la mise à jour du seuil');
    }
  };

  return (
    <StockContext.Provider
      value={{
        inventory,
        kpis,
        alerts,
        threshold,
        updateQuantity,
        updateThreshold,
        refreshStock,
        isLoading
      }}
    >
      {children}
    </StockContext.Provider>
  );
};

export const useStock = () => {
  const context = useContext(StockContext);
  if (!context) throw new Error('useStock must be used within a StockProvider');
  return context;
};
