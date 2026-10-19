export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: {
    total?: number;
    page?: number;
    pageSize?: number;
  };
}

export type PeriodType = 'jour' | 'semaine' | 'mois';

export interface MerchantUser {
  id: string;
  name: string;
  initials: string;
  email: string;
  role: 'Propriétaire' | 'Gestionnaire' | 'Livreur' | 'Comptable';
  currentShop: {
    id: string;
    name: string;
    domain: string;
    plan: 'Kolix Starter' | 'Kolix Grow' | 'Kolix Pro' | 'Kolix Empire';
    ordersCount: number;
    maxOrders: number;
  };
}
