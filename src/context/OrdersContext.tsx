import React, { createContext, useContext, useState, useEffect } from 'react';
import { Order, OrderStatus, CreateOrderDto } from '../types/order';
import { ordersApi } from '../api/orders.api';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

interface OrdersContextType {
  orders: Order[];
  selectedOrderId: string | null;
  selectedOrder: Order | null;
  setSelectedOrderId: (id: string | null) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
  confirmPayment: (id: string, method: 'Espèces' | 'Mobile Money · Wave' | 'Mobile Money · Orange') => Promise<void>;
  createOrder: (dto: CreateOrderDto) => Promise<Order>;
  refreshOrders: () => Promise<void>;
  isLoading: boolean;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export const OrdersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>('KX-1048');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshOrders = async () => {
    try {
      setIsLoading(true);
      const data = await ordersApi.getAll();
      setOrders(data);
    } catch {
      toast.error('Erreur lors du chargement des commandes');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshOrders();
  }, []);

  const selectedOrder = orders.find(o => o.id === selectedOrderId) || null;

  const updateOrderStatus = async (id: string, status: OrderStatus) => {
    try {
      const updated = await ordersApi.updateStatus(id, status);
      setOrders(prev => prev.map(o => o.id === id ? updated : o));
      toast.success(`Statut de ${id} mis à jour : ${status}`);
      if (status === 'Livrée') {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
      }
    } catch {
      toast.error('Impossible de modifier le statut');
    }
  };

  const confirmPayment = async (id: string, method: 'Espèces' | 'Mobile Money · Wave' | 'Mobile Money · Orange') => {
    try {
      const updated = await ordersApi.confirmPayment(id, method);
      setOrders(prev => prev.map(o => o.id === id ? updated : o));
      toast.success(`Paiement de ${id} confirmé via ${method}`);
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.7 } });
    } catch {
      toast.error('Erreur lors de la confirmation du paiement');
    }
  };

  const createOrder = async (dto: CreateOrderDto) => {
    try {
      const created = await ordersApi.create(dto);
      setOrders(prev => [created, ...prev]);
      setSelectedOrderId(created.id);
      toast.success(`Commande ${created.id} créée avec succès`);
      return created;
    } catch (err) {
      toast.error('Erreur lors de la création de la commande');
      throw err;
    }
  };

  return (
    <OrdersContext.Provider
      value={{
        orders,
        selectedOrderId,
        selectedOrder,
        setSelectedOrderId,
        activeTab,
        setActiveTab,
        updateOrderStatus,
        confirmPayment,
        createOrder,
        refreshOrders,
        isLoading
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) throw new Error('useOrders must be used within an OrdersProvider');
  return context;
};
