import { MerchantUser } from '../types/common';
import { Order } from '../types/order';
import { Product } from '../types/product';
import { InventoryItem, StockAlert, StockKpis } from '../types/inventory';
import { WalletSummary, WalletTransaction, PayoutAccount } from '../types/wallet';
import { StoreTemplate, MerchantStore, StoreCustomization } from '../types/store';
import { DashboardAnalytics } from '../types/analytics';

export const INITIAL_USER: MerchantUser = {
  id: 'usr_01',
  name: 'Souleymane Sanogo',
  initials: 'SS',
  email: 'souleymane@kolix.ci',
  role: 'Propriétaire',
  currentShop: {
    id: 'shp_abidjan',
    name: 'Élégance & Tech Abidjan',
    domain: 'elegance-tech.kolix.shop',
    plan: 'Kolix Grow',
    ordersCount: 412,
    maxOrders: 1500
  }
};

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'KX-1048',
    date: '18 oct. · 10:42',
    client: 'Aya Kouassi',
    phone: '07 08 12 34 48',
    city: 'Cocody',
    place: 'Cocody Angré, 8e tranche, près de la pharmacie',
    product: 'Sérum éclat 30 ml ×2',
    amount: 18500,
    status: 'En cours',
    note: 'Livrer après 17 h, appeler avant.',
    paid: null,
    qrPayload: 'KOLIX-PAY:KX-1048:18500:XOF:AYA-KOUASSI',
    paymentMode: 'COD_MOMO'
  },
  {
    id: 'KX-1047',
    date: '18 oct. · 09:15',
    client: 'Moussa Diarra',
    phone: '05 45 21 77 21',
    city: 'Yopougon',
    place: 'Yopougon Maroc, rue des Jardins',
    product: 'Écouteurs sans fil',
    amount: 24000,
    status: 'Livrée',
    note: '—',
    paid: 'Mobile Money · Wave',
    qrPayload: 'KOLIX-PAY:KX-1047:24000:XOF:MOUSSA-DIARRA',
    paymentMode: 'COD_MOMO'
  },
  {
    id: 'KX-1046',
    date: '17 oct. · 18:03',
    client: 'Fatou Bamba',
    phone: '01 18 66 90 07',
    city: 'Bouaké',
    place: 'Bouaké, quartier Commerce',
    product: 'Sac bandoulière cuir',
    amount: 12000,
    status: 'Reportée',
    note: 'Absente jusqu’au 21 oct.',
    paid: null,
    qrPayload: 'KOLIX-PAY:KX-1046:12000:XOF:FATOU-BAMBA',
    paymentMode: 'COD_CASH'
  },
  {
    id: 'KX-1045',
    date: '17 oct. · 14:30',
    client: 'Konan Yao',
    phone: '07 72 03 15 64',
    city: 'Marcory',
    place: 'Marcory Zone 4, rue Paul Langevin',
    product: 'Montre connectée X2',
    amount: 22000,
    status: 'Livrée',
    note: '—',
    paid: 'Espèces',
    qrPayload: 'KOLIX-PAY:KX-1045:22000:XOF:KONAN-YAO',
    paymentMode: 'COD_CASH'
  },
  {
    id: 'KX-1044',
    date: '17 oct. · 11:12',
    client: 'Mariam Touré',
    phone: '01 54 39 82 11',
    city: 'Abobo',
    place: 'Abobo Gare',
    product: 'Gaine amincissante',
    amount: 9000,
    status: 'Contestée',
    note: 'Dit ne pas avoir commandé.',
    paid: null,
    qrPayload: 'KOLIX-PAY:KX-1044:9000:XOF:MARIAM-TOURE',
    paymentMode: null
  },
  {
    id: 'KX-1043',
    date: '16 oct. · 20:47',
    client: 'Ibrahim Koné',
    phone: '05 33 10 46 28',
    city: 'Treichville',
    place: 'Treichville, avenue 16',
    product: 'Montre connectée X2',
    amount: 22000,
    status: 'Injoignable',
    note: '3 appels sans réponse.',
    paid: null,
    qrPayload: 'KOLIX-PAY:KX-1043:22000:XOF:IBRAHIM-KONE',
    paymentMode: null
  },
  {
    id: 'KX-1042',
    date: '16 oct. · 16:20',
    client: 'Adjoua N’Guessan',
    phone: '01 90 07 23 55',
    city: 'Bingerville',
    place: 'Bingerville, cité Akwaba',
    product: 'Lisseur céramique',
    amount: 15000,
    status: 'En cours',
    note: '—',
    paid: null,
    qrPayload: 'KOLIX-PAY:KX-1042:15000:XOF:ADJOUA-NGUESSAN',
    paymentMode: 'COD_MOMO'
  },
  {
    id: 'KX-1041',
    date: '16 oct. · 09:05',
    client: 'Serge Kouamé',
    phone: '07 11 84 62 09',
    city: 'Yamoussoukro',
    place: 'Yamoussoukro, quartier 220 logements',
    product: 'Sérum éclat 30 ml',
    amount: 9250,
    status: 'Annulée',
    note: 'A changé d’avis.',
    paid: null,
    qrPayload: 'KOLIX-PAY:KX-1041:9250:XOF:SERGE-KOUAME',
    paymentMode: null
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prd_01',
    name: 'Montre connectée X2',
    status: 'Actif',
    stockMain: '12 en stock',
    stockRest: ' (4 réservés)',
    stockQuantity: 12,
    price: 22000,
    priceOld: 28000,
    sales30d: 148,
    category: 'Électronique',
    type: 'Standard',
    hasCountdown: true
  },
  {
    id: 'prd_02',
    name: 'Sérum éclat 30 ml',
    status: 'Actif',
    stockMain: '24 en stock',
    stockRest: ' (2 réservés)',
    stockQuantity: 24,
    price: 9250,
    priceOld: 12000,
    sales30d: 182,
    category: 'Beauté & Soins',
    type: 'Standard',
    hasCountdown: false
  },
  {
    id: 'prd_03',
    name: 'Écouteurs sans fil Pro',
    status: 'Actif',
    stockMain: '18 en stock',
    stockRest: ' (5 réservés)',
    stockQuantity: 18,
    price: 24000,
    sales30d: 96,
    category: 'Électronique',
    type: 'Standard',
    hasCountdown: false
  },
  {
    id: 'prd_04',
    name: 'Lisseur céramique Pro',
    status: 'Actif',
    stockMain: '3 en stock',
    stockRest: ' (1 réservé)',
    stockQuantity: 3,
    price: 15000,
    priceOld: 19000,
    sales30d: 64,
    category: 'Beauté',
    type: 'Standard',
    hasCountdown: true
  },
  {
    id: 'prd_05',
    name: 'Sac bandoulière cuir',
    status: 'Actif',
    stockMain: '15 en stock',
    stockRest: '',
    stockQuantity: 15,
    price: 12000,
    sales30d: 52,
    category: 'Mode',
    type: 'Standard',
    hasCountdown: false
  },
  {
    id: 'prd_06',
    name: 'Robe de soirée sirène',
    status: 'Actif',
    stockMain: '8 en stock',
    stockRest: '',
    stockQuantity: 8,
    price: 35000,
    priceOld: 42000,
    sales30d: 44,
    category: 'Mode féminine',
    type: 'Variante',
    hasCountdown: false
  },
  {
    id: 'prd_07',
    name: 'Gaine amincissante Latex',
    status: 'Brouillon',
    stockMain: '0 en stock',
    stockRest: ' (Rupture)',
    stockQuantity: 0,
    price: 9000,
    sales30d: 22,
    category: 'Beauté & Bien-être',
    type: 'Standard',
    hasCountdown: false
  },
  {
    id: 'prd_08',
    name: 'Thé détox naturel 28 jours',
    status: 'Actif',
    stockMain: '32 en stock',
    stockRest: '',
    stockQuantity: 32,
    price: 6500,
    sales30d: 110,
    category: 'Compléments',
    type: 'Pack',
    hasCountdown: false
  }
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 'stk_01', num: '01', name: 'Montre connectée X2', q: 50, qv: 38, qr: 12, seuil: 5, status: 'Optimal', pu: 12000, total: 144000 },
  { id: 'stk_02', num: '02', name: 'Sérum éclat 30 ml', q: 100, qv: 76, qr: 24, seuil: 5, status: 'Optimal', pu: 4500, total: 108000 },
  { id: 'stk_03', num: '03', name: 'Écouteurs sans fil Pro', q: 40, qv: 22, qr: 18, seuil: 5, status: 'Optimal', pu: 13500, total: 243000 },
  { id: 'stk_04', num: '04', name: 'Lisseur céramique Pro', q: 30, qv: 27, qr: 3, seuil: 5, status: 'Critique', pu: 8000, total: 24000 },
  { id: 'stk_05', num: '05', name: 'Sac bandoulière cuir', q: 35, qv: 20, qr: 15, seuil: 5, status: 'Optimal', pu: 6000, total: 90000 },
  { id: 'stk_06', num: '06', name: 'Robe soirée sirène', q: 20, qv: 12, qr: 8, seuil: 5, status: 'Optimal', pu: 18000, total: 144000 },
  { id: 'stk_07', num: '07', name: 'Gaine amincissante', q: 40, qv: 40, qr: 0, seuil: 5, status: 'Rupture', pu: 4000, total: 0 },
  { id: 'stk_08', num: '08', name: 'Thé détox naturel', q: 80, qv: 48, qr: 32, seuil: 5, status: 'Optimal', pu: 2800, total: 89600 },
  { id: 'stk_09', num: '09', name: 'Parfum Royal Oud 50 ml', q: 25, qv: 21, qr: 4, seuil: 5, status: 'Faible', pu: 9500, total: 38000 },
  { id: 'stk_10', num: '10', name: 'Pagne Kita Tissé', q: 15, qv: 13, qr: 2, seuil: 5, status: 'Critique', pu: 22000, total: 44000 },
  { id: 'stk_11', num: '11', name: 'Diffuseur huiles essentielles', q: 30, qv: 18, qr: 12, seuil: 5, status: 'Optimal', pu: 7000, total: 84000 }
];

