// src/context/RealtimeContext.tsx
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { realtimeWs } from '../services/websocket.service';
import { toast } from 'sonner';

interface RealtimeContextType {
  isConnected: boolean;
  subscribe: (event: string, callback: (data: any) => void) => () => void;
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);

export const RealtimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, token } = useAuth();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const shopId = user?.currentShop?.id;
    if (shopId && token) {
      realtimeWs.connect(shopId, token);
    } else {
      realtimeWs.disconnect();
    }

    const unsubConnected = realtimeWs.on('SOCKET_CONNECTED', () => {
      setIsConnected(true);
    });

    const unsubDisconnected = realtimeWs.on('SOCKET_DISCONNECTED', () => {
      setIsConnected(false);
    });

    // Notifications temps réel discrètes & utiles
    const unsubOrderCreated = realtimeWs.on('ORDER_CREATED', (data: any) => {
      const orderId = data?.id || 'Nouvelle';
      const amt = data?.total_amount ? `${Number(data.total_amount).toLocaleString('fr-FR')} FCFA` : '';
      toast.info(`🔔 Nouvelle commande reçue (${orderId}) ${amt}`, {
        duration: 4000
      });
    });

    const unsubStatusChanged = realtimeWs.on('ORDER_STATUS_CHANGED', (data: any) => {
      const orderId = data?.id || '';
      const status = data?.status || '';
      if (status === 'Livrée') {
        toast.success(`🎉 Commande ${orderId} marquée comme livrée !`, { duration: 4000 });
      } else if (status === 'Reportée') {
        toast.warning(`⏳ Livraison reportée pour la commande ${orderId}`, { duration: 4000 });
      }
    });

    return () => {
      unsubConnected();
      unsubDisconnected();
      unsubOrderCreated();
      unsubStatusChanged();
    };
  }, [user?.currentShop?.id, token]);

  const subscribe = useCallback((event: string, callback: (data: any) => void) => {
    return realtimeWs.on(event, callback);
  }, []);

  return (
    <RealtimeContext.Provider value={{ isConnected, subscribe }}>
      {children}
    </RealtimeContext.Provider>
  );
};

export const useRealtime = () => {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error('useRealtime must be used within a RealtimeProvider');
  }
  return context;
};

