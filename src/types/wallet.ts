export type PaymentProvider = 'Wave' | 'Orange Money' | 'MTN MoMo' | 'Moov Money' | 'Espèces' | 'Virement bancaire';

export interface WalletTransaction {
  id: string;
  date: string;
  ref: string;
  who: string;
  mode: PaymentProvider;
  status: 'Validé' | 'En cours' | 'Échoué';
  amount: number;
  isCredit: boolean;
  isCash: boolean;
  orderId?: string;
}

export interface PayoutAccount {
  id: string;
  name: string;
  num: string;
  provider: PaymentProvider;
  isDefault: boolean;
  logoBg: string;
  initial: string;
}

export interface WalletSummary {
  cashBalance: number;
  digitalBalance: number;
  pendingBalance: number;
  withdrawnThisMonth: number;
  pendingTransfer: number;
  kolixCommission: number;
  avgTransferTime: string;
}
