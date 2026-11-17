import React, { createContext, useContext, useState, useEffect } from 'react';
import { MerchantUser } from '../types/common';
import { INITIAL_USER } from '../api/mockData';
import { authApi, AuthTokens, RegisterStep1Dto } from '../api/auth.api';
import { apiClient } from '../api/client';
import { toast } from 'sonner';

interface AuthContextType {
  user: MerchantUser;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<AuthTokens>;
  registerStep1: (data: RegisterStep1Dto) => Promise<{ user_id: string; email?: string; phone: string; message: string; otp_debug?: string }>;
  verifyOtp: (identifier: string, otp_code: string) => Promise<AuthTokens>;
  logout: () => void;
  switchShop: (shopName: string, domain: string) => void;
  updatePlan: (plan: MerchantUser['currentShop']['plan']) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<MerchantUser>(() => {
    try {
      const saved = localStorage.getItem('kolix_user_profile');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_USER;
  });

  const [token, setTokenState] = useState<string | null>(() => localStorage.getItem('kolix_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sync token and load user profile on startup
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('kolix_token');
      if (savedToken) {
        apiClient.setToken(savedToken);
        setTokenState(savedToken);
        try {
          const me = await authApi.getMe();
          if (me) {
            setUser(prev => ({
              ...prev,
              id: me.id || prev.id,
              name: me.full_name || prev.name,
              email: me.email || prev.email,
              role: (me.role as any) || prev.role,
              initials: (me.full_name || prev.name)
                .split(' ')
                .map((n: string) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2)
            }));
          }
        } catch {
          // Token expired or server unreachable, keep local state
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (identifier: string, password: string): Promise<AuthTokens> => {
    try {
      const tokens = await authApi.login({ identifier, password });
      setTokenState(tokens.access_token);

      const updatedUser: MerchantUser = {
        id: tokens.user_id,
        name: tokens.name,
        initials: tokens.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'SS',
        email: tokens.email,
        role: (tokens.role as any) || 'Propriétaire',
        currentShop: {
          id: tokens.shop_id || user.currentShop.id,
          name: tokens.shop_domain ? tokens.shop_domain.split('.')[0] : user.currentShop.name,
          domain: tokens.shop_domain || user.currentShop.domain,
          plan: user.currentShop.plan,
          ordersCount: user.currentShop.ordersCount,
          maxOrders: user.currentShop.maxOrders
        }
      };

      setUser(updatedUser);
      localStorage.setItem('kolix_user_profile', JSON.stringify(updatedUser));
      return tokens;
    } catch (err: any) {
      throw err;
    }
  };

  const registerStep1 = async (data: RegisterStep1Dto) => {
    return await authApi.registerStep1(data);
  };

  const verifyOtp = async (identifier: string, otp_code: string): Promise<AuthTokens> => {
    const isEmail = identifier.includes('@');
    const tokens = await authApi.verifyOtp({
      phone: isEmail ? undefined : identifier,
      email: isEmail ? identifier : undefined,
      identifier: identifier,
      otp_code
    });
    setTokenState(tokens.access_token);

    const updatedUser: MerchantUser = {
      id: tokens.user_id,
      name: tokens.name,
      initials: tokens.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'SS',
      email: tokens.email,
      role: (tokens.role as any) || 'Propriétaire',
      currentShop: {
        id: tokens.shop_id || user.currentShop.id,
        name: tokens.shop_domain ? tokens.shop_domain.split('.')[0] : 'Ma Boutique',
        domain: tokens.shop_domain || 'maboutique.kolix.ci',
        plan: 'Kolix Grow',
        ordersCount: 0,
        maxOrders: 1500
      }
    };

    setUser(updatedUser);
    localStorage.setItem('kolix_user_profile', JSON.stringify(updatedUser));
    return tokens;
  };

  const logout = () => {
    authApi.logout();
    setTokenState(null);
    localStorage.removeItem('kolix_user_profile');
    setUser(INITIAL_USER);
    toast.info('Vous êtes déconnecté.');
  };

  const switchShop = (shopName: string, domain: string) => {
    setUser(prev => {
      const next = {
        ...prev,
        currentShop: {
          ...prev.currentShop,
          name: shopName,
          domain
        }
      };
      localStorage.setItem('kolix_user_profile', JSON.stringify(next));
      return next;
    });
  };

  const updatePlan = (plan: MerchantUser['currentShop']['plan']) => {
    setUser(prev => {
      const next = {
        ...prev,
        currentShop: {
          ...prev.currentShop,
          plan
        }
      };
      localStorage.setItem('kolix_user_profile', JSON.stringify(next));
      return next;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        registerStep1,
        verifyOtp,
        logout,
        switchShop,
        updatePlan
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
