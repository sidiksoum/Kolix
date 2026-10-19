import React, { useState } from 'react';
import { useWallet } from '../../context/WalletContext';
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
  Building
} from 'lucide-react';
import { toast } from 'sonner';
import { formatFCFA, formatNumber } from '../../utils/formatters';
import { cn } from '../../utils/cn';

export const PortefeuillePage: React.FC = () => {
  const {
    summary,
    transactions,
    accounts,
    isWithdrawModalOpen,
    setIsWithdrawModalOpen,
    withdrawFunds
  } = useWallet();

  const [filterMode, setFilterMode] = useState<string>('all');
  const [withdrawAmount, setWithdrawAmount] = useState<string>('150000');
  const [selectedAccountId, setSelectedAccountId] = useState<string>(accounts[0]?.id || 'acc_01');
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);

  // New Account State
  const [newAccName, setNewAccName] = useState('');
  const [newAccNum, setNewAccNum] = useState('');
  const [newAccProvider, setNewAccProvider] = useState<'Wave' | 'Orange Money' | 'MTN MoMo' | 'Virement bancaire'>('Wave');

  const filteredTransactions = transactions.filter(t => {
    if (filterMode === 'retraits') return !t.isCredit && !t.isCash;
    if (filterMode === 'momo') return t.isCredit && !t.isCash;
    if (filterMode === 'cash') return t.isCash;
    return true;
  });

  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(withdrawAmount, 10);
    if (!amount || amount <= 0) {
      toast.error('Veuillez indiquer un montant valide');
      return;
    }
    await withdrawFunds(amount, selectedAccountId);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#241D5E] tracking-tight">
            Portefeuille
          </h1>
          <p className="text-sm sm:text-base text-[#5E5A70] font-medium mt-1">
            Votre wallet Kolix, alimenté automatiquement par les paiements Mobile Money reçus via QR code
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
          <Button
            variant="primary"
            onClick={() => setIsWithdrawModalOpen(true)}
            className="rounded-full shadow-kolix-cta"
          >
            <ArrowUpRight className="w-4 h-4 mr-1" />
            Retirer mes fonds
          </Button>
        </div>
      </div>

      {/* Dual Wallet Hero Cards: Cash on Delivery vs Digital Wallet */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Cash Wallet Card (Yellow Gold) */}
        <section
          aria-label="Portefeuille espèces"
          className="bg-[#F5C800] text-[#16131F] rounded-3xl p-6 sm:p-7 flex flex-col justify-between gap-4 shadow-kolix-gold min-h-[240px]"
        >
          <div className="flex justify-between items-center gap-3">
            <span className="flex items-center gap-2 text-sm font-extrabold">
              <Banknote className="w-5 h-5 text-[#16131F]" />
              Portefeuille espèces · octobre
            </span>
            <span className="text-xs font-extrabold bg-black/10 rounded-full px-3 py-1">
              Hors wallet numérique
            </span>
          </div>

          <div className="my-1">
            <span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              {formatFCFA(summary?.cashBalance || 1320000)}
            </span>
            <p className="text-xs sm:text-sm font-semibold text-[#16131F]/90 mt-2">
              Encaissés en espèces par vos livreurs lors des livraisons. Non retirables ici, mais synchronisés en Comptabilité.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 mt-auto pt-2">
            <Button
              variant="navy"
              size="md"
              onClick={() => toast.info('Rapprochement comptable espèces ouvert')}
              className="rounded-2xl text-xs font-extrabold"
            >
              Voir en Comptabilité
            </Button>
            <button
              onClick={() => setFilterMode('cash')}
              className="px-4 py-2.5 rounded-2xl border-2 border-[#16131F]/40 hover:border-[#16131F] text-[#16131F] font-bold text-xs transition-colors cursor-pointer"
            >
              Voir les ventes en espèces
            </button>
          </div>
        </section>

        {/* Digital Wallet Card (Kolix Accent Purple) */}
        <section
          aria-label="Portefeuille numérique"
          className="bg-[#6C4CF1] text-white rounded-3xl p-6 sm:p-7 flex flex-col justify-between gap-4 shadow-kolix-cta min-h-[240px]"
        >
          <div className="flex justify-between items-center gap-3">
            <span className="flex items-center gap-2 text-sm font-extrabold">
              <Wallet className="w-5 h-5 text-white" />
              Portefeuille numérique · solde disponible
            </span>
            <span className="flex items-center gap-1.5 text-xs font-bold bg-white/20 rounded-full px-3 py-1">
              <span className="w-2 h-2 rounded-full bg-[#7CE0AE] animate-pulse" />
              Temps réel
            </span>
          </div>

          <div className="my-1">
            <span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              {formatFCFA(summary?.digitalBalance || 845000)}
            </span>
            <div className="text-xs sm:text-sm font-medium text-[#EDE8FF] mt-2">
              En attente de virement : <strong>{formatFCFA(summary?.pendingBalance || 65000)}</strong>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5 mt-auto pt-2">
            <button
              onClick={() => setIsWithdrawModalOpen(true)}
              className="px-6 py-2.5 rounded-2xl bg-white hover:bg-[#FAF8FF] text-[#3F25A8] font-extrabold text-xs transition-all shadow-md cursor-pointer"
            >
              Retirer mes fonds
            </button>
            <button
              onClick={() => setFilterMode('momo')}
              className="px-4 py-2.5 rounded-2xl border border-white/50 hover:border-white text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Voir les encaissements
            </button>
          </div>
        </section>
      </div>

      {/* 4 Stats Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-kolix flex flex-col gap-1 border border-[#E2DCF8]/60">
          <span className="text-xs font-bold text-[#5E5A70]">Total retiré ce mois</span>
          <span className="text-xl font-extrabold text-[#16131F]">
            {formatFCFA(summary?.withdrawnThisMonth || 1250000)}
          </span>
          <span className="text-[11px] text-[#5E5A70]">Vers Wave & Orange Money</span>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-kolix flex flex-col gap-1 border border-[#E2DCF8]/60">
          <span className="text-xs font-bold text-[#5E5A70]">En attente de virement</span>
          <span className="text-xl font-extrabold text-[#241D5E]">
            {formatFCFA(summary?.pendingTransfer || 65000)}
          </span>
          <span className="text-[11px] text-[#5E5A70]">Rapprochement sous 2h</span>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-kolix flex flex-col gap-1 border border-[#E2DCF8]/60">
          <span className="text-xs font-bold text-[#5E5A70]">Commissions Kolix</span>
          <span className="text-xl font-extrabold text-[#16131F]">
            {formatFCFA(summary?.kolixCommission || 24500)}
          </span>
          <span className="text-[11px] text-[#5E5A70]">0 % sur vos 100 premières ventes</span>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-kolix flex flex-col gap-1 border border-[#E2DCF8]/60">
          <span className="text-xs font-bold text-[#5E5A70]">Délai moyen de versement</span>
          <span className="text-xl font-extrabold text-emerald-600">
            {summary?.avgTransferTime || '< 15 min'}
          </span>
          <span className="text-[11px] text-[#5E5A70]">Instantané via API Wave/Orange</span>
        </div>
      </div>

      {/* Bottom Row: Transactions Table (Left) + Payout Accounts & How It Works (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left: Transactions History Table */}
        <section className="lg:col-span-8 bg-white rounded-3xl shadow-kolix border border-[#E2DCF8]/60 overflow-hidden flex flex-col">
          <div className="p-5 flex flex-wrap justify-between items-center gap-3 border-b border-[#F0EDFB]">
            <h2 className="text-lg font-extrabold text-[#241D5E]">Historique des transactions</h2>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'all', label: 'Toutes' },
                { id: 'retraits', label: 'Retraits' },
                { id: 'momo', label: 'Encaissements Mobile Money' },
                { id: 'cash', label: 'Encaissé espèces' }
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
            <table className="w-full text-left text-sm border-collapse min-w-[620px]">
              <thead>
                <tr className="text-xs text-[#5E5A70] uppercase tracking-wider bg-[#FAF9FE] border-b border-[#F0EDFB]">
                  <th className="py-3 px-4 font-bold">Date</th>
                  <th className="py-3 px-3 font-bold">Détails / Client</th>
                  <th className="py-3 px-3 font-bold">Mode de paiement</th>
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
                                tx.mode === 'Wave'
                                  ? '#1DC4FF'
                                  : tx.mode === 'Orange Money'
                                  ? '#FF7900'
                                  : tx.mode === 'MTN MoMo'
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
          </div>

          <div className="p-4 bg-[#FAF9FE] border-t border-[#F0EDFB] text-xs text-[#5E5A70]">
            Les ventes en espèces sont listées pour information : elles ne modifient pas le solde du portefeuille numérique.
          </div>
        </section>

        {/* Right: Accounts & Guide */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          {/* Accounts Card */}
          <section className="bg-white rounded-3xl p-6 shadow-kolix border border-[#E2DCF8]/60 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-extrabold text-[#241D5E]">Comptes de retrait</h2>
              <button
                onClick={() => setIsAddAccountModalOpen(true)}
                className="text-xs font-extrabold text-[#6C4CF1] hover:underline cursor-pointer"
              >
                + Ajouter
              </button>
            </div>

            <div className="flex flex-col divide-y divide-[#F0EDFB]">
              {accounts.map(acc => (
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
              ))}
            </div>
          </section>

          {/* Explanation Box: How the wallet is credited */}
          <section className="bg-[#EEE9FF] border border-[#D9D3F5] rounded-3xl p-6 flex flex-col gap-3 text-[#2E1F86]">
            <h2 className="text-base font-extrabold">Comment le solde est alimenté</h2>
            <div className="flex flex-col gap-3 text-xs leading-relaxed mt-1">
              <div className="flex gap-2.5 items-start">
                <span className="w-6 h-6 rounded-full bg-white font-extrabold flex items-center justify-center shrink-0 shadow-sm">
                  1
                </span>
                <span>
                  À la livraison, le livreur présente le <strong>QR code Kolix</strong> généré sur la commande.
                </span>
              </div>
              <div className="flex gap-2.5 items-start">
                <span className="w-6 h-6 rounded-full bg-white font-extrabold flex items-center justify-center shrink-0 shadow-sm">
                  2
                </span>
                <span>
                  Le client scanne avec <strong>Wave, Orange Money, MTN MoMo</strong> ou Moov Money.
                </span>
              </div>
              <div className="flex gap-2.5 items-start">
                <span className="w-6 h-6 rounded-full bg-white font-extrabold flex items-center justify-center shrink-0 shadow-sm">
                  3
                </span>
                <span>
                  Le montant net est <strong>immédiatement crédité</strong> sur votre solde disponible Kolix !
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
        description={`Solde disponible au retrait : ${formatFCFA(summary?.digitalBalance || 845000)}`}
      >
        <form onSubmit={handleWithdrawSubmit} className="flex flex-col gap-4 mt-2">
          <div>
            <label className="text-xs font-bold text-[#5E5A70] block mb-1">
              Montant à transférer (FCFA) *
            </label>
            <Input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              max={summary?.digitalBalance || 845000}
              required
            />
          </div>

          {/* Quick Amount Pills */}
          <div className="flex gap-2">
            {[50000, 150000, 300000, 500000].map(amt => (
              <button
                key={amt}
                type="button"
                onClick={() => setWithdrawAmount(String(amt))}
                className="flex-1 py-1.5 rounded-xl bg-[#F4F1FE] hover:bg-[#E9E3FD] text-[#3F25A8] text-xs font-bold transition-colors cursor-pointer"
              >
                {formatNumber(amt)}
              </button>
            ))}
          </div>

          <div>
            <label className="text-xs font-bold text-[#5E5A70] block mb-1">
              Compte bénéficiaire *
            </label>
            <select
              value={selectedAccountId}
              onChange={(e) => setSelectedAccountId(e.target.value)}
              className="w-full min-h-[44px] rounded-2xl bg-white border border-[#E2DCF8] px-3.5 text-sm font-semibold text-[#16131F]"
            >
              {accounts.map(a => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.provider} - {a.num}) {a.isDefault ? '— Par défaut' : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="p-3 bg-[#FAF8FF] rounded-2xl border border-[#E2DCF8] text-xs flex justify-between">
            <span className="text-[#5E5A70]">Délai estimé de réception</span>
            <span className="font-extrabold text-emerald-600">Instantané (&lt; 5 minutes)</span>
          </div>

          <div className="flex justify-end gap-3 mt-3 pt-3 border-t border-[#F0EDFB]">
            <Button variant="ghost" type="button" onClick={() => setIsWithdrawModalOpen(false)}>
              Annuler
            </Button>
            <Button variant="primary" type="submit">
              Confirmer le retrait
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Account Modal */}
      <Modal
        isOpen={isAddAccountModalOpen}
        onClose={() => setIsAddAccountModalOpen(false)}
        title="Ajouter un compte de retrait"
        description="Enregistrez un nouveau compte Mobile Money ou compte bancaire pour vos virements."
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!newAccName || !newAccNum) return;
            toast.success(`Compte ${newAccName} ajouté`);
            setIsAddAccountModalOpen(false);
            setNewAccName('');
            setNewAccNum('');
          }}
          className="flex flex-col gap-4 mt-2"
        >
          <div>
            <label className="text-xs font-bold text-[#5E5A70] block mb-1">Intitulé du compte *</label>
            <Input
              placeholder="Ex: Wave Souleymane Perso"
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
            <label className="text-xs font-bold text-[#5E5A70] block mb-1">Numéro de téléphone / IBAN *</label>
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
              Ajouter ce compte
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
