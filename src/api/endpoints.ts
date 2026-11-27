export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    REGISTER: '/api/v1/auth/register',
    ME: '/api/v1/auth/me',
    REFRESH: '/api/v1/auth/refresh',
    FORGOT_PASSWORD: '/api/v1/auth/forgot-password',
    VERIFY_RESET_OTP: '/api/v1/auth/verify-reset-otp',
    RESET_PASSWORD: '/api/v1/auth/reset-password',
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
    UPDATE_STOCK: (id: string) => `/api/v1/inventory/${id}/restock`,
    RESTOCK: (id: string) => `/api/v1/inventory/${id}/restock`,
    SET_THRESHOLD: (id: string) => `/api/v1/inventory/${id}/threshold`,
  },
  CLIENTS: {
    BASE: '/api/v1/clients',
    EXPORT: '/api/v1/clients/export',
  },
  WALLET: {
    SUMMARY: '/api/v1/wallet/summary',
    TRANSACTIONS: '/api/v1/wallet/transactions',
    WITHDRAW: '/api/v1/wallet/withdraw',
    ACCOUNTS: '/api/v1/wallet/accounts',
  },
  STORE: {
    BASE: '/api/v1/stores',
    TEMPLATES: '/api/v1/stores/templates',
    MY_STORES: '/api/v1/stores/my-stores',
    CREATE: '/api/v1/stores',
    DETAIL: (storeId: string) => `/api/v1/stores/${storeId}`,
    PRODUCTS: (storeId: string) => `/api/v1/stores/${storeId}/products`,
    CUSTOMIZATION: (storeId: string) => `/api/v1/stores/${storeId}/customization`,
    DOMAINS: (storeId: string) => `/api/v1/stores/${storeId}/domains`,
  },
  ANALYTICS: {
    DASHBOARD: (period: string) => `/api/v1/analytics/dashboard?period=${period}`,
    REPORTS: (period: string, grain: string = 'semaine') => `/api/v1/analytics/reports?period=${period}&grain=${grain}`,
    ZONES: '/api/v1/analytics/zones',
    TOP_PRODUCTS: '/api/v1/analytics/top-products',
  },
  ACCOUNTING: {
    DASHBOARD: (month?: string) => `/api/v1/accounting/dashboard${month ? `?month=${encodeURIComponent(month)}` : ''}`,
    CHARGES: '/api/v1/accounting/charges',
    DELETE_CHARGE: (id: string) => `/api/v1/accounting/charges/${id}`,
  },
  AI: {
    CHAT: '/api/v1/ai/chat',
  },
  WHATSAPP: {
    CAMPAIGNS: '/api/v1/whatsapp/campaigns',
    DELETE_CAMPAIGN: (id: string) => `/api/v1/whatsapp/campaigns/${id}`,
    AUDIENCES: '/api/v1/whatsapp/audiences',
  },
  AFFILIATES: {
    SUMMARY: '/api/v1/affiliates/summary',
    TRANSFER: '/api/v1/affiliates/transfer',
    SUBSCRIBE: '/api/v1/affiliates/subscribe-with-commissions',
  }
} as const;
