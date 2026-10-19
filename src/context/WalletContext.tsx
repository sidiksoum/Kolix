import React, { createContext, useContext, useState, useEffect } from 'react';
import { WalletSummary, WalletTransaction, PayoutAccount } from '../types/wallet';
import { walletApi } from '../api/wallet.api';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

interface WalletContextType {
  summary: WalletSummary | null;
  transactions: WalletTransaction[];
  accounts: PayoutAccount[];
  isWithdrawModalOpen: boolean;
  setIsWithdrawModalOpen: (open: boolean) => void;
  withdrawFunds: (amount: number, accountId: string) => Promise<void>;
  refreshWallet: () => Promise<void>;
  isLoading: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [summary, setSummary] = useState<WalletSummary | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [accounts, setAccounts] = useState<PayoutAccount[]>([]);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshWallet = async () => {
    try {
      setIsLoading(true);
      const [sum, txs, accs] = await Promise.all([
        walletApi.getSummary(),
        walletApi.getTransactions(),
        walletApi.getAccounts()
      ]);
      setSummary(sum);
      setTransactions(txs);
      setAccounts(accs);
    } catch {
      toast.error('Erreur lors du chargement du portefeuille');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshWallet();
  }, []);

  const withdrawFunds = async (amount: number, accountId: string) => {
    try {
      const tx = await walletApi.withdrawFunds(amount, accountId);
      setTransactions(prev => [tx, ...prev]);
      const sum = await walletApi.getSummary();
      setSummary(sum);
      setIsWithdrawModalOpen(false);
      toast.success(`Retrait de ${amount.toLocaleString('fr-FR')} FCFA envoyé avec succès !`);
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors du retrait');
      throw err;
    }
  };

  return (
    <WalletContext.Provider
      value={{
        summary,
        transactions,
        accounts,
        isWithdrawModalOpen,
        setIsWithdrawModalOpen,
        withdrawFunds,
        refreshWallet,
        isLoading
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) throw new Error('useWallet must be used within a WalletProvider');
  return context;
};
