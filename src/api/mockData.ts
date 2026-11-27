import { MerchantUser } from '../types/common';
import { Order } from '../types/order';
import { Product } from '../types/product';
import { InventoryItem, StockKpis } from '../types/inventory';
import { WalletSummary, WalletTransaction, PayoutAccount } from '../types/wallet';
import { StoreTemplate, MerchantStore, StoreCustomization } from '../types/store';
import { DashboardAnalytics } from '../types/analytics';

export const INITIAL_USER: MerchantUser = {
  id: 'usr_01',
  name: 'Marchand Kolix',
  initials: 'MK',
  email: '',
  phone: '',
  role: 'Propriétaire',
  currentShop: {
    id: '',
    name: 'Ma Boutique',
    domain: 'maboutique.kolix.shop',
    plan: 'Kolix Grow',
    ordersCount: 0,
    maxOrders: 1500
  }
};

export const INITIAL_ORDERS: Order[] = [];

export const INITIAL_PRODUCTS: Product[] = [];

export const INITIAL_INVENTORY: InventoryItem[] = [];

export const INITIAL_STOCK_KPIS: StockKpis = {
  totalValue: 0,
  underThresholdCount: 0,
  pendingRestockCount: 0,
  turnoverRate: '0 %',
  outOfStockCount: 0
};

export const INITIAL_WALLET: WalletSummary = {
  cashBalance: 0,
  digitalBalance: 0,
  pendingBalance: 0,
  withdrawnThisMonth: 0,
  pendingTransfer: 0,
  kolixCommission: 0,
  avgTransferTime: '< 15 min'
};

export const INITIAL_PAYOUT_ACCOUNTS: PayoutAccount[] = [];

export const INITIAL_TRANSACTIONS: WalletTransaction[] = [];

export const INITIAL_TEMPLATES: StoreTemplate[] = [
  { id: 'tpl_01', name: 'Aura Éclat', niche: 'Beauté, cosmétiques et soins capillaires', style: 'Moderne', price: 0, priceLabel: 'Gratuit', isFree: true, isActive: true, accentColor: '#6C4CF1', heroText: 'Sublimez votre beauté naturelle', subText: 'Soins premium livrés partout sous 24h' },
  { id: 'tpl_02', name: 'Luxe Noir', niche: 'Mode masculine', style: 'Audacieux', price: 9000, priceLabel: '15 USD (9 000 FCFA)', isFree: false, accentColor: '#16131F', heroText: 'L’élégance masculine sans compromis', subText: 'Costumes, souliers et maroquinerie d’exception' },
  { id: 'tpl_03', name: 'TechPulse', niche: 'Électronique et gadgets', style: 'Épuré', price: 9000, priceLabel: '15 USD (9 000 FCFA)', isFree: false, accentColor: '#0EA5E9', heroText: 'La technologie à portée de main', subText: 'Montres, audio et accessoires connectés de haute précision' },
  { id: 'tpl_04', name: 'Kente Prestige', niche: 'Produits locaux et artisanat', style: 'Luxe', price: 9000, priceLabel: '15 USD (9 000 FCFA)', isFree: false, accentColor: '#D97706', heroText: 'Le patrimoine et l’artisanat d’Afrique', subText: 'Pagnes traditionnels et créations d’artisans locaux' },
  { id: 'tpl_05', name: 'Nectar Vitalité', niche: 'Compléments alimentaires et bien-être', style: 'Épuré', price: 9000, priceLabel: '15 USD (9 000 FCFA)', isFree: false, accentColor: '#10B981', heroText: 'Votre cure de santé et détox quotidienne', subText: 'Formules naturelles 100 % certifiées' },
  { id: 'tpl_06', name: 'Maison Cosy', niche: 'Maison et électroménager', style: 'Moderne', price: 9000, priceLabel: '15 USD (9 000 FCFA)', isFree: false, accentColor: '#8B5CF6', heroText: 'L’art de vivre chez soi', subText: 'Ustensiles, déco et petit électroménager' },
  { id: 'tpl_07', name: 'Bébé Câlin', niche: 'Enfants et puériculture', style: 'Épuré', price: 9000, priceLabel: '15 USD (9 000 FCFA)', isFree: false, accentColor: '#EC4899', heroText: 'Le meilleur pour votre tout-petit', subText: 'Vêtements doux et jouets d’éveil testés et approuvés' },
  { id: 'tpl_08', name: 'Bijou Divin', niche: 'Bijoux et accessoires', style: 'Luxe', price: 9000, priceLabel: '15 USD (9 000 FCFA)', isFree: false, accentColor: '#F59E0B', heroText: 'Brillez en toute occasion', subText: 'Bijoux plaqué or, montres et parures de prestige' },
  { id: 'tpl_09', name: 'Vénus Chic', niche: 'Mode féminine', style: 'Moderne', price: 0, priceLabel: 'Gratuit', isFree: true, accentColor: '#F43F5E', heroText: 'Tendances mode féminine', subText: 'Robes, ensembles et accessoires tendance' }
];

export const INITIAL_STORES: MerchantStore[] = [];

export const INITIAL_CUSTOMIZATION: StoreCustomization = {
  storeId: '',
  primaryColor: '#6C4CF1',
  sections: [
    { id: 'header', label: 'En-tête et logo de la boutique', enabled: true, order: 1 },
    { id: 'banner', label: 'Bannière héro promotionnelle (1200×400)', enabled: true, order: 2 },
    { id: 'featured', label: 'Produits vedettes avec compte à rebours', enabled: true, order: 3 },
    { id: 'reviews', label: 'Témoignages clients & preuves sociales', enabled: true, order: 4 },
    { id: 'footer', label: 'Pied de page, WhatsApp & réassurance COD', enabled: true, order: 5 }
  ]
};

export const MOCK_DASHBOARD_DATA: Record<string, DashboardAnalytics> = {};
