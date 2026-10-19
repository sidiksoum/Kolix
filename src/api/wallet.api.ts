import { apiClient } from './client';
import { API_ENDPOINTS } from './endpoints';
import { WalletSummary, WalletTransaction, PayoutAccount, PaymentProvider } from '../types/wallet';
import { INITIAL_WALLET, INITIAL_TRANSACTIONS, INITIAL_PAYOUT_ACCOUNTS } from './mockData';

let walletCache: WalletSummary = (() => {
  const saved = localStorage.getItem('kolix_wallet');
  if (saved) {
    try { return JSON.parse(saved); } catch {}
  }
  return { ...INITIAL_WALLET };
})();

let transactionsCache: WalletTransaction[] = (() => {
  const saved = localStorage.getItem('kolix_transactions');
  if (saved) {
    try { return JSON.parse(saved); } catch {}
  }
  return [...INITIAL_TRANSACTIONS];
})();

let accountsCache: PayoutAccount[] = [...INITIAL_PAYOUT_ACCOUNTS];

function persist() {
  localStorage.setItem('kolix_wallet', JSON.stringify(walletCache));
  localStorage.setItem('kolix_transactions', JSON.stringify(transactionsCache));
}

export const walletApi = {
  async getSummary(): Promise<WalletSummary> {
    try {
      const res = await apiClient.get<{ data: WalletSummary }>(API_ENDPOINTS.WALLET.SUMMARY);
      return res.data;
    } catch {
      return { ...walletCache };
    }
  },

  async getTransactions(): Promise<WalletTransaction[]> {
    try {
      const res = await apiClient.get<{ data: WalletTransaction[] }>(API_ENDPOINTS.WALLET.TRANSACTIONS);
      return res.data;
    } catch {
      return [...transactionsCache];
    }
  },

  async getAccounts(): Promise<PayoutAccount[]> {
    try {
      const res = await apiClient.get<{ data: PayoutAccount[] }>(API_ENDPOINTS.WALLET.ACCOUNTS);
      return res.data;
    } catch {
      return [...accountsCache];
    }
  },

  async withdrawFunds(amount: number, accountId: string): Promise<WalletTransaction> {
    try {
      const res = await apiClient.post<{ data: WalletTransaction }>(API_ENDPOINTS.WALLET.WITHDRAW, { amount, accountId });
      return res.data;
    } catch {
      if (amount > walletCache.digitalBalance) {
        throw new Error('Solde insuffisant pour ce montant');
      }

      const acc = accountsCache.find(a => a.id === accountId) || accountsCache[0];
      walletCache.digitalBalance -= amount;
      walletCache.withdrawnThisMonth += amount;

      const newTx: WalletTransaction = {
        id: `tx_${Date.now()}`,
        date: 'Aujourd’hui · ' + new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        ref: `Retrait vers ${acc.name}`,
        who: acc.num,
        mode: acc.provider,
        status: 'Validé',
        amount: -amount,
        isCredit: false,
        isCash: false
      };

      transactionsCache.unshift(newTx);
      persist();
      return newTx;
    }
  },

  async addAccount(account: Omit<PayoutAccount, 'id'>): Promise<PayoutAccount> {
    const newAcc: PayoutAccount = {
      ...account,
      id: `acc_${Date.now()}`
    };
    if (newAcc.isDefault) {
      accountsCache.forEach(a => a.isDefault = false);
    }
    accountsCache.push(newAcc);
    return newAcc;
  }
};