export const INITIAL_STOCK_KPIS: StockKpis = {
  totalValue: 1008600,
  underThresholdCount: 4,
  pendingRestockCount: 2,
  turnoverRate: '84 %',
  outOfStockCount: 1
};

export const INITIAL_WALLET: WalletSummary = {
  cashBalance: 1320000,
  digitalBalance: 845000,
  pendingBalance: 65000,
  withdrawnThisMonth: 1250000,
  pendingTransfer: 65000,
  kolixCommission: 24500,
  avgTransferTime: '< 15 min'
};

export const INITIAL_PAYOUT_ACCOUNTS: PayoutAccount[] = [
  { id: 'acc_01', name: 'Wave Souleymane', num: '07 08 12 34 48', provider: 'Wave', isDefault: true, logoBg: '#1DC4FF', initial: 'W' },
  { id: 'acc_02', name: 'Orange Money Business', num: '07 58 90 12 33', provider: 'Orange Money', isDefault: false, logoBg: '#FF7900', initial: 'OM' },
  { id: 'acc_03', name: 'MTN MoMo CI', num: '05 44 22 11 00', provider: 'MTN MoMo', isDefault: false, logoBg: '#FFCC00', initial: 'M' },
  { id: 'acc_04', name: 'Ecobank CI', num: 'CI059 01001 2004589001 22', provider: 'Virement bancaire', isDefault: false, logoBg: '#005C8A', initial: 'E' }
];

