export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    REGISTER: '/api/v1/auth/register',
    ME: '/api/v1/auth/me',
    REFRESH: '/api/v1/auth/refresh',
  },
  ORDERS: {
    BASE: '/api/v1/orders',
    DETAIL: (id: string) => `/api/v1/orders/${id}`,
    UPDATE_STATUS: (id: string) => `/api/v1/orders/${id}/status`,
    CONFIRM_PAYMENT: (id: string) => `/api/v1/orders/${id}/pay`,
    EXPORT: '/api/v1/orders/export',
  },
  PRODUCTS: {
    BASE: '/api/v1/products',
    DETAIL: (id: string) => `/api/v1/products/${id}`,
    BULK_STATUS: '/api/v1/products/bulk-status',
    CATEGORIES: '/api/v1/products/categories',
  },
  INVENTORY: {
    BASE: '/api/v1/inventory',
    KPIS: '/api/v1/inventory/kpis',
    ALERTS: '/api/v1/inventory/alerts',
    UPDATE_STOCK: (id: string) => `/api/v1/inventory/${id}`,
    SET_THRESHOLD: '/api/v1/inventory/threshold',
  },
  WALLET: {
    SUMMARY: '/api/v1/wallet/summary',
    TRANSACTIONS: '/api/v1/wallet/transactions',
    WITHDRAW: '/api/v1/wallet/withdraw',
    ACCOUNTS: '/api/v1/wallet/accounts',
  },
  STORE: {
    TEMPLATES: '/api/v1/stores/templates',
    MY_STORES: '/api/v1/stores/my-stores',
    CUSTOMIZATION: (storeId: string) => `/api/v1/stores/${storeId}/customization`,
    DOMAINS: (storeId: string) => `/api/v1/stores/${storeId}/domains`,
  },
  ANALYTICS: {
    DASHBOARD: (period: string) => `/api/v1/analytics/dashboard?period=${period}`,
    ZONES: '/api/v1/analytics/zones',
    TOP_PRODUCTS: '/api/v1/analytics/top-products',
  },
  AI: {
    CHAT: '/api/v1/ai/chat',
  }
} as const;
