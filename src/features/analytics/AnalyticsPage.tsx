import React, { useState } from 'react';
import { 
  Sparkles, 
  Download, 
  FileSpreadsheet, 
  TrendingUp, 
  CheckCircle2, 
  X,
  HelpCircle,
  ArrowRight
} from 'lucide-react';

type PeriodType = '7' | '30' | '90' | '365';
type GrainType = 'jour' | 'semaine' | 'mois';

export const AnalyticsPage: React.FC = () => {
  const [period, setPeriod] = useState<PeriodType>('30');
  const [grain, setGrain] = useState<GrainType>('semaine');
  const [toast, setToast] = useState<string | null>(null);

  const fmt = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  const pc = (a: number, b: number) => (b ? (a / b * 100) : 0).toFixed(1).replace('.', ',').replace(',0', '') + ' %';

  const factors: Record<PeriodType, number> = { '7': 0.24, '30': 1, '90': 3, '365': 11.5 };
  const labels: Record<PeriodType, string> = {
    '7': 'sur les 7 derniers jours',
    '30': 'sur les 30 derniers jours',
    '90': 'sur les 90 derniers jours',
    '365': 'sur les 12 derniers mois'
  };

  const k = factors[period];
  const S = (n: number) => Math.round(n * k);

  // Conversion Funnel
  const fRaw: [string, number][] = [
    ['Visites boutique', 29400],
    ['Vues fiche produit', 18200],
    ['Formulaires ouverts', 2450],
    ['Commandes reçues', 790],
    ['Commandes livrées', 505]
  ];

  // Statuses
  const stRaw: [string, string, number, string][] = [
    ['Livrée', 'Taux de livraison', 505, '#241D5E'],
    ['En cours', 'En cours', 70, '#6C4CF1'],
    ['Annulée', 'Taux d’annulation', 63, '#B4AFC4'],
    ['Reportée', 'Taux de report', 55, '#E0A33A'],
    ['Injoignable', 'Taux d’injoignables', 61, '#8B869C'],
    ['Contestée', 'Taux de contestation', 36, '#E3807A']
  ];

  // Period series
  const series: Record<GrainType, [string, number][]> = {
    jour: [['Lun', 8], ['Mar', 10], ['Mer', 7], ['Jeu', 11], ['Ven', 10], ['Sam', 13], ['Dim', 9]],
    semaine: [['S35', 52], ['S36', 57], ['S37', 55], ['S38', 63], ['S39', 70], ['S40', 66], ['S41', 74], ['S42', 68]],
    mois: [['Mai', 182], ['Juin', 197], ['Juil.', 214], ['Août', 240], ['Sept.', 281], ['Oct.', 205]]
  };

  const currentSer = series[grain];
  const maxBar = Math.max(...currentSer.map(x => x[1]));

  // Products
  const pRaw: [string, number, number, number][] = [
    ['Montre élégante', 120, 17500, 0.71],
    ['Sac à main chic', 88, 15000, 0.68],
    ['Robe élégante', 40, 19000, 0.58],
    ['Baskets tendance', 76, 12000, 0.62],
    ['Sérum éclat 30 ml', 70, 9500, 0.74],
    ['Chemise homme', 48, 10000, 0.66],
    ['Pagne wax 6 yards', 38, 7500, 0.70],
    ['Autres produits', 25, 8000, 0.60]
  ];
  const caTot = pRaw.reduce((a, p) => a + p[1] * p[2], 0);

  // Geographic zones
  const zRaw: [string, number, number][] = [
    ['Abidjan', 470, 322],
    ['Bouaké', 95, 52],
    ['Yamoussoukro', 70, 45],
    ['San-Pédro', 58, 36],
    ['Korhogo', 52, 27],
    ['Daloa', 45, 23]
  ];
  const avgCA = caTot / 505;

  const getRateBadge = (r: number) => {
    if (r >= 0.68) return 'bg-[#E3F4EC] text-[#1E5E3F]';
    if (r >= 0.60) return 'bg-[#FFF0D6] text-[#6B4100]';
    return 'bg-[#FCE3E0] text-[#8A2414]';
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast */}
      {toast && (
        <div className="flex items-center gap-3 bg-[#241D5E] text-white rounded-2xl p-4 shadow-lg animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-[#7CE0AE] flex-shrink-0" />
          <span className="flex-1 font-semibold text-sm">{toast}</span>
          <button 
            onClick={() => setToast(null)}
            className="text-white/70 hover:text-white font-bold p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#16131F] tracking-tight">Analytics</h1>
          <p className="text-sm text-[#5E5A70] mt-1">Rapports approfondis sur les performances de votre boutique.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Period selector */}
          <div className="flex items-center bg-white p-1 rounded-xl border border-[#E2DCF8] shadow-sm">
            {(['7', '30', '90', '365'] as PeriodType[]).map((p) => {
              const labelMap: Record<PeriodType, string> = { '7': '7 j', '30': '30 j', '90': '90 j', '365': '12 mois' };
              const active = period === p;
              return (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    active 
                      ? 'bg-[#6C4CF1] text-white shadow-sm' 
                      : 'text-[#3A3647] hover:text-[#16131F] hover:bg-[#F4F1FE]'
                  }`}
                >
                  {labelMap[p]}
                </button>
              );
            })}
          </div>

          <button 
            onClick={() => setToast(`Rapport PDF généré (${labels[period]}). Téléchargement prêt.`)}
            className="flex items-center gap-2 px-4 py-2 bg-white text-[#16131F] border border-[#E2DCF8] rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50 transition-all active:scale-95"
          >
            <Download className="w-4 h-4 text-[#5E5A70]" />
            Exporter en PDF
          </button>

          <button 
            onClick={() => setToast(`Rapport Excel généré (${labels[period]}). Téléchargement prêt.`)}
            className="flex items-center gap-2 px-4 py-2 bg-[#6C4CF1] text-white rounded-xl text-sm font-bold shadow-md shadow-[#6C4CF1]/25 hover:bg-[#5B3FD6] transition-all active:scale-95"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Exporter en Excel
          </button>
        </div>
      </div>

      {/* Funnel Section */}
      <section className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6">
        <div className="flex flex-wrap justify-between items-end gap-4 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-[#16131F]">Conversion du formulaire boutique</h2>
            <p className="text-xs text-[#5E5A70] mt-0.5">De la visite à la commande livrée, {labels[period]}</p>
          </div>
          <div className="flex items-center gap-8">
            <div className="text-right">
              <span className="text-2xl font-extrabold text-[#3F25A8] block leading-none">{pc(790, 2450)}</span>
              <span className="text-xs text-[#5E5A70] font-semibold mt-1 block">Formulaire ouvert → commande</span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-extrabold text-[#16131F] block leading-none">{pc(790, 29400)}</span>
              <span className="text-xs text-[#5E5A70] font-semibold mt-1 block">Visite → commande</span>
            </div>
          </div>
        </div>

        {/* Funnel chart columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-end pt-4">
          {fRaw.map(([label, v], idx) => {
            const scaled = S(v);
            const stepConv = idx === 0 ? '' : `→ ${pc(v, fRaw[idx - 1][1])}`;
            // Dynamic height scaling for visually pleasant progression
            const heightPct = Math.max(8, Math.sqrt(v / 29400) * 100);
            const barBg = idx === 3 ? 'bg-[#6C4CF1]' : idx === 4 ? 'bg-[#241D5E]' : 'bg-[#B9AAFF]';

            return (
              <div key={label} className="flex flex-col gap-2">
                <span className="text-xs font-bold text-[#1E5E3F] h-4 flex items-center">
                  {stepConv}
                </span>
                <div className="h-40 flex items-end bg-[#FAF9FE] rounded-xl p-1">
                  <div 
                    style={{ height: `${heightPct}%` }}
                    className={`w-full rounded-lg transition-all duration-500 ${barBg}`}
                  />
                </div>
                <div>
                  <span className="text-xl font-black text-[#16131F] block">{fmt(scaled)}</span>
                  <span className="text-xs font-semibold text-[#5E5A70] line-clamp-1">{label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Status Analysis + Kolix AI */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5">
          <h2 className="text-lg font-bold text-[#16131F]">Analyse des statuts de commande</h2>
          
          {/* Segmented Bar */}
          <div className="h-4 rounded-full overflow-hidden flex bg-gray-100 shadow-inner">
            {stRaw.map(([s, _, n, color]) => (
              <div 
                key={s}
                style={{ width: `${(n / 790) * 100}%`, backgroundColor: color }}
                title={`${s}: ${pc(n, 790)}`}
                className="h-full transition-all duration-300 hover:opacity-90"
              />
            ))}
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {stRaw.map(([s, rateLabel, n, color]) => (
              <div key={s} className="border border-[#EEEAFB] rounded-xl p-3.5 flex flex-col gap-1 hover:border-[#6C4CF1]/30 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                  <span className="text-xs font-bold text-[#3A3647] truncate">{rateLabel}</span>
                </div>
                <span className="text-xl font-extrabold text-[#16131F] mt-1">{pc(n, 790)}</span>
                <span className="text-xs text-[#5E5A70]">{fmt(S(n))} commandes</span>
              </div>
            ))}
          </div>
        </section>

        {/* Kolix AI Reading */}
        <section className="bg-[#241D5E] text-white rounded-2xl p-6 flex flex-col justify-between shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#6C4CF1]/20 rounded-full blur-2xl pointer-events-none" />
          <div className="space-y-4 relative z-10">
            <div className="flex items-center gap-2 text-xs font-extrabold tracking-wider uppercase text-[#B9AAFF]">
              <Sparkles className="w-4 h-4 text-[#B9AAFF]" />
              <span>Lecture Kolix AI</span>
            </div>
            <p className="text-sm font-medium leading-relaxed text-[#EDE8FF]">
              Korhogo et Daloa livrent à peine plus d’une commande sur deux. Un appel de confirmation avant expédition ou un acompte Mobile Money pourrait réduire les retours.
            </p>
            <p className="text-xs leading-relaxed text-[#C5BDEB]">
              Votre formulaire convertit bien : près d’un formulaire ouvert sur trois devient une commande.
            </p>
          </div>
          <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between text-xs text-[#B9AAFF]">
            <span>Analyse en temps réel</span>
            <span className="w-2 h-2 rounded-full bg-[#7CE0AE] animate-ping" />
          </div>
        </section>
      </div>

      {/* Sales by Period */}
      <section className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <h2 className="text-lg font-bold text-[#16131F]">Ventes par période</h2>
          <div className="flex items-center bg-[#F4F1FE] p-1 rounded-xl">
            {(['jour', 'semaine', 'mois'] as GrainType[]).map((g) => {
              const labelMap: Record<GrainType, string> = { jour: 'Jour', semaine: 'Semaine', mois: 'Mois' };
              const active = grain === g;
              return (
                <button
                  key={g}
                  onClick={() => setGrain(g)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    active
                      ? 'bg-white text-[#16131F] shadow-sm font-extrabold'
                      : 'text-[#5E5A70] hover:text-[#16131F]'
                  }`}
                >
                  {labelMap[g]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bars Container */}
        <div className="pt-6">
          <div 
            className="grid gap-3 items-end h-52 border-b border-[#E2DCF8] pb-3"
            style={{ gridTemplateColumns: `repeat(${currentSer.length}, minmax(0, 1fr))` }}
          >
            {currentSer.map(([label, n]) => {
              const isPeak = n === maxBar;
              const barHeight = Math.round((n / maxBar) * 160);

              return (
                <div key={label} className="flex flex-col items-center justify-end h-full gap-2 group">
                  <span className="text-[11px] font-bold text-[#3A3647] group-hover:text-[#6C4CF1] transition-colors">
                    {n}
                  </span>
                  <div 
                    style={{ height: `${barHeight}px` }}
                    className={`w-full max-w-[44px] rounded-t-lg transition-all duration-300 ${
                      isPeak ? 'bg-[#6C4CF1] shadow-md shadow-[#6C4CF1]/20' : 'bg-[#B9AAFF] hover:bg-[#9780FF]'
                    }`}
                  />
                  <span className="text-xs font-semibold text-[#5E5A70] mt-1">{label}</span>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-[#5E5A70] mt-3">Nombre de ventes livrées par période.</p>
        </div>
      </section>

      {/* Tables: Products & Geographic Zones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Products Table */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-[#16131F]">Ventes par produit</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-[#FAF9FE] text-[#5E5A70] text-xs uppercase tracking-wider">
                    <th className="py-3 px-4 font-bold">Produit</th>
                    <th className="py-3 px-3 font-bold text-right">Unités</th>
                    <th className="py-3 px-3 font-bold">Part du CA</th>
                    <th className="py-3 px-3 font-bold text-right">CA</th>
                    <th className="py-3 px-4 font-bold text-right">Livraison</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EDFB]">
                  {pRaw.map(([name, u, price, r]) => {
                    const scaledU = S(u);
                    const scaledCA = S(u * price);
                    const share = Math.round((u * price / caTot) * 100);

                    return (
                      <tr key={name} className="hover:bg-[#FAF9FE]/50 transition-colors">
                        <td className="py-3 px-4 font-bold text-[#16131F]">{name}</td>
                        <td className="py-3 px-3 text-right text-[#3A3647] font-semibold">{fmt(scaledU)}</td>
                        <td className="py-3 px-3 min-w-[120px]">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-[#F0EDFB] rounded-full overflow-hidden">
                              <div 
                                style={{ width: `${(u * price / (120 * 17500)) * 100}%` }} 
                                className="h-full bg-[#6C4CF1] rounded-full"
                              />
                            </div>
                            <span className="text-xs font-bold text-[#5E5A70] w-9 text-right">{share} %</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right font-black text-[#16131F] whitespace-nowrap">
                          {fmt(scaledCA)} F
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className={`inline-block text-xs font-bold rounded-lg px-2 py-0.5 ${getRateBadge(r)}`}>
                            {Math.round(r * 100)} %
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div className="p-3 border-t border-gray-100 bg-[#FAF9FE]/50 text-xs text-[#5E5A70] flex items-center justify-between">
            <span>Classé par volume de chiffre d'affaires</span>
          </div>
        </section>

        {/* Geographic Zones Table */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-[#16131F]">Ventes par zone géographique</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-[#FAF9FE] text-[#5E5A70] text-xs uppercase tracking-wider">
                    <th className="py-3 px-4 font-bold">Zone</th>
                    <th className="py-3 px-3 font-bold text-right">Commandes</th>
                    <th className="py-3 px-3 font-bold text-right">Livrées</th>
                    <th className="py-3 px-3 font-bold text-right">CA</th>
                    <th className="py-3 px-4 font-bold text-right">Livraison</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EDFB]">
                  {zRaw.map(([name, o, d]) => {
                    const scaledO = S(o);
                    const scaledD = S(d);
                    const scaledCA = S(d * avgCA);
                    const rate = d / o;

                    return (
                      <tr key={name} className="hover:bg-[#FAF9FE]/50 transition-colors">
                        <td className="py-3 px-4 font-bold text-[#16131F]">{name}</td>
                        <td className="py-3 px-3 text-right text-[#3A3647] font-semibold">{fmt(scaledO)}</td>
                        <td className="py-3 px-3 text-right text-[#3A3647] font-semibold">{fmt(scaledD)}</td>
                        <td className="py-3 px-3 text-right font-black text-[#16131F] whitespace-nowrap">
                          {fmt(scaledCA)} F
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className={`inline-block text-xs font-bold rounded-lg px-2 py-0.5 ${getRateBadge(rate)}`}>
                            {Math.round(rate * 100)} %
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div className="p-3 border-t border-gray-100 bg-[#FAF9FE]/50 text-xs text-[#5E5A70]">
            Taux de livraison = commandes livrées ÷ commandes reçues.
          </div>
        </section>
      </div>
    </div>
  );
};