export const INITIAL_TRANSACTIONS: WalletTransaction[] = [
  { id: 'tx_01', date: '18 oct. · 10:45', ref: 'KX-1048 · Encaissé Wave', who: 'Aya Kouassi', mode: 'Wave', status: 'Validé', amount: 18500, isCredit: true, isCash: false },
  { id: 'tx_02', date: '18 oct. · 09:16', ref: 'KX-1047 · Encaissé Wave', who: 'Moussa Diarra', mode: 'Wave', status: 'Validé', amount: 24000, isCredit: true, isCash: false },
  { id: 'tx_03', date: '17 oct. · 19:00', ref: 'Retrait vers Wave (0708***48)', who: 'Compte personnel', mode: 'Wave', status: 'Validé', amount: -250000, isCredit: false, isCash: false },
  { id: 'tx_04', date: '17 oct. · 14:32', ref: 'KX-1045 · Espèces Livreur', who: 'Konan Yao', mode: 'Espèces', status: 'Validé', amount: 22000, isCredit: true, isCash: true },
  { id: 'tx_05', date: '17 oct. · 11:20', ref: 'KX-1040 · Encaissé Orange Money', who: 'Kady Sangaré', mode: 'Orange Money', status: 'Validé', amount: 35000, isCredit: true, isCash: false },
  { id: 'tx_06', date: '16 oct. · 17:40', ref: 'Retrait vers Orange Money', who: 'Compte pro', mode: 'Orange Money', status: 'Validé', amount: -150000, isCredit: false, isCash: false },
  { id: 'tx_07', date: '16 oct. · 12:15', ref: 'KX-1038 · Encaissé MTN MoMo', who: 'Marc Gnahoré', mode: 'MTN MoMo', status: 'Validé', amount: 15000, isCredit: true, isCash: false }
];

