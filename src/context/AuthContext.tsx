import React, { createContext, useContext, useState } from 'react';
import { MerchantUser } from '../types/common';
import { INITIAL_USER } from '../api/mockData';

interface AuthContextType {
  user: MerchantUser;
  switchShop: (shopName: string, domain: string) => void;
  updatePlan: (plan: MerchantUser['currentShop']['plan']) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<MerchantUser>(INITIAL_USER);

  const switchShop = (shopName: string, domain: string) => {
    setUser(prev => ({
      ...prev,
      currentShop: {
        ...prev.currentShop,
        name: shopName,
        domain
      }
    }));
  };

  const updatePlan = (plan: MerchantUser['currentShop']['plan']) => {
    setUser(prev => ({
      ...prev,
      currentShop: {
        ...prev.currentShop,
        plan
      }
    }));
  };

  return (
    <AuthContext.Provider value={{ user, switchShop, updatePlan }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
