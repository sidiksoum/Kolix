import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../../context/WalletContext';
import { useOrders } from '../../context/OrdersContext';
import { accountingApi, AccountingDashboard } from '../../api/accounting.api';
import { affiliatesApi } from '../../api/affiliates.api';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { 
  Wallet, 
  Banknote, 
  ArrowUpRight, 
  Download, 
  Plus, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Smartphone, 
  CreditCard,
  Building,
  Lock,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { formatFCFA, formatNumber } from '../../utils/formatters';
import { cn } from '../../utils/cn';

interface DisplayTransaction {
  id: string;
  date: string;
  ref: string;
  who: string;
  mode: string;
  status: 'Validé' | 'En attente' | 'Clôturé';
  amount: number;
  isCredit: boolean;
  isCash: boolean;
}

export const PortefeuillePage: React.FC = () => {
  const navigate = useNavigate();
  const { orders } = useOrders();
  const {
    summary,
    accounts,
    isWithdrawModalOpen,
    setIsWithdrawModalOpen,
    refreshWallet,
    isLoading: walletLoading
  } = useWallet();

  const [pageLoading, setPageLoading] = useState(true);
  const [filterMode, setFilterMode] = useState<string>('all');
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const [selectedAccountId, setSelectedAccountId] = useState<string>(accounts[0]?.id || 'acc_01');
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);

  // Données dynamiques réelles
  const [netProfit, setNetProfit] = useState<number>(0);
  const [kolixCommissions, setKolixCommissions] = useState<number>(0);
  const [accountingDashboard, setAccountingDashboard] = useState<AccountingDashboard | null>(null);

  // New Account State
  const [newAccName, setNewAccName] = useState('');
  const [newAccNum, setNewAccNum] = useState('');
  const [newAccProvider, setNewAccProvider] = useState<'Wave' | 'Orange Money' | 'MTN MoMo' | 'Virement bancaire'>('Wave');

  // Chargement des données réelles
  useEffect(() => {
    let isMounted = true;
    const loadRealData = async () => {
      setPageLoading(true);
      try {
        const [accRes, affRes] = await Promise.allSettled([
          accountingApi.getDashboard(),
          affiliatesApi.getSummary(),
          refreshWallet()
        ]);

        if (!isMounted) return;

        if (accRes.status === 'fulfilled' && accRes.value) {
          setAccountingDashboard(accRes.value);
          if (typeof accRes.value.net_profit === 'number') {
            setNetProfit(accRes.value.net_profit);
          } else {
            const ca = (accRes.value.cash_revenue || 0) + (accRes.value.momo_revenue || 0);
            const totalCh = Object.values(accRes.value.charges_by_category || {}).reduce((a, b) => a + b, 0);
            setNetProfit(ca - totalCh);
          }
        }

        if (affRes.status === 'fulfilled' && affRes.value) {
          setKolixCommissions(affRes.value.total_earned || affRes.value.available_balance || 0);
        }
      } catch (err) {
        console.error('Erreur chargement portefeuille:', err);
      } finally {
        if (isMounted) setPageLoading(false);
      }
    };

    loadRealData();
    return () => { isMounted = false; };
  }, []);

  // Construction de l'historique des ventes réelles en fonction du moyen de paiement validé
  const allSalesTransactions = useMemo<DisplayTransaction[]>(() => {
    // 1. Commandes livrées ou dont le paiement a été validé par le marchand
    const deliveredOrders = orders.filter(o => 
      o.status === 'Livrée' || 
      (typeof o.status === 'string' && o.status.toLowerCase().includes('livr')) ||
      Boolean(o.paid)
    );

    if (deliveredOrders.length > 0) {
      return deliveredOrders.map(o => {
        const rawMode = o.paid || (o.paymentMode === 'COD_CASH' ? 'Espèces' : 'Mobile Money · Wave') || 'Espèces';
        const isCash = rawMode.toLowerCase().includes('esp') || rawMode.toLowerCase().includes('cash');
        return {
          id: o.id,
          date: o.date,
          ref: `Commande #${o.id.replace(/^KX-?/i, '')}`,
          who: `${o.client} · ${o.product}`,
          mode: rawMode,
          status: 'Validé',
          amount: o.amount,
          isCredit: true,
          isCash: isCash
        };
      });
    }

    // 2. Si aucune commande en mémoire, fallback sur les ventes de la comptabilité backend
    if (accountingDashboard?.recent_transactions && accountingDashboard.recent_transactions.length > 0) {
      return accountingDashboard.recent_transactions
        .filter(t => t.type === 'Vente')
        .map(t => {
          const isCash = t.mode.toLowerCase().includes('esp') || t.mode.toLowerCase().includes('cash');
          return {
            id: t.id,
            date: t.date,
            ref: `Vente · ${t.label}`,
            who: t.cat || 'Client comptoir',
            mode: t.mode || (isCash ? 'Espèces' : 'Mobile Money'),
            status: 'Validé',
            amount: t.amount,
            isCredit: true,
            isCash: isCash
          };
        });
    }

    return [];
  }, [orders, accountingDashboard]);

  // Filtrage des transactions
  const filteredTransactions = useMemo(() => {
    return allSalesTransactions.filter(t => {
      if (filterMode === 'retraits') return !t.isCredit && !t.isCash;
      if (filterMode === 'momo') return t.isCredit && !t.isCash;
      if (filterMode === 'cash') return t.isCash;
      return true;
    });
  }, [allSalesTransactions, filterMode]);

  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.info('Le module de retrait numérique sera activé dans la prochaine phase.');
    setIsWithdrawModalOpen(false);
  };

  if (pageLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="w-10 h-10 border-4 border-[#6C4CF1] border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-semibold text-[#5E5A70]">Chargement de votre portefeuille...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#241D5E] tracking-tight">
            Portefeuille
          </h1>
          <p className="text-sm sm:text-base text-[#5E5A70] font-medium mt-1">
            Suivi de vos encaissements espèces (bénéfice net) et de vos commissions Kolix
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => toast.success('Relevé financier Kolix exporté au format PDF')}
            className="rounded-full shadow-kolix-sm"
          >
            <Download className="w-4 h-4 mr-1 text-[#5E5A70]" />
            Exporter le relevé
          </Button>
          <button
            type="button"
            onClick={() => toast.info('Le module de retrait numérique sera activé dans la prochaine phase de Kolix.')}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#E4E0EE] hover:bg-[#D8D2E6] text-[#716A86] font-extrabold text-sm transition-all cursor-pointer border border-[#DDD7EA] shadow-sm"
          >
            <Lock className="w-4 h-4 text-[#8C869E]" />
            Retirer mes fonds <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/70 text-[#554F65]">Bientôt</span>
          </button>
        </div>
      </div>

      {/* Dual Wallet Hero Cards: Cash / Bénéfice Net vs Digital Wallet (Grisé) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Cash Wallet Card (Yellow Gold) - DYNAMISÉ AVEC LE BÉNÉFICE NET DE LA COMPTABILITÉ */}
        <section
          aria-label="Portefeuille espèces"
          className="bg-[#F5C800] text-[#16131F] rounded-3xl p-6 sm:p-7 flex flex-col justify-between gap-4 shadow-kolix-gold min-h-[240px]"
        >
          <div className="flex justify-between items-center gap-3">
            <span className="flex items-center gap-2 text-sm font-extrabold">
              <Banknote className="w-5 h-5 text-[#16131F]" />
              Portefeuille espèces · Bénéfice net
            </span>
            <span className="text-xs font-extrabold bg-black/10 rounded-full px-3 py-1">
              Comptabilité en direct
            </span>
          </div>

          <div className="my-1">
            <span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              {formatFCFA(netProfit)}
            </span>
            <p className="text-xs sm:text-sm font-semibold text-[#16131F]/90 mt-2">
              Bénéfice net calculé en temps réel depuis votre comptabilité (Ventes encaissées déduites de vos charges réelles).
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 mt-auto pt-2">
            <Button
              variant="navy"
              size="md"
              onClick={() => navigate('/comptabilite')}
              className="rounded-2xl text-xs font-extrabold cursor-pointer"
            >
              Voir la comptabilité
            </Button>
            <button
              onClick={() => {
                setFilterMode('cash');
                const el = document.getElementById('tx-history-table');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-4 py-2.5 rounded-2xl border-2 border-[#16131F]/40 hover:border-[#16131F] text-[#16131F] font-bold text-xs transition-colors cursor-pointer"
            >
              Voir les ventes en espèces
            </button>
          </div>
        </section>

        {/* Digital Wallet Card - MIS À ZÉRO ET GRISÉ POUR CETTE PHASE */}
        <section
          aria-label="Portefeuille numérique"
          className="bg-[#EBE7F3] text-[#554F65] rounded-3xl p-6 sm:p-7 flex flex-col justify-between gap-4 border border-[#DDD7EE] min-h-[240px] relative overflow-hidden"
        >
          <div className="flex justify-between items-center gap-3">
            <span className="flex items-center gap-2 text-sm font-extrabold text-[#554F65]">
              <Wallet className="w-5 h-5 text-[#736B88]" />
              Portefeuille numérique · Mobile Money & Carte
            </span>
            <span className="flex items-center gap-1.5 text-xs font-bold bg-[#16131F]/10 text-[#554F65] border border-black/10 rounded-full px-3 py-1 shadow-sm">
              <Lock className="w-3.5 h-3.5 text-[#736B88]" />
              Bientôt disponible
            </span>
          </div>

          <div className="my-1">
            <div className="flex items-center gap-3">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#3A354A]">
                {formatFCFA(0)}
              </span>
              <span className="w-9 h-9 rounded-xl bg-black/5 text-[#736B88] flex items-center justify-center shrink-0" title="Portefeuille numérique grisé">
                <Lock className="w-5 h-5" />
              </span>
            </div>
            <div className="text-xs sm:text-sm font-medium text-[#736B88] mt-2">
              En attente de virement : <strong>{formatFCFA(0)}</strong>
            </div>
          </div>

          <div className="bg-white/60 border border-black/5 rounded-2xl px-3.5 py-2 flex items-center gap-2 text-xs text-[#554F65]">
            <Lock className="w-3.5 h-3.5 text-[#736B88] shrink-0" />
            <span>Module de paiement numérique en cours de certification. Non disponible pour cette phase.</span>
          </div>

          <div className="flex flex-wrap gap-2.5 mt-auto pt-2">
            <button
              type="button"
              disabled
              onClick={() => toast.info('Module de paiement numérique non disponible pour cette phase.')}
              className="px-6 py-2.5 rounded-2xl bg-[#D6D0E4] text-[#736B88] font-extrabold text-xs shadow-none cursor-not-allowed flex items-center gap-1.5 opacity-80"
            >
              <Lock className="w-3.5 h-3.5 text-[#736B88]" />
              Retirer mes fonds (Bientôt disponible)
            </button>
            <button
              onClick={() => {
                setFilterMode('momo');
                const el = document.getElementById('tx-history-table');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-4 py-2.5 rounded-2xl border border-[#AFA9C2] hover:border-[#736B88] text-[#554F65] font-bold text-xs transition-colors cursor-pointer"
            >
              Voir les encaissements numériques
            </button>
          </div>
        </section>
      </div>

      {/* 4 Stats Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total retiré : Mis à zéro et grisé */}
        <div className="bg-white rounded-2xl p-5 shadow-kolix flex flex-col gap-1 border border-[#E2DCF8]/60 opacity-60">
          <span className="text-xs font-bold text-[#8C869E]">Total retiré ce mois</span>
          <span className="text-xl font-extrabold text-[#736B88]">
            {formatFCFA(0)}
          </span>
          <span className="text-[11px] text-[#8C869E]">Indisponible cette phase</span>
        </div>

        {/* En attente de virement : Mis à zéro et grisé */}
        <div className="bg-white rounded-2xl p-5 shadow-kolix flex flex-col gap-1 border border-[#E2DCF8]/60 opacity-60">
          <span className="text-xs font-bold text-[#8C869E]">En attente de virement</span>
          <span className="text-xl font-extrabold text-[#736B88]">
            {formatFCFA(0)}
          </span>
          <span className="text-[11px] text-[#8C869E]">Indisponible cette phase</span>
        </div>

        {/* Commissions Kolix : DYNAMISÉ AVEC LES COMMISSIONS RÉELLES DU USER */}
        <div className="bg-white rounded-2xl p-5 shadow-kolix flex flex-col gap-1 border border-[#E2DCF8]/60">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#5E5A70]">Commissions Kolix</span>
            <span className="text-[10px] font-extrabold bg-[#EEE9FF] text-[#6C4CF1] px-2 py-0.5 rounded-full">Partenaire</span>
          </div>
          <span className="text-xl font-extrabold text-[#6C4CF1]">
            {formatFCFA(kolixCommissions)}
          </span>
          <span className="text-[11px] text-[#5E5A70]">Commissions réelles collectées via vos filleuls</span>
        </div>

        {/* Délai moyen de versement : Grisé */}
        <div className="bg-white rounded-2xl p-5 shadow-kolix flex flex-col gap-1 border border-[#E2DCF8]/60 opacity-60">
          <span className="text-xs font-bold text-[#8C869E]">Délai moyen de versement</span>
          <span className="text-xl font-extrabold text-[#736B88]">
            —
          </span>
          <span className="text-[11px] text-[#8C869E]">Activé lors de la prochaine phase</span>
        </div>
      </div>

      {/* Bottom Row: Transactions Table (Left) + Payout Accounts & Guide (Right) */}
      <div id="tx-history-table" className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left: Transactions History Table */}
        <section className="lg:col-span-8 bg-white rounded-3xl shadow-kolix border border-[#E2DCF8]/60 overflow-hidden flex flex-col">
          <div className="p-5 flex flex-wrap justify-between items-center gap-3 border-b border-[#F0EDFB]">
            <div>
              <h2 className="text-lg font-extrabold text-[#241D5E]">Historique des transactions</h2>
              <p className="text-xs text-[#5E5A70] mt-0.5">Ventes clôturées selon le moyen de paiement validé</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'all', label: 'Toutes' },
                { id: 'cash', label: 'Encaissé espèces' },
                { id: 'momo', label: 'Encaissements numériques' },
                { id: 'retraits', label: 'Retraits' }
              ].map(chip => (
                <button
                  key={chip.id}
                  onClick={() => setFilterMode(chip.id)}
                  className={cn(
                    'text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer',
                    filterMode === chip.id
                      ? 'bg-[#241D5E] text-white shadow-sm'
                      : 'bg-[#F4F1FE] text-[#5E5A70] hover:text-[#16131F]'
                  )}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            {filteredTransactions.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center justify-center gap-2">
                <AlertCircle className="w-8 h-8 text-[#AFA9C2]" />
                <span className="text-sm font-bold text-[#241D5E]">
                  {filterMode === 'retraits' 
                    ? 'Aucun retrait numérique pour cette phase' 
                    : 'Aucune vente trouvée pour ce filtre'}
                </span>
                <span className="text-xs text-[#5E5A70] max-w-md">
                  {filterMode === 'retraits'
                    ? 'Les retraits vers vos comptes Mobile Money ou bancaires seront activés dans la prochaine version.'
                    : 'Dès qu’une commande est livrée et clôturée par vous ou vos livreurs, elle apparaîtra ici avec son moyen de paiement validé.'}
                </span>
              </div>
            ) : (
              <table className="w-full text-left text-sm border-collapse min-w-[620px]">
                <thead>
                  <tr className="text-xs text-[#5E5A70] uppercase tracking-wider bg-[#FAF9FE] border-b border-[#F0EDFB]">
                    <th className="py-3 px-4 font-bold">Date</th>
                    <th className="py-3 px-3 font-bold">Détails / Client</th>
                    <th className="py-3 px-3 font-bold">Moyen de paiement validé</th>
                    <th className="py-3 px-3 font-bold">Statut</th>
                    <th className="py-3 px-4 font-bold text-right">Montant</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EDFB]">
                  {filteredTransactions.map(tx => {
                    const isPositive = tx.isCredit;
                    const isCash = tx.isCash;

                    return (
                      <tr key={tx.id} className="hover:bg-[#FAF8FF] transition-colors">
                        <td className="py-3.5 px-4 whitespace-nowrap text-xs text-[#5E5A70]">
                          {tx.date}
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="font-extrabold text-[#16131F]">{tx.ref}</div>
                          <div className="text-xs text-[#5E5A70]">{tx.who}</div>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="flex items-center gap-2 text-xs font-bold text-[#16131F]">
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{
                                backgroundColor:
                                  tx.mode.includes('Wave')
                                    ? '#1DC4FF'
                                    : tx.mode.includes('Orange')
                                    ? '#FF7900'
                                    : tx.mode.includes('MTN')
                                    ? '#FFCC00'
                                    : '#F5C800'
                              }}
                            />
                            {tx.mode}
                          </span>
                        </td>
                        <td className="py-3.5 px-3">
                          <Badge variant={tx.status === 'Validé' ? 'optimal' : 'default'}>
                            {tx.status}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <span
                            className={cn(
                              'text-sm font-extrabold',
                              isCash
                                ? 'text-[#8A3D0A]'
                                : isPositive
                                ? 'text-[#6C4CF1]'
                                : 'text-[#241D5E]'
                            )}
                          >
                            {isPositive ? '+' : ''}{formatFCFA(tx.amount)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          <div className="p-4 bg-[#FAF9FE] border-t border-[#F0EDFB] text-xs text-[#5E5A70] flex justify-between items-center">
            <span>Affichage de {filteredTransactions.length} transaction(s)</span>
            <span className="font-semibold text-[#6C4CF1]">Synchronisé avec la Comptabilité</span>
          </div>
        </section>

        {/* Right: Accounts & Guide (Visuels conservés pour l'UX utilisateur) */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          {/* Accounts Card */}
          <section className="bg-white rounded-3xl p-6 shadow-kolix border border-[#E2DCF8]/60 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-base font-extrabold text-[#241D5E]">Comptes de retrait</h2>
                <span className="text-[11px] text-[#736B88]">Aperçu pour la prochaine phase</span>
              </div>
              <button
                onClick={() => setIsAddAccountModalOpen(true)}
                className="text-xs font-extrabold text-[#6C4CF1] hover:underline cursor-pointer"
              >
                + Configurer
              </button>
            </div>

            <div className="flex flex-col divide-y divide-[#F0EDFB]">
              {accounts.length === 0 ? (
                <div className="py-4 text-xs text-[#5E5A70] text-center">
                  Aucun compte configuré. Vous pourrez lier vos comptes Wave et Orange Money lors de l'activation des retraits.
                </div>
              ) : (
                accounts.map(acc => (
                  <div key={acc.id} className="flex items-center gap-3 py-3">
                    <span
                      className="w-10 h-10 rounded-2xl text-white font-extrabold text-xs flex items-center justify-center shadow-sm shrink-0"
                      style={{ backgroundColor: acc.logoBg }}
                    >
                      {acc.initial}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-[#16131F] truncate">{acc.name}</div>
                      <div className="text-xs text-[#5E5A70] truncate">{acc.num}</div>
                    </div>
                    {acc.isDefault && (
                      <span className="text-[10px] font-extrabold bg-[#EEE9FF] text-[#3F25A8] rounded-full px-2.5 py-0.5 shrink-0">
                        Par défaut
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Explanation Box: How the wallet will work */}
          <section className="bg-[#EEE9FF] border border-[#D9D3F5] rounded-3xl p-6 flex flex-col gap-3 text-[#2E1F86]">
            <h2 className="text-base font-extrabold">Comment le portefeuille fonctionne</h2>
            <div className="flex flex-col gap-3 text-xs leading-relaxed mt-1">
              <div className="flex gap-2.5 items-start">
                <span className="w-6 h-6 rounded-full bg-white font-extrabold flex items-center justify-center shrink-0 shadow-sm text-[#2E1F86]">
                  1
                </span>
                <span>
                  Lors de la livraison, vos livreurs encaissent en <strong>espèces</strong> ou présentent le <strong>QR code Kolix</strong>.
                </span>
              </div>
              <div className="flex gap-2.5 items-start">
                <span className="w-6 h-6 rounded-full bg-white font-extrabold flex items-center justify-center shrink-0 shadow-sm text-[#2E1F86]">
                  2
                </span>
                <span>
                  La clôture de la commande synchronise automatiquement votre <strong>bénéfice net</strong> dans votre portefeuille espèces.
                </span>
              </div>
              <div className="flex gap-2.5 items-start">
                <span className="w-6 h-6 rounded-full bg-white font-extrabold flex items-center justify-center shrink-0 shadow-sm text-[#2E1F86]">
                  3
                </span>
                <span>
                  Vos <strong>commissions de parrainage</strong> sont créditées en temps réel et utilisables pour vos abonnements.
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Withdraw Funds Modal */}
      <Modal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        title="Retirer mes fonds"
        description="Le module de retrait numérique est actuellement en cours de certification bancaire."
      >
        <div className="flex flex-col gap-4 mt-2">
          <div className="p-4 bg-[#FFF9EA] border border-[#F5C800]/40 rounded-2xl flex items-start gap-3">
            <Lock className="w-5 h-5 text-[#8A3D0A] shrink-0 mt-0.5" />
            <div className="text-xs text-[#8A3D0A] leading-relaxed">
              <strong className="block text-sm mb-0.5">Fonctionnalité en cours de déploiement</strong>
              Les retraits automatisés vers Wave et Orange Money seront activés dans la prochaine version. Vos encaissements en espèces restent gérés directement avec vos livreurs et suivis dans la Comptabilité.
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-3 pt-3 border-t border-[#F0EDFB]">
            <Button variant="primary" type="button" onClick={() => setIsWithdrawModalOpen(false)}>
              J'ai compris
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Account Modal */}
      <Modal
        isOpen={isAddAccountModalOpen}
        onClose={() => setIsAddAccountModalOpen(false)}
        title="Configurer un compte de retrait"
        description="Enregistrez votre compte Mobile Money ou bancaire pour les futurs versements."
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!newAccName || !newAccNum) return;
            toast.success(`Compte ${newAccName} enregistré pour la prochaine phase`);
            setIsAddAccountModalOpen(false);
            setNewAccName('');
            setNewAccNum('');
          }}
          className="flex flex-col gap-4 mt-2"
        >
          <div>
            <label className="text-xs font-bold text-[#5E5A70] block mb-1">Intitulé du compte *</label>
            <Input
              placeholder="Ex: Wave Principal"
              value={newAccName}
              onChange={(e) => setNewAccName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#5E5A70] block mb-1">Opérateur / Type *</label>
            <select
              value={newAccProvider}
              onChange={(e) => setNewAccProvider(e.target.value as any)}
              className="w-full min-h-[44px] rounded-2xl bg-white border border-[#E2DCF8] px-3.5 text-sm font-semibold"
            >
              <option value="Wave">Wave</option>
              <option value="Orange Money">Orange Money</option>
              <option value="MTN MoMo">MTN MoMo</option>
              <option value="Virement bancaire">Virement bancaire (UBA, Ecobank, SGBCI...)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-[#5E5A70] block mb-1">Numéro de téléphone / RIB *</label>
            <Input
              placeholder="Ex: 07 08 12 34 56 ou CI059..."
              value={newAccNum}
              onChange={(e) => setNewAccNum(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-3 mt-3 pt-3 border-t border-[#F0EDFB]">
            <Button variant="ghost" type="button" onClick={() => setIsAddAccountModalOpen(false)}>
              Annuler
            </Button>
            <Button variant="primary" type="submit">
              Enregistrer
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