export const INITIAL_TEMPLATES: StoreTemplate[] = [
  { id: 'tpl_01', name: 'Aura Éclat', niche: 'Beauté, cosmétiques et soins capillaires', style: 'Moderne', price: 0, priceLabel: 'Gratuit', isFree: true, isActive: true, accentColor: '#6C4CF1', heroText: 'Sublimez votre beauté naturelle', subText: 'Soins premium livrés partout à Abidjan sous 24h' },
  { id: 'tpl_02', name: 'Luxe Noir', niche: 'Mode masculine', style: 'Audacieux', price: 9000, priceLabel: '15 USD (9 000 FCFA)', isFree: false, accentColor: '#16131F', heroText: 'L’élégance masculine sans compromis', subText: 'Costumes, souliers et maroquinerie d’exception' },
  { id: 'tpl_03', name: 'TechPulse', niche: 'Électronique et gadgets', style: 'Épuré', price: 9000, priceLabel: '15 USD (9 000 FCFA)', isFree: false, accentColor: '#0EA5E9', heroText: 'La technologie à portée de main', subText: 'Montres, audio et accessoires connectés de haute précision' },
  { id: 'tpl_04', name: 'Kente Prestige', niche: 'Produits locaux et artisanat', style: 'Luxe', price: 9000, priceLabel: '15 USD (9 000 FCFA)', isFree: false, accentColor: '#D97706', heroText: 'Le patrimoine et l’artisanat d’Afrique', subText: 'Pagnes traditionnels et créations d’artisans locaux' },
  { id: 'tpl_05', name: 'Nectar Vitalité', niche: 'Compléments alimentaires et bien-être', style: 'Épuré', price: 9000, priceLabel: '15 USD (9 000 FCFA)', isFree: false, accentColor: '#10B981', heroText: 'Votre cure de santé et détox quotidienne', subText: 'Formules naturelles 100 % certifiées' },
  { id: 'tpl_06', name: 'Maison Cosy', niche: 'Maison et électroménager', style: 'Moderne', price: 9000, priceLabel: '15 USD (9 000 FCFA)', isFree: false, accentColor: '#8B5CF6', heroText: 'L’art de vivre chez soi', subText: 'Ustensiles, déco et petit électroménager' },
  { id: 'tpl_07', name: 'Bébé Câlin', niche: 'Enfants et puériculture', style: 'Épuré', price: 9000, priceLabel: '15 USD (9 000 FCFA)', isFree: false, accentColor: '#EC4899', heroText: 'Le meilleur pour votre tout-petit', subText: 'Vêtements doux et jouets d’éveil testés et approuvés' },
  { id: 'tpl_08', name: 'Bijou Divin', niche: 'Bijoux et accessoires', style: 'Luxe', price: 9000, priceLabel: '15 USD (9 000 FCFA)', isFree: false, accentColor: '#F59E0B', heroText: 'Brillez en toute occasion', subText: 'Bijoux plaqué or, montres et parures de prestige' },
  { id: 'tpl_09', name: 'Vénus Chic', niche: 'Mode féminine', style: 'Moderne', price: 0, priceLabel: 'Gratuit', isFree: true, accentColor: '#F43F5E', heroText: 'Tendances mode féminine', subText: 'Robes, ensembles et accessoires tendance' }
];

