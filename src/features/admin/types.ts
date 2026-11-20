// src/features/admin/types.ts

export type AdminSection = 'overview' | 'merchants' | 'partners' | 'withdraw' | 'log';

export type PlanType = 'Start' | 'Grow' | 'Pro' | 'Empire';
export type MerchantStatus = 'Actif' | 'Essai' | 'Impayé' | 'Suspendu';
export type WithdrawalStatus = 'En attente' | 'Payé' | 'Rejeté';

export interface MerchantAdminItem {
  id: string;
  shop: string;
  domain: string;
  owner: string;
  phone: string;
  country: string;
  plan: PlanType;
  status: MerchantStatus;
  since: string;
  orders: number;
  shops: number;
  ref: string;
}

export interface WithdrawalAdminItem {
  id: string;
  who: string;
  kind: string;
  dest: string;
  date: string;
  amount: number;
  status: WithdrawalStatus;
}

export interface PartnerAdminItem {
  name: string;
  cat: string;
  code: string;
  signups: number;
  subs: number;
  due: number;
}

export interface ActivityLogItem {
  when: string;
  who: string;
  what: string;
}

export const INITIAL_MERCHANTS: MerchantAdminItem[] = [
  { id: 'm1', shop: 'Style & Élégance', domain: 'styleelegance.kolix.shop', owner: 'Aya Kouassi', phone: '+225 07 08 •• •• 48', country: 'Côte d’Ivoire', plan: 'Grow', status: 'Actif', since: '12 juin 2026', orders: 412, shops: 2, ref: 'Amina T. (AMINA10)' },
  { id: 'm2', shop: 'Tech Express CI', domain: 'techexpress.ci', owner: 'Moussa Diarra', phone: '+225 05 45 •• •• 21', country: 'Côte d’Ivoire', plan: 'Pro', status: 'Actif', since: '3 avr. 2026', orders: 286, shops: 1, ref: 'Amina T. (AMINA10)' },
  { id: 'm3', shop: 'Dakar Beauté', domain: 'dakarbeaute.kolix.shop', owner: 'Fatou Ndiaye', phone: '+221 77 •• •• 18', country: 'Sénégal', plan: 'Start', status: 'Essai', since: '14 nov. 2026', orders: 9, shops: 1, ref: '—' },
  { id: 'm4', shop: 'Yao Distribution', domain: 'yaodistribution.com', owner: 'Konan Yao', phone: '+225 07 72 •• •• 64', country: 'Côte d’Ivoire', plan: 'Empire', status: 'Actif', since: '18 août 2026', orders: 1340, shops: 3, ref: 'Kader B. (KADER5)' },
  { id: 'm5', shop: 'Bamako Wax', domain: 'bamakowax.kolix.shop', owner: 'Mariam Traoré', phone: '+223 76 •• •• 39', country: 'Mali', plan: 'Grow', status: 'Impayé', since: '2 juin 2026', orders: 54, shops: 1, ref: '—' },
  { id: 'm6', shop: 'Lomé Gadgets', domain: 'lomegadgets.kolix.shop', owner: 'Kodjo Amegah', phone: '+228 90 •• •• 05', country: 'Togo', plan: 'Start', status: 'Suspendu', since: '9 sept. 2026', orders: 0, shops: 1, ref: '—' },
  { id: 'm7', shop: 'Ouaga Mode', domain: 'ouagamode.kolix.shop', owner: 'Salif Ouédraogo', phone: '+226 70 •• •• 82', country: 'Burkina Faso', plan: 'Pro', status: 'Actif', since: '21 juil. 2026', orders: 198, shops: 1, ref: 'Amina T. (AMINA10)' },
  { id: 'm8', shop: 'Douala Kids', domain: 'doualakids.kolix.shop', owner: 'Esther Mbarga', phone: '+237 6 •• •• 44', country: 'Cameroun', plan: 'Grow', status: 'Essai', since: '16 nov. 2026', orders: 4, shops: 1, ref: 'Kader B. (KADER5)' }
];

export const INITIAL_WITHDRAWALS: WithdrawalAdminItem[] = [
  { id: 'w1', who: 'Yao Distribution', kind: 'Marchand · Empire', dest: 'Compte bancaire •••• 4417', date: '19 nov. · 09:12', amount: 1250000, status: 'En attente' },
  { id: 'w2', who: 'Style & Élégance', kind: 'Marchand · Grow', dest: 'Wave 07 •• •• 12 48', date: '19 nov. · 08:40', amount: 200000, status: 'En attente' },
  { id: 'w3', who: 'Amina T.', kind: 'Partenaire', dest: 'Orange Money 07 •• •• 90 31', date: '18 nov. · 17:05', amount: 28000, status: 'En attente' },
  { id: 'w4', who: 'Ouaga Mode', kind: 'Marchand · Pro', dest: 'Orange Money 70 •• •• 82', date: '18 nov. · 11:20', amount: 340000, status: 'En attente' },
  { id: 'w5', who: 'Tech Express CI', kind: 'Marchand · Pro', dest: 'MTN MoMo 05 •• •• 33 10', date: '17 nov. · 15:44', amount: 410000, status: 'Payé' }
];

export const INITIAL_PARTNERS: PartnerAdminItem[] = [
  { name: 'Amina T.', cat: 'Formateurs e-commerce', code: 'AMINA10', signups: 10, subs: 7, due: 28000 },
  { name: 'Kader B.', cat: 'Influenceurs', code: 'KADER5', signups: 24, subs: 11, due: 46000 },
  { name: 'Agence Pixel', cat: 'Agences marketing', code: 'PIXEL25', signups: 6, subs: 5, due: 21000 }
];

export const INITIAL_LOG: ActivityLogItem[] = [
  { when: '19 nov. · 10:02', who: 'Souleymane S.', what: 'a prolongé l’essai de Douala Kids de 7 jours' },
  { when: '18 nov. · 16:30', who: 'Souleymane S.', what: 'a suspendu Lomé Gadgets (signalement de fraude)' },
  { when: '18 nov. · 09:15', who: 'Système', what: 'a relancé Bamako Wax pour un paiement échoué' },
  { when: '17 nov. · 15:50', who: 'Souleymane S.', what: 'a validé le retrait de 410 000 FCFA de Tech Express CI' }
];

export const PARTNER_CATEGORIES: Record<string, string> = {
  'Formateurs e-commerce': '20 % pendant 12 mois',
  'Influenceurs': '15 % pendant 6 mois',
  'Agences marketing': '25 % pendant 12 mois'
};

