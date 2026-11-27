import React, { useState, useEffect, useMemo } from 'react';
import { 
  Copy, 
  Check, 
  Share2, 
  ArrowUpRight, 
  Wallet, 
  TrendingUp, 
  Users, 
  Gift, 
  CheckCircle2, 
  Download,
  ShieldCheck,
  Sparkles,
  Lock,
  X,
  Zap,
  ArrowRight,
  Loader2,
  Calendar,
  CheckCheck
} from 'lucide-react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { affiliatesApi, AffiliateSummaryData, AffiliateReferralItem } from '../../api/affiliates.api';

type FilterChip = 'all' | 'active' | 'trial' | 'churned';

const PLAN_RATES: Record<string, number> = {
  Start: 5000,
  Grow: 10000,
  Pro: 15000,
  Empire: 50000
};

export const PartenairePage: React.FC = () => {
  const { user, updatePlan } = useAuth();
  const [summary, setSummary] = useState<AffiliateSummaryData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [chip, setChip] = useState<FilterChip>('all');
  const [isTransferring, setIsTransferring] = useState(false);

  // Modal d'activation d'abonnement avec les gains
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'Start' | 'Grow' | 'Pro' | 'Empire'>('Grow');
  const [selectedDuration, setSelectedDuration] = useState<number>(1);
  const [isActivatingSub, setIsActivatingSub] = useState(false);

  // Chargement des données réelles du backend
  const loadAffiliateData = async () => {
    try {
      setIsLoading(true);
      const data = await affiliatesApi.getSummary();
      if (data) {
        setSummary(data);
      }
    } catch {
      // Ignorer ou utiliser fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAffiliateData();
  }, []);

  // Détermination du code et lien d'affiliation
  const affiliateCode = summary?.affiliate_code 
    || (user ? `KX${(user.name || 'MK').slice(0, 3).toUpperCase()}${user.id ? user.id.slice(-2) : '10'}` : 'KX10');
  const promoCode = affiliateCode;
  const affiliateLink = summary?.affiliate_link 
    ? `${window.location.host}/register?ref=${affiliateCode}` 
    : `${window.location.host}/register?ref=${affiliateCode}`;
  const fullShareUrl = `${window.location.origin}/register?ref=${affiliateCode}`;

  const availableBalance = summary?.available_balance ?? 0;
  const totalEarned = summary?.total_earned ?? 0;

  // Calcul du coût du forfait sélectionné
  const discountRate = selectedDuration === 12 ? 0.2 : selectedDuration === 6 ? 0.1 : selectedDuration === 3 ? 0.05 : 0;
  const baseCost = (PLAN_RATES[selectedPlan] || 10000) * selectedDuration;
  const finalCost = Math.round(baseCost * (1 - discountRate));
  const isBalanceSufficient = availableBalance >= finalCost;

  const copyToClipboard = (text: string, type: 'link' | 'code') => {
    navigator.clipboard?.writeText(text);
    if (type === 'link') {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
      toast.success('Lien d’affiliation copié dans le presse-papier !');
    } else {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
      toast.success('Code promo copié dans le presse-papier !');
    }
  };

  // Transfert vers le portefeuille marchand
  const handleTransfer = async () => {
    if (availableBalance <= 0) return;
    try {
      setIsTransferring(true);
      const msg = await affiliatesApi.transferCommissions(availableBalance);
      setSummary(prev => prev ? { ...prev, available_balance: 0 } : null);
      confetti({ particleCount: 50, spread: 60 });
      toast.success(msg || `${availableBalance.toLocaleString()} FCFA transférés vers votre Portefeuille Kolix !`);
    } catch (err: any) {
      toast.error(err.message || 'Impossible d’effectuer le transfert');
    } finally {
      setIsTransferring(false);
    }
  };

  // Activation de l'abonnement grâce aux gains
  const handleActivateSubscription = async () => {
    if (!isBalanceSufficient) {
      toast.error(`Solde insuffisant. Il vous manque ${(finalCost - availableBalance).toLocaleString()} FCFA pour ce forfait.`);
      return;
    }
    try {
      setIsActivatingSub(true);
      const res = await affiliatesApi.subscribeWithCommissions({
        plan_name: selectedPlan,
        duration_months: selectedDuration
      });
      updatePlan(selectedPlan);
      if (res?.data?.remaining_balance !== undefined) {
        setSummary(prev => prev ? { ...prev, available_balance: res.data.remaining_balance } : null);
      }
      setIsSubModalOpen(false);
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      toast.success(res.message || `Abonnement Kolix ${selectedPlan} activé avec succès !`);
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de l’activation de l’abonnement');
    } finally {
      setIsActivatingSub(false);
    }
  };

  // Historique mensuel des gains
  const monthlyGains = summary?.monthly_gains && summary.monthly_gains.length > 0 
    ? summary.monthly_gains 
    : [
        { month: 'Mai', amount: 0 },
        { month: 'Juin', amount: 0 },
        { month: 'Juil.', amount: 0 },
        { month: 'Août', amount: 0 },
        { month: 'Sept.', amount: 0 },
        { month: 'Oct.', amount: totalEarned > 0 ? totalEarned : 0 },
      ];
  const maxGain = Math.max(...monthlyGains.map(m => m.amount), 10000);

  // Filleuls réels
  const rawReferrals = summary?.referrals || [];
  const referralsList = rawReferrals.map((r, idx) => ({
    id: r.id || `ref-${idx}`,
    shop: r.referred_shop_name || 'Boutique Kolix',
    who: r.referred_user_name || 'Marchand',
    date: 'Récemment',
    source: r.source || `Code ${affiliateCode}`,
    plan: r.plan || 'Grow',
    status: r.status || 'Actif',
    monthsCount: r.months_count || 1,
    totalMonths: r.total_months || 12,
    earned: `${Number(r.earned_total || 0).toLocaleString()} F`,
    monthly: `${Number(r.monthly_commission || 0).toLocaleString()} F / mois`
  }));

  const filteredFilleuls = referralsList.filter((f) => {
    if (chip === 'active') return f.status === 'Actif';
    if (chip === 'trial') return f.status === 'Essai gratuit';
    if (chip === 'churned') return f.status === 'Résilié';
    return true;
  });

  const activeReferralsCount = referralsList.filter(f => f.status === 'Actif').length;
  const trialReferralsCount = referralsList.filter(f => f.status === 'Essai gratuit').length;
  const churnedReferralsCount = referralsList.filter(f => f.status === 'Résilié').length;

  const totalMonthlyRecurrent = rawReferrals
    .filter(r => r.status === 'Actif')
    .reduce((sum, r) => sum + Number(r.monthly_commission || 0), 0);

  if (isLoading && !summary) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="w-10 h-10 border-4 border-[#6C4CF1] border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-semibold text-[#5E5A70]">Chargement de votre espace Partenaire...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-300">
      {/* Title & Category Badge */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold text-[#16131F] tracking-tight">Espace Partenaire</h1>
            <span className="flex items-center gap-1.5 text-xs font-extrabold bg-[#E3F9ED] text-[#136637] border border-[#BDEFD4] rounded-full px-3 py-1 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#136637]" />
              Programme Actif
            </span>
            <span className="text-xs font-extrabold bg-[#EEE9FF] text-[#3F25A8] rounded-full px-3 py-1">
              Commission : 20 % récurrent
            </span>
          </div>
          <p className="text-sm text-[#5E5A70] mt-1">
            Partagez Kolix, parrainez de nouveaux marchands et touchez 20 % de commission sur chaque abonnement. Utilisez ensuite vos gains pour activer votre propre abonnement ou les retirer !
          </p>
        </div>
      </div>

      {/* Program Benefits Banner */}
      <div className="bg-[#FAF8FF] border border-[#E2DCF8] rounded-2xl p-4 flex items-center gap-3.5 text-sm text-[#241D5E] shadow-sm">
        <span className="w-10 h-10 rounded-xl bg-[#F4F1FE] text-[#6C4CF1] flex items-center justify-center shrink-0 shadow-sm">
          <Zap className="w-5 h-5 text-[#6C4CF1]" />
        </span>
        <div className="flex-1">
          <strong className="block text-sm font-extrabold">Financez votre abonnement Kolix grâce à vos filleuls</strong>
          <span className="text-xs text-[#5E5A70]">
            Chaque marchand inscrit avec votre lien ou votre code vous rapporte des commissions récurrentes. Vous pouvez utiliser vos gains disponibles pour activer instantanément n'importe quel abonnement Kolix (Start, Grow, Pro, Empire) !
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsSubModalOpen(true)}
          className="shrink-0 px-4 py-2 bg-[#6C4CF1] text-white font-extrabold rounded-xl text-xs hover:bg-[#5B3FD6] transition-all shadow-sm flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Activer un abonnement
        </button>
      </div>

      {/* Sharing Banner: Affiliate link + Promo code */}
      <section className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Link box */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-extrabold text-[#5E5A70] uppercase tracking-wider block">
              Votre lien d’affiliation (parrainage direct)
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-[#F4F1FE] text-[#16131F] font-bold text-sm sm:text-base px-4 py-3 rounded-2xl truncate border border-[#E2DCF8]">
                {affiliateLink}
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(fullShareUrl, 'link')}
                className="px-5 py-3 bg-[#6C4CF1] text-white font-extrabold rounded-2xl text-sm shadow-md shadow-[#6C4CF1]/20 hover:bg-[#5B3FD6] active:scale-95 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
              >
                {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copiedLink ? 'Copié !' : 'Copier le lien'}
              </button>
            </div>
          </div>

          {/* Promo code box */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold text-[#5E5A70] uppercase tracking-wider block">
              Votre code partenaire
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 border-2 border-dashed border-[#B9AAFF] bg-[#FAF9FE] text-[#3F25A8] font-black text-lg py-2.5 rounded-2xl text-center tracking-wider">
                {promoCode}
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(promoCode, 'code')}
                className="px-4 py-3 bg-[#F4F1FE] text-[#3F25A8] font-extrabold rounded-2xl text-sm hover:bg-[#EEE9FF] active:scale-95 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
              >
                {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copiedCode ? 'Copié !' : 'Copier'}
              </button>
            </div>
          </div>
        </div>

        {/* Share buttons row */}
        <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4 text-xs text-[#5E5A70]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-[#16131F]">Partager directement :</span>
            <button
              onClick={() => {
                const text = encodeURIComponent(`Rejoignez Kolix pour booster vos ventes e-commerce COD en Afrique ! Inscrivez-vous avec mon lien ou utilisez mon code partenaire ${promoCode} : ${fullShareUrl}`);
                window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
              }}
              className="px-3.5 py-1.5 rounded-full font-extrabold bg-[#E3F4EC] text-[#1E5E3F] hover:bg-[#D0EFE0] transition-colors cursor-pointer"
            >
              WhatsApp
            </button>
            <button
              onClick={() => {
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullShareUrl)}`, '_blank');
              }}
              className="px-3.5 py-1.5 rounded-full font-extrabold bg-[#E8EEFB] text-[#1F3F8A] hover:bg-[#D6E3F9] transition-colors cursor-pointer"
            >
              Facebook
            </button>
            <button
              onClick={() => {
                copyToClipboard(fullShareUrl, 'link');
                toast.success('Lien prêt à être collé dans vos statuts et réseaux sociaux !');
              }}
              className="px-3.5 py-1.5 rounded-full font-extrabold bg-[#F4F1FE] text-[#3F25A8] hover:bg-[#E8E2FC] transition-colors cursor-pointer"
            >
              Copier pour statut
            </button>
          </div>
          <span className="italic">
            Votre code fonctionne à l'inscription même si le filleul s'inscrit sans cliquer sur le lien.
          </span>
        </div>
      </section>

      {/* KPIs Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { label: 'Filleuls inscrits', value: String(rawReferrals.length), note: `${activeReferralsCount} abonnés actifs` },
          { label: 'Abonnés actifs', value: String(activeReferralsCount), note: `${rawReferrals.length > 0 ? Math.round((activeReferralsCount / rawReferrals.length) * 100) : 0} % de conversion` },
          { label: 'Gains disponibles', value: `${availableBalance.toLocaleString()} F`, note: 'Prêt pour abonnement ou virement' },
          { label: 'Total gagné', value: `${totalEarned.toLocaleString()} F`, note: 'Cumul des commissions' },
          { label: 'Taux de commission', value: '20 %', note: 'Pendant 12 mois par filleul' },
        ].map((k) => (
          <div key={k.label} className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm flex flex-col gap-1">
            <span className="text-xs font-bold text-[#5E5A70]">{k.label}</span>
            <span className="text-2xl font-black text-[#16131F] mt-1 whitespace-nowrap">{k.value}</span>
            <span className="text-[11px] text-[#5E5A70]">{k.note}</span>
          </div>
        ))}
      </div>

      {/* Available earnings card + Monthly chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Available Wallet Card */}
        <section className="lg:col-span-5 bg-gradient-to-br from-[#6C4CF1] to-[#4B2FC9] text-white rounded-3xl p-7 shadow-xl shadow-[#6C4CF1]/20 flex flex-col justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#EDE8FF]">
                Gains disponibles immédiatement
              </span>
              <Wallet className="w-5 h-5 text-white/80" />
            </div>

            <div>
              <div className="text-4xl sm:text-5xl font-black tracking-tight leading-none">
                {availableBalance.toLocaleString()} FCFA
              </div>
              <p className="text-xs text-[#EDE8FF] mt-2">
                Utilisez votre solde pour financer votre abonnement Kolix ou effectuez un virement vers votre portefeuille.
              </p>
            </div>

            <div className="pt-4 border-t border-white/20 space-y-2 text-xs">
              <div className="flex justify-between items-center text-[#EDE8FF]">
                <span>Commission mensuelle récurrente :</span>
                <strong className="text-white font-black text-sm">
                  {totalMonthlyRecurrent > 0 ? `${totalMonthlyRecurrent.toLocaleString()} FCFA / mois` : '—'}
                </strong>
              </div>
              <div className="flex justify-between items-center text-[#EDE8FF]">
                <span>Total gagné depuis le début :</span>
                <strong className="text-white font-black text-sm">{totalEarned.toLocaleString()} FCFA</strong>
              </div>
            </div>
          </div>

          <div className="space-y-2 relative z-10">
            {/* Bouton principal : Activer abonnement */}
            <button
              type="button"
              onClick={() => setIsSubModalOpen(true)}
              className="w-full py-3.5 bg-white text-[#241D5E] hover:bg-white/95 rounded-2xl font-black text-sm transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#6C4CF1]" />
              Activer mon abonnement avec mes gains
            </button>

            {/* Bouton secondaire : Transfert portefeuille */}
            <button
              type="button"
              onClick={handleTransfer}
              disabled={availableBalance <= 0 || isTransferring}
              className={`w-full py-2.5 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                availableBalance > 0 
                  ? 'bg-white/15 text-white hover:bg-white/25 active:scale-95 cursor-pointer' 
                  : 'bg-white/10 text-white/40 cursor-not-allowed'
              }`}
            >
              {isTransferring ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <ArrowUpRight className="w-3.5 h-3.5" />
              )}
              {isTransferring ? 'Transfert en cours…' : 'Transférer vers mon portefeuille'}
            </button>

            <span className="text-[11px] text-[#EDE8FF]/80 text-center block pt-1">
              Validation instantanée sans frais.
            </span>
          </div>
        </section>

        {/* Monthly Earnings Bar Chart */}
        <section className="lg:col-span-7 bg-white rounded-3xl p-7 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-baseline mb-6">
            <div>
              <h2 className="text-lg font-bold text-[#16131F]">Gains par mois</h2>
              <p className="text-xs text-[#5E5A70]">Commissions d'affiliation validées en FCFA</p>
            </div>
            <span className="text-xs font-extrabold text-[#1E5E3F] bg-[#E3F4EC] px-2.5 py-1 rounded-full">
              20 % récurrent
            </span>
          </div>

          {/* Bar Chart */}
          <div className="space-y-3">
            <div className="grid grid-cols-6 gap-3 items-end h-44 border-b border-[#E2DCF8] pb-3">
              {monthlyGains.map((m, idx) => {
                const barHeight = Math.max(Math.round((m.amount / maxGain) * 140), m.amount > 0 ? 12 : 4);
                const isCurrent = idx === monthlyGains.length - 1;

                return (
                  <div key={m.month} className="flex flex-col items-center justify-end h-full gap-2 group">
                    <span className="text-[11px] font-extrabold text-[#3A3647] group-hover:text-[#6C4CF1] transition-colors whitespace-nowrap">
                      {m.amount > 0 ? `${Math.round(m.amount / 1000)}k` : '0'}
                    </span>
                    <div
                      style={{ height: `${barHeight}px` }}
                      className={`w-full max-w-[42px] rounded-t-xl transition-all duration-300 ${
                        isCurrent 
                          ? 'bg-[#6C4CF1] shadow-lg shadow-[#6C4CF1]/20' 
                          : 'bg-[#B9AAFF] hover:bg-[#9780FF]'
                      }`}
                    />
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-6 gap-3 text-center">
              {monthlyGains.map((m) => (
                <span key={m.month} className="text-xs font-semibold text-[#5E5A70]">
                  {m.month}
                </span>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Filleuls Table + Programme Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Table */}
        <section className="lg:col-span-8 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-[#16131F]">Mes filleuls</h2>
            
            {/* Filter chips */}
            <div className="flex flex-wrap items-center gap-1.5 bg-[#F4F1FE] p-1 rounded-xl">
              {[
                { id: 'all', label: `Tous (${referralsList.length})` },
                { id: 'active', label: `Actifs (${activeReferralsCount})` },
                { id: 'trial', label: `Essai gratuit (${trialReferralsCount})` },
                { id: 'churned', label: `Résiliés (${churnedReferralsCount})` },
              ].map((c) => {
                const active = chip === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setChip(c.id as FilterChip)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      active ? 'bg-white text-[#16131F] shadow-xs' : 'text-[#5E5A70] hover:text-[#16131F]'
                    }`}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-[#FAF9FE] text-[#5E5A70] text-xs uppercase tracking-wider">
                  <th className="py-3 px-6 font-bold">Marchand</th>
                  <th className="py-3 px-4 font-bold">Inscription</th>
                  <th className="py-3 px-4 font-bold">Source</th>
                  <th className="py-3 px-4 font-bold">Plan</th>
                  <th className="py-3 px-4 font-bold">Statut</th>
                  <th className="py-3 px-4 font-bold">Période commission</th>
                  <th className="py-3 px-6 font-bold text-right">Gains</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EDFB]">
                {filteredFilleuls.map((f) => (
                  <tr key={f.id} className="hover:bg-[#FAF9FE]/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-extrabold text-[#16131F]">{f.shop}</div>
                      <div className="text-xs text-[#5E5A70]">{f.who}</div>
                    </td>
                    <td className="py-4 px-4 text-[#3A3647] font-medium whitespace-nowrap">{f.date}</td>
                    <td className="py-4 px-4 text-[#5E5A70] text-xs font-semibold">{f.source}</td>
                    <td className="py-4 px-4">
                      <span className="inline-block text-xs font-extrabold px-2.5 py-1 rounded-lg bg-[#EEE9FF] text-[#3F25A8]">
                        {f.plan}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-block text-xs font-extrabold px-2.5 py-1 rounded-full ${
                        f.status === 'Actif'
                          ? 'bg-[#E3F4EC] text-[#1E5E3F]'
                          : f.status === 'Essai gratuit'
                          ? 'bg-[#FFF0D6] text-[#6B4100]'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {f.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 min-w-[140px]">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-[#F0EDFB] rounded-full overflow-hidden">
                          <div 
                            style={{ width: `${(f.monthsCount / f.totalMonths) * 100}%` }} 
                            className="h-full bg-[#6C4CF1] rounded-full"
                          />
                        </div>
                        <span className="text-xs font-bold text-[#3A3647] whitespace-nowrap">
                          {f.monthsCount}/{f.totalMonths} m
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="font-black text-[#16131F]">{f.earned}</div>
                      <div className="text-xs text-[#5E5A70]">{f.monthly}</div>
                    </td>
                  </tr>
                ))}
                {filteredFilleuls.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-10 px-4">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-[#F4F1FE] text-[#6C4CF1] flex items-center justify-center">
                          <Users className="w-6 h-6" />
                        </div>
                        <div className="text-sm font-extrabold text-[#16131F]">
                          Aucun filleul dans cette catégorie pour le moment
                        </div>
                        <p className="text-xs text-[#5E5A70] max-w-sm">
                          Partagez votre lien d'affiliation ou votre code <strong className="text-[#6C4CF1]">{affiliateCode}</strong> auprès de votre communauté pour toucher 20% sur chaque abonnement.
                        </p>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(fullShareUrl, 'link')}
                          className="mt-1 px-4 py-2 bg-[#6C4CF1] text-white text-xs font-extrabold rounded-xl hover:bg-[#5B3FD6] transition-colors"
                        >
                          Copier mon lien de parrainage
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-gray-100 bg-[#FAF9FE]/50 text-xs text-[#5E5A70]">
            Par respect pour la confidentialité des marchands, seuls le nom de la boutique et l'initiale sont affichés.
          </div>
        </section>

        {/* Programme Rules Card */}
        <section className="lg:col-span-4 bg-[#EEE9FF] rounded-3xl p-6 border border-[#E2DCFF] space-y-4">
          <div className="flex items-center gap-2 text-[#2E1F86]">
            <Sparkles className="w-5 h-5 text-[#6C4CF1]" />
            <h3 className="font-extrabold text-base">Règles du programme Partenaire</h3>
          </div>

          <div className="space-y-3 text-xs text-[#2E1F86] leading-relaxed">
            {[
              '20 % de commission récurrente sur chaque paiement d’abonnement de vos filleuls.',
              'Gains versés chaque mois pendant les 12 premiers mois complets d’activité du marchand.',
              'Possibilité d’utiliser vos gains pour activer ou prolonger vos propres abonnements Kolix sans frais.',
              'Retrait instantané sans frais vers votre portefeuille marchand Kolix (puis Wave / Orange Money).',
              'Code promo personnalisé qui s’applique même si le filleul s’inscrit sans cliquer sur le lien.',
            ].map((rule, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#6C4CF1] flex-shrink-0 mt-0.5" />
                <span>{rule}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* MODAL D'ACTIVATION D'ABONNEMENT AVEC LES GAINS */}
      {isSubModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-gray-100 overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-[#FAF9FE]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black bg-[#E3F9ED] text-[#136637] px-2.5 py-0.5 rounded-full">
                    Solde disponible : {availableBalance.toLocaleString()} FCFA
                  </span>
                </div>
                <h3 className="text-lg font-black text-[#16131F] mt-1">
                  Activer un abonnement avec mes gains
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSubModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 overflow-y-auto">
              {/* Étape 1 : Choix du forfait */}
              <div className="space-y-3">
                <label className="text-xs font-extrabold text-[#5E5A70] uppercase tracking-wider block">
                  1. Choisissez le forfait à activer
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'Start', name: 'Kolix Start', price: 5000, desc: '700 commandes / mois' },
                    { id: 'Grow', name: 'Kolix Grow', price: 10000, desc: '1 500 commandes / mois · CRM' },
                    { id: 'Pro', name: 'Kolix Pro', price: 15000, desc: 'Commandes illimitées · WhatsApp PRO' },
                    { id: 'Empire', name: 'Kolix Empire', price: 50000, desc: 'Multi-boutiques illimitées' },
                  ].map((p) => {
                    const isSelected = selectedPlan === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setSelectedPlan(p.id as any)}
                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#6C4CF1] bg-[#FAF8FF] shadow-sm ring-2 ring-[#6C4CF1]/20'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-sm text-[#16131F]">{p.name}</span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-[#6C4CF1]" />}
                        </div>
                        <div className="text-sm font-black text-[#6C4CF1] mt-1">
                          {p.price.toLocaleString()} FCFA <span className="text-[11px] font-normal text-[#5E5A70]">/ mois</span>
                        </div>
                        <span className="text-[11px] text-[#5E5A70] block mt-1">{p.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Étape 2 : Choix de la durée */}
              <div className="space-y-3">
                <label className="text-xs font-extrabold text-[#5E5A70] uppercase tracking-wider block">
                  2. Choisissez la durée d'engagement
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { months: 1, label: '1 mois', discount: '' },
                    { months: 3, label: '3 mois', discount: '-5%' },
                    { months: 6, label: '6 mois', discount: '-10%' },
                    { months: 12, label: '12 mois', discount: '-20%' },
                  ].map((d) => {
                    const isSelected = selectedDuration === d.months;
                    return (
                      <button
                        key={d.months}
                        type="button"
                        onClick={() => setSelectedDuration(d.months)}
                        className={`py-2.5 px-2 rounded-xl text-xs font-extrabold border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#6C4CF1] bg-[#6C4CF1] text-white shadow-xs'
                            : 'border-gray-200 bg-white text-[#3A3647] hover:border-gray-300'
                        }`}
                      >
                        <div>{d.label}</div>
                        {d.discount && (
                          <div className={`text-[10px] ${isSelected ? 'text-white/80' : 'text-[#1E5E3F] font-bold'}`}>
                            {d.discount}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Récapitulatif du débit */}
              <div className="p-4 rounded-2xl bg-[#F4F1FE] border border-[#E2DCF8] space-y-2">
                <div className="flex justify-between text-xs text-[#5E5A70]">
                  <span>Forfait sélectionné :</span>
                  <strong className="text-[#16131F]">Kolix {selectedPlan} ({selectedDuration} mois)</strong>
                </div>
                {discountRate > 0 && (
                  <div className="flex justify-between text-xs text-[#1E5E3F]">
                    <span>Remise durée :</span>
                    <strong className="font-bold">- {Math.round(discountRate * 100)} %</strong>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 border-t border-[#E2DCF8] text-sm">
                  <span className="font-extrabold text-[#16131F]">Montant total à déduire :</span>
                  <strong className="text-lg font-black text-[#6C4CF1]">{finalCost.toLocaleString()} FCFA</strong>
                </div>
                <div className="flex justify-between text-xs text-[#5E5A70] pt-1">
                  <span>Solde restant après activation :</span>
                  <strong className={isBalanceSufficient ? 'text-[#1E5E3F] font-bold' : 'text-red-600 font-bold'}>
                    {isBalanceSufficient 
                      ? `${(availableBalance - finalCost).toLocaleString()} FCFA` 
                      : `Solde insuffisant (manque ${(finalCost - availableBalance).toLocaleString()} FCFA)`}
                  </strong>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-100 bg-[#FAF9FE] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsSubModalOpen(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#5E5A70] hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                disabled={!isBalanceSufficient || isActivatingSub}
                onClick={handleActivateSubscription}
                className="px-5 py-2.5 bg-[#6C4CF1] hover:bg-[#5B3FD6] text-white text-xs font-extrabold rounded-xl transition-all shadow-md shadow-[#6C4CF1]/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isActivatingSub ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Activation en cours…</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Confirmer l'activation ({finalCost.toLocaleString()} F)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