export const INITIAL_STORES: MerchantStore[] = [
  {
    id: 'shp_abidjan',
    name: 'Élégance & Tech Abidjan',
    domain: 'elegance-tech.kolix.shop',
    templateId: 'tpl_01',
    templateName: 'Aura Éclat',
    productsCount: 8,
    ordersCount7d: 104,
    status: 'En ligne',
    isActive: true,
    initials: 'ET',
    accentColor: '#6C4CF1'
  },
  {
    id: 'shp_cosmetics',
    name: 'Glow Cosmetics CI',
    domain: 'glow-cosmetics.kolix.shop',
    templateId: 'tpl_09',
    templateName: 'Vénus Chic',
    productsCount: 14,
    ordersCount7d: 87,
    status: 'En ligne',
    isActive: false,
    initials: 'GC',
    accentColor: '#F43F5E'
  }
];

export const INITIAL_CUSTOMIZATION: StoreCustomization = {
  storeId: 'shp_abidjan',
  primaryColor: '#6C4CF1',
  sections: [
    { id: 'header', label: 'En-tête et logo de la boutique', enabled: true, order: 1 },
    { id: 'banner', label: 'Bannière héro promotionnelle (1200×400)', enabled: true, order: 2 },
    { id: 'featured', label: 'Produits vedettes avec compte à rebours', enabled: true, order: 3 },
    { id: 'reviews', label: 'Témoignages clients & preuves sociales', enabled: true, order: 4 },
    { id: 'footer', label: 'Pied de page, WhatsApp & réassurance COD', enabled: true, order: 5 }
  ]
};

