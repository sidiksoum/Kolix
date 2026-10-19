import React, { useState } from 'react';
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
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

type FilterChip = 'all' | 'active' | 'trial' | 'churned';

export const PartenairePage: React.FC = () => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [chip, setChip] = useState<FilterChip>('all');
  const [availableBalance, setAvailableBalance] = useState(145000);
  const [transferred, setTransferred] = useState(false);

  const affiliateLink = 'kolix.app/r/aminatraore';
  const promoCode = 'AMINA10';

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

  const handleTransfer = () => {
    if (availableBalance <= 0) return;
    const amount = availableBalance;
    setAvailableBalance(0);
    setTransferred(true);
    toast.success(`${amount.toLocaleString()} FCFA transférés vers votre Portefeuille Kolix !`);
  };

  const monthlyGains = [
    { month: 'Mai', amount: 45000 },
    { month: 'Juin', amount: 62000 },
    { month: 'Juil.', amount: 78000 },
    { month: 'Août', amount: 94000 },
    { month: 'Sept.', amount: 112000 },
    { month: 'Oct.', amount: 145000 },
  ];
  const maxGain = Math.max(...monthlyGains.map(m => m.amount));

  const allFilleuls = [
    { id: 1, shop: 'Boutique Glamour', who: 'Amina T.', date: '12/03/2026', source: 'Lien direct', plan: 'Pro', status: 'Actif', monthsCount: 8, totalMonths: 12, earned: '24 000 F', monthly: '3 000 F / mois' },
    { id: 2, shop: 'Koffi Électro', who: 'Koffi K.', date: '28/04/2026', source: 'Code AMINA10', plan: 'Grow', status: 'Actif', monthsCount: 6, totalMonths: 12, earned: '12 000 F', monthly: '2 000 F / mois' },
    { id: 3, shop: 'Diva Wax & Pagne', who: 'Fatou C.', date: '04/06/2026', source: 'Lien direct', plan: 'Empire', status: 'Actif', monthsCount: 4, totalMonths: 12, earned: '40 000 F', monthly: '10 000 F / mois' },
    { id: 4, shop: 'Chic Homme Abidjan', who: 'Ibrahim T.', date: '15/07/2026', source: 'Code AMINA10', plan: 'Start', status: 'Actif', monthsCount: 3, totalMonths: 12, earned: '3 000 F', monthly: '1 000 F / mois' },
    { id: 5, shop: 'Senteurs d’Orient', who: 'Aïcha B.', date: '01/10/2026', source: 'Lien direct', plan: 'Grow', status: 'Essai gratuit', monthsCount: 1, totalMonths: 12, earned: '0 F', monthly: '2 000 F / mois (bientôt)' },
    { id: 6, shop: 'Bio Nature CI', who: 'Mamadou D.', date: '10/02/2026', source: 'Code AMINA10', plan: 'Start', status: 'Résilié', monthsCount: 4, totalMonths: 12, earned: '4 000 F', monthly: '—' },
  ];

  const filteredFilleuls = allFilleuls.filter((f) => {
    if (chip === 'active') return f.status === 'Actif';
    if (chip === 'trial') return f.status === 'Essai gratuit';
    if (chip === 'churned') return f.status === 'Résilié';
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Title & Category Badge */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold text-[#16131F] tracking-tight">Espace Partenaire</h1>
            <span className="text-xs font-extrabold bg-[#EEE9FF] text-[#3F25A8] rounded-full px-3 py-1">
              Catégorie : Formateurs e-commerce
            </span>
          </div>
          <p className="text-sm text-[#5E5A70] mt-1">
            Partagez Kolix, suivez vos filleuls et vos gains en temps réel. Vous touchez 20 % de chaque abonnement pendant 12 mois.
          </p>
        </div>
      </div>

      {/* Sharing Banner: Affiliate link + Promo code */}
      <section className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Link box */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-extrabold text-[#5E5A70] uppercase tracking-wider block">
              Votre lien d’affiliation
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-[#F4F1FE] text-[#16131F] font-bold text-sm sm:text-base px-4 py-3 rounded-2xl truncate border border-[#E2DCF8]">
                {affiliateLink}
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(affiliateLink, 'link')}
                className="px-5 py-3 bg-[#6C4CF1] text-white font-extrabold rounded-2xl text-sm shadow-md shadow-[#6C4CF1]/20 hover:bg-[#5B3FD6] active:scale-95 transition-all flex items-center gap-1.5 whitespace-nowrap"
              >
                {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copiedLink ? 'Copié !' : 'Copier le lien'}
              </button>
            </div>
          </div>

          {/* Promo code box */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold text-[#5E5A70] uppercase tracking-wider block">
              Votre code promo (10% de remise filleul)
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 border-2 border-dashed border-[#B9AAFF] bg-[#FAF9FE] text-[#3F25A8] font-black text-lg py-2.5 rounded-2xl text-center tracking-wider">
                {promoCode}
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(promoCode, 'code')}
                className="px-4 py-3 bg-[#F4F1FE] text-[#3F25A8] font-extrabold rounded-2xl text-sm hover:bg-[#EEE9FF] active:scale-95 transition-all flex items-center gap-1.5 whitespace-nowrap"
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
                const text = encodeURIComponent(`Découvrez Kolix pour booster vos ventes e-commerce COD en Afrique ! https://${affiliateLink}`);
                window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
              }}
              className="px-3.5 py-1.5 rounded-full font-extrabold bg-[#E3F4EC] text-[#1E5E3F] hover:bg-[#D0EFE0] transition-colors"
            >
              WhatsApp
            </button>
            <button
              onClick={() => {
                window.open(`https://www.facebook.com/sharer/sharer.php?u=https://${affiliateLink}`, '_blank');
              }}
              className="px-3.5 py-1.5 rounded-full font-extrabold bg-[#E8EEFB] text-[#1F3F8A] hover:bg-[#D6E3F9] transition-colors"
            >
              Facebook
            </button>
            <button
              onClick={() => toast.info('Kit de visuels marketing Kolix en cours de téléchargement.')}
              className="px-3.5 py-1.5 rounded-full font-extrabold bg-[#F4F1FE] text-[#3F25A8] hover:bg-[#E8E2FC] transition-colors"
            >
              Kit de communication
            </button>
          </div>
          <span className="italic">
            Le code promo fonctionne même sans clic : idéal pour vos présentations en formation et vos statuts.
          </span>
        </div>
      </section>

      {/* KPIs Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { label: 'Clics sur le lien', value: '1 420', note: 'Taux de transfo : 18 %' },
          { label: 'Inscriptions', value: '256', note: 'Dont 110 marchands actifs' },
          { label: 'Abonnés payants', value: '42', note: 'Taux d’abonnement : 38 %' },
          { label: 'Chiffre d’affaires généré', value: '4 200 000 F', note: 'Commissions : 840 000 F' },
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
                + 45 000 FCFA en attente de validation (clôture mensuelle le 1er du mois).
              </p>
            </div>

            <div className="pt-4 border-t border-white/20 space-y-2 text-xs">
              <div className="flex justify-between items-center text-[#EDE8FF]">
                <span>Commission mensuelle récurrente :</span>
                <strong className="text-white font-black text-sm">84 000 FCFA / mois</strong>
              </div>
              <div className="flex justify-between items-center text-[#EDE8FF]">
                <span>Total gagné depuis le début :</span>
                <strong className="text-white font-black text-sm">685 000 FCFA</strong>
              </div>
            </div>
          </div>

          <div className="space-y-2 relative z-10">
            <button
              type="button"
              onClick={handleTransfer}
              disabled={availableBalance <= 0}
              className={`w-full py-3.5 rounded-2xl font-black text-sm transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 ${
                availableBalance > 0 
                  ? 'bg-white text-[#241D5E] hover:bg-white/95' 
                  : 'bg-white/20 text-white/60 cursor-not-allowed'
              }`}
            >
              <ArrowUpRight className="w-4 h-4" />
              {availableBalance > 0 ? 'Transférer vers mon portefeuille' : 'Aucun montant en attente'}
            </button>
            <span className="text-[11px] text-[#EDE8FF]/80 text-center block">
              Versement instantané vers votre Portefeuille Kolix, puis retrait direct en Wave ou Orange Money.
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
              +28% ce mois
            </span>
          </div>

          {/* Bar Chart */}
          <div className="space-y-3">
            <div className="grid grid-cols-6 gap-3 items-end h-44 border-b border-[#E2DCF8] pb-3">
              {monthlyGains.map((m) => {
                const barHeight = Math.round((m.amount / maxGain) * 140);
                const isCurrent = m.month === 'Oct.';

                return (
                  <div key={m.month} className="flex flex-col items-center justify-end h-full gap-2 group">
                    <span className="text-[11px] font-extrabold text-[#3A3647] group-hover:text-[#6C4CF1] transition-colors whitespace-nowrap">
                      {Math.round(m.amount / 1000)}k
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
                { id: 'all', label: 'Tous (42)' },
                { id: 'active', label: 'Actifs (38)' },
                { id: 'trial', label: 'Essai gratuit (8)' },
                { id: 'churned', label: 'Résiliés (4)' },
              ].map((c) => {
                const active = chip === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setChip(c.id as FilterChip)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
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
              'Validation automatique le 1er de chaque mois après règlement effectif de l’abonnement.',
              'Retrait instantané sans frais vers Wave, Orange Money ou MTN Mobile Money.',
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
    </div>
  );
};