export const MOCK_DASHBOARD_DATA: Record<string, DashboardAnalytics> = {
  mois: {
    period: 'mois',
    periodLabel: '12 derniers mois',
    conversionRate: '86 %',
    kpis: [
      { id: 'ca', label: 'Chiffre d’affaires (FCFA)', value: '34 470 000', rawValue: 34470000, trend: '+18,6 %', isPositive: true, iconName: 'DollarSign', iconBg: '#E9E3FD', iconFg: '#4B2FC9' },
      { id: 'visites', label: 'Visites boutique', value: '132 500', rawValue: 132500, trend: '+15,2 %', isPositive: true, iconName: 'Eye', iconBg: '#E3EEFF', iconFg: '#1F4FA8' },
      { id: 'commandes', label: 'Commandes reçues', value: '3 640', rawValue: 3640, trend: '+16,9 %', isPositive: true, iconName: 'ShoppingBag', iconBg: '#FFEBDD', iconFg: '#8A3D0A' },
      { id: 'ventes', label: 'Ventes effectives', value: '2 124', rawValue: 2124, trend: '+17,4 %', isPositive: true, iconName: 'CheckCircle2', iconBg: '#E9E3FD', iconFg: '#4B2FC9' },
      { id: 'conversion', label: 'Taux de conversion', value: '86 %', rawValue: 86, trend: '+1,3 pt', isPositive: true, iconName: 'TrendingUp', iconBg: '#E3EEFF', iconFg: '#1F4FA8' },
    ],
    chartData: [
      { label: 'Nov.', ca: 1850000, ventes: 118, formattedCa: '1,8 M' },
      { label: 'Déc.', ca: 2640000, ventes: 169, formattedCa: '2,6 M' },
      { label: 'Janv.', ca: 1720000, ventes: 110, formattedCa: '1,7 M' },
      { label: 'Févr.', ca: 1980000, ventes: 126, formattedCa: '2,0 M' },
      { label: 'Mars', ca: 2310000, ventes: 148, formattedCa: '2,3 M' },
      { label: 'Avr.', ca: 2450000, ventes: 157, formattedCa: '2,5 M' },
      { label: 'Mai', ca: 2900000, ventes: 182, formattedCa: '2,9 M' },
      { label: 'Juin', ca: 3150000, ventes: 197, formattedCa: '3,2 M' },
      { label: 'Juil.', ca: 3420000, ventes: 214, formattedCa: '3,4 M' },
      { label: 'Août', ca: 3880000, ventes: 240, formattedCa: '3,9 M' },
      { label: 'Sept.', ca: 4510000, ventes: 281, formattedCa: '4,5 M' },
      { label: 'Oct.', ca: 3260000, ventes: 205, formattedCa: '3,3 M' }
    ],
    statusDistribution: [
      { label: 'Livrée', count: 3130, pct: 86, color: '#241D5E' },
      { label: 'En cours', count: 218, pct: 6, color: '#6C4CF1' },
      { label: 'Reportée', count: 145, pct: 4, color: '#A99BFA' },
      { label: 'Annulée', count: 73, pct: 2, color: '#D6CFF7' },
      { label: 'Injoignable', count: 37, pct: 1, color: '#8B869C' },
      { label: 'Contestée', count: 37, pct: 1, color: '#E3807A' }
    ],
    zones: [
      { name: 'Abidjan (Cocody, Yopougon, Marcory)', percentage: 58, formattedPercentage: '58 %' },
      { name: 'Bouaké', percentage: 12, formattedPercentage: '12 %' },
      { name: 'Yamoussoukro', percentage: 9, formattedPercentage: '9 %' },
      { name: 'San-Pédro', percentage: 8, formattedPercentage: '8 %' },
      { name: 'Korhogo', percentage: 7, formattedPercentage: '7 %' },
      { name: 'Daloa', percentage: 6, formattedPercentage: '6 %' }
    ],
    topProducts: [
      { rank: 1, name: 'Montre connectée X2', salesCount: '648', caFormatted: '14 256 000 FCFA' },
      { rank: 2, name: 'Sérum éclat 30 ml', salesCount: '486', caFormatted: '4 495 500 FCFA' },
      { rank: 3, name: 'Écouteurs sans fil Pro', salesCount: '324', caFormatted: '7 776 000 FCFA' },
      { rank: 4, name: 'Lisseur céramique Pro', salesCount: '243', caFormatted: '3 645 000 FCFA' },
      { rank: 5, name: 'Sac bandoulière cuir', salesCount: '135', caFormatted: '1 620 000 FCFA' }
    ],
    calendarDays: generateCalendarDays()
  },
  jour: {
    period: 'jour',
    periodLabel: '7 derniers jours',
    conversionRate: '88 %',
    kpis: [
      { id: 'ca', label: 'Chiffre d’affaires (FCFA)', value: '1 181 500', rawValue: 1181500, trend: '+8,2 %', isPositive: true, iconName: 'DollarSign', iconBg: '#E9E3FD', iconFg: '#4B2FC9' },
      { id: 'visites', label: 'Visites boutique', value: '3 860', rawValue: 3860, trend: '+5,1 %', isPositive: true, iconName: 'Eye', iconBg: '#E3EEFF', iconFg: '#1F4FA8' },
      { id: 'commandes', label: 'Commandes reçues', value: '104', rawValue: 104, trend: '+6,4 %', isPositive: true, iconName: 'ShoppingBag', iconBg: '#FFEBDD', iconFg: '#8A3D0A' },
      { id: 'ventes', label: 'Ventes effectives', value: '71', rawValue: 71, trend: '+9,7 %', isPositive: true, iconName: 'CheckCircle2', iconBg: '#E9E3FD', iconFg: '#4B2FC9' },
      { id: 'conversion', label: 'Taux de conversion', value: '88 %', rawValue: 88, trend: '+2,1 pts', isPositive: true, iconName: 'TrendingUp', iconBg: '#E3EEFF', iconFg: '#1F4FA8' },
    ],
    chartData: [
      { label: 'Lun', ca: 142000, ventes: 8, formattedCa: '142 k' },
      { label: 'Mar', ca: 168500, ventes: 10, formattedCa: '169 k' },
      { label: 'Mer', ca: 121000, ventes: 7, formattedCa: '121 k' },
      { label: 'Jeu', ca: 195000, ventes: 11, formattedCa: '195 k' },
      { label: 'Ven', ca: 176500, ventes: 10, formattedCa: '177 k' },
      { label: 'Sam', ca: 231000, ventes: 13, formattedCa: '231 k' },
      { label: 'Dim', ca: 148500, ventes: 9, formattedCa: '149 k' }
    ],
    statusDistribution: [
      { label: 'Livrée', count: 88, pct: 88, color: '#241D5E' },
      { label: 'En cours', count: 6, pct: 6, color: '#6C4CF1' },
      { label: 'Reportée', count: 4, pct: 4, color: '#A99BFA' },
      { label: 'Annulée', count: 1, pct: 1, color: '#D6CFF7' },
      { label: 'Injoignable', count: 1, pct: 1, color: '#8B869C' },
      { label: 'Contestée', count: 0, pct: 0, color: '#E3807A' }
    ],
    zones: [
      { name: 'Abidjan', percentage: 60, formattedPercentage: '60 %' },
      { name: 'Bouaké', percentage: 14, formattedPercentage: '14 %' },
      { name: 'Yamoussoukro', percentage: 10, formattedPercentage: '10 %' },
      { name: 'San-Pédro', percentage: 7, formattedPercentage: '7 %' },
      { name: 'Korhogo', percentage: 5, formattedPercentage: '5 %' },
      { name: 'Daloa', percentage: 4, formattedPercentage: '4 %' }
    ],
    topProducts: [
      { rank: 1, name: 'Montre connectée X2', salesCount: '24', caFormatted: '528 000 FCFA' },
      { rank: 2, name: 'Sérum éclat 30 ml', salesCount: '18', caFormatted: '166 500 FCFA' },
      { rank: 3, name: 'Écouteurs sans fil Pro', salesCount: '12', caFormatted: '288 000 FCFA' },
      { rank: 4, name: 'Lisseur céramique Pro', salesCount: '9', caFormatted: '135 000 FCFA' },
      { rank: 5, name: 'Sac bandoulière cuir', salesCount: '5', caFormatted: '60 000 FCFA' }
    ],
    calendarDays: generateCalendarDays()
  },
  semaine: {
    period: 'semaine',
    periodLabel: '8 dernières semaines',
    conversionRate: '87 %',
    kpis: [
      { id: 'ca', label: 'Chiffre d’affaires (FCFA)', value: '8 192 500', rawValue: 8192500, trend: '+12,4 %', isPositive: true, iconName: 'DollarSign', iconBg: '#E9E3FD', iconFg: '#4B2FC9' },
      { id: 'visites', label: 'Visites boutique', value: '29 400', rawValue: 29400, trend: '+9,8 %', isPositive: true, iconName: 'Eye', iconBg: '#E3EEFF', iconFg: '#1F4FA8' },
      { id: 'commandes', label: 'Commandes reçues', value: '790', rawValue: 790, trend: '+10,3 %', isPositive: true, iconName: 'ShoppingBag', iconBg: '#FFEBDD', iconFg: '#8A3D0A' },
      { id: 'ventes', label: 'Ventes effectives', value: '504', rawValue: 504, trend: '+11,6 %', isPositive: true, iconName: 'CheckCircle2', iconBg: '#E9E3FD', iconFg: '#4B2FC9' },
      { id: 'conversion', label: 'Taux de conversion', value: '87 %', rawValue: 87, trend: '−0,8 pt', isPositive: false, iconName: 'TrendingUp', iconBg: '#E3EEFF', iconFg: '#1F4FA8' },
    ],
    chartData: [
      { label: 'S35', ca: 820000, ventes: 52, formattedCa: '820 k' },
      { label: 'S36', ca: 905000, ventes: 57, formattedCa: '905 k' },
      { label: 'S37', ca: 870000, ventes: 55, formattedCa: '870 k' },
      { label: 'S38', ca: 1010000, ventes: 63, formattedCa: '1,0 M' },
      { label: 'S39', ca: 1120000, ventes: 70, formattedCa: '1,1 M' },
      { label: 'S40', ca: 1065000, ventes: 66, formattedCa: '1,1 M' },
      { label: 'S41', ca: 1240000, ventes: 74, formattedCa: '1,2 M' },
      { label: 'S42', ca: 1182500, ventes: 68, formattedCa: '1,2 M' }
    ],
    statusDistribution: [
      { label: 'Livrée', count: 687, pct: 87, color: '#241D5E' },
      { label: 'En cours', count: 47, pct: 6, color: '#6C4CF1' },
      { label: 'Reportée', count: 32, pct: 4, color: '#A99BFA' },
      { label: 'Annulée', count: 16, pct: 2, color: '#D6CFF7' },
      { label: 'Injoignable', count: 5, pct: 0.6, color: '#8B869C' },
      { label: 'Contestée', count: 3, pct: 0.4, color: '#E3807A' }
    ],
    zones: [
      { name: 'Abidjan', percentage: 58, formattedPercentage: '58 %' },
      { name: 'Bouaké', percentage: 13, formattedPercentage: '13 %' },
      { name: 'Yamoussoukro', percentage: 9, formattedPercentage: '9 %' },
      { name: 'San-Pédro', percentage: 8, formattedPercentage: '8 %' },
      { name: 'Korhogo', percentage: 7, formattedPercentage: '7 %' },
      { name: 'Daloa', percentage: 5, formattedPercentage: '5 %' }
    ],
    topProducts: [
      { rank: 1, name: 'Montre connectée X2', salesCount: '178', caFormatted: '3 916 000 FCFA' },
      { rank: 2, name: 'Sérum éclat 30 ml', salesCount: '133', caFormatted: '1 230 250 FCFA' },
      { rank: 3, name: 'Écouteurs sans fil Pro', salesCount: '89', caFormatted: '2 136 000 FCFA' },
      { rank: 4, name: 'Lisseur céramique Pro', salesCount: '67', caFormatted: '1 005 000 FCFA' },
      { rank: 5, name: 'Sac bandoulière cuir', salesCount: '37', caFormatted: '444 000 FCFA' }
    ],
    calendarDays: generateCalendarDays()
  }
};

function generateCalendarDays() {
  const postponedDays = [19, 21, 22, 24, 27, 29];
  const days: { dayNumber: number | null; isToday: boolean; hasPostponed: boolean; isPast: boolean }[] = [];
  
  // 3 leading blanks for Wednesday Oct 1
  for (let i = 0; i < 3; i++) {
    days.push({ dayNumber: null, isToday: false, hasPostponed: false, isPast: false });
  }

  // 31 days of October
  for (let d = 1; d <= 31; d++) {
    days.push({
      dayNumber: d,
      isToday: d === 18,
      hasPostponed: postponedDays.includes(d),
      isPast: d < 18
    });
  }

  // Trailing blanks to complete 7-day grid
  while (days.length % 7 !== 0) {
    days.push({ dayNumber: null, isToday: false, hasPostponed: false, isPast: false });
  }

  return days;
}
