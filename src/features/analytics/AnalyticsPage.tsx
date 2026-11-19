import React, { useState, useEffect } from 'react';
import { 
  Download, 
  FileSpreadsheet, 
  TrendingUp, 
  CheckCircle2, 
  X,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Loader2
} from 'lucide-react';
import { analyticsApi, AnalyticsReportData } from '../../api/analytics.api';

type PeriodType = '7' | '30' | '90' | '365';
type GrainType = 'jour' | 'semaine' | 'mois';

export const AnalyticsPage: React.FC = () => {
  const [period, setPeriod] = useState<PeriodType>('30');
  const [grain, setGrain] = useState<GrainType>('semaine');
  const [toast, setToast] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<AnalyticsReportData | null>(null);

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

  useEffect(() => {
    let isMounted = true;
    const fetchReports = async () => {
      setLoading(true);
      try {
        const res = await analyticsApi.getReports(period, grain);
        if (isMounted && res) {
          setReportData(res);
        }
      } catch (err) {
        console.warn('Analytics report fetch error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchReports();
    return () => { isMounted = false; };
  }, [period, grain]);

  // Fallback Funnel
  const defaultFunnel: [string, number][] = [
    ['Visites boutique', 29400],
    ['Vues fiche produit', 18200],
    ['Formulaires ouverts', 2450],
    ['Commandes reçues', 790],
    ['Commandes livrées', 505]
  ];

  const funnelItems = reportData?.funnel && reportData.funnel.length === 5 
    ? reportData.funnel 
    : defaultFunnel.map(([label, v], idx) => ({
        label,
        value: fmt(S(v)),
        raw: S(v),
        step: idx === 0 ? '' : `→ ${pc(v, defaultFunnel[idx - 1][1])}`
      }));

  // Fallback Statuses
  const defaultStatuses: [string, string, number, string][] = [
    ['Livrée', 'Taux de livraison', 505, '#241D5E'],
    ['En cours', 'En cours', 70, '#6C4CF1'],
    ['Annulée', 'Taux d’annulation', 63, '#B4AFC4'],
    ['Reportée', 'Taux de report', 55, '#E0A33A'],
    ['Injoignable', 'Taux d’injoignables', 61, '#8B869C'],
    ['Contestée', 'Taux de contestation', 36, '#E3807A']
  ];

  const displayStatuses = reportData?.statuses && reportData.statuses.length === 6
    ? reportData.statuses.map(s => ({
        name: s.name,
        rateLabel: s.rateLabel,
        count: s.count,
        countRaw: s.rawCount,
        pct: s.pct,
        color: s.color
      }))
    : defaultStatuses.map(([name, rateLabel, n, color]) => ({
        name,
        rateLabel,
        count: fmt(S(n)),
        countRaw: S(n),
        pct: pc(n, 790),
        color
      }));

  const totalStatusOrders = displayStatuses.reduce((acc, curr) => acc + curr.countRaw, 0);

  // Time Series
  const defaultSeries: Record<GrainType, [string, number][]> = {
    jour: [['Lun', 8], ['Mar', 10], ['Mer', 7], ['Jeu', 11], ['Ven', 10], ['Sam', 13], ['Dim', 9]],
    semaine: [['S35', 52], ['S36', 57], ['S37', 55], ['S38', 63], ['S39', 70], ['S40', 66], ['S41', 74], ['S42', 68]],
    mois: [['Mai', 182], ['Juin', 197], ['Juil.', 214], ['Août', 240], ['Sept.', 281], ['Oct.', 205]]
  };

  const displayTimeBars = reportData?.timeBars && reportData.timeBars.length > 0
    ? reportData.timeBars
    : defaultSeries[grain].map(([label, n]) => ({ label, n, heightPercent: 0 }));

  const maxBar = Math.max(...displayTimeBars.map(x => x.n), 1);

  // Fallback Products
  const defaultProducts: [string, number, number, number][] = [
    ['Montre élégante', 120, 17500, 0.71],
    ['Sac à main chic', 88, 15000, 0.68],
    ['Robe élégante', 40, 19000, 0.58],
    ['Baskets tendance', 76, 12000, 0.62],
    ['Sérum éclat 30 ml', 70, 9500, 0.74],
    ['Chemise homme', 48, 10000, 0.66],
    ['Pagne wax 6 yards', 38, 7500, 0.70],
    ['Autres produits', 25, 8000, 0.60]
  ];
  const caTotFallback = defaultProducts.reduce((a, p) => a + p[1] * p[2], 0);

  const displayProducts = reportData?.products && reportData.products.length > 0
    ? reportData.products
    : defaultProducts.map(([name, u, price, r]) => ({
        name,
        units: S(u),
        ca: fmt(S(u * price)) + ' F',
        caRaw: S(u * price),
        sharePercent: Math.round((u * price / caTotFallback) * 100),
        rate: Math.round(r * 100) + ' %',
        rateRaw: r
      }));

  // Fallback Zones
  const defaultZones: [string, number, number][] = [
    ['Abidjan', 470, 322],
    ['Bouaké', 95, 52],
    ['Yamoussoukro', 70, 45],
    ['San-Pédro', 58, 36],
    ['Korhogo', 52, 27],
    ['Daloa', 45, 23]
  ];
  const avgCAFallback = caTotFallback / 505;

  const displayZones = reportData?.zones && reportData.zones.length > 0
    ? reportData.zones
    : defaultZones.map(([name, o, d]) => ({
        name,
        orders: S(o),
        done: S(d),
        ca: fmt(S(d * avgCAFallback)) + ' F',
        rate: Math.round(d / o * 100) + ' %',
        rateRaw: d / o
      }));

  const getRateBadge = (r: number) => {
    if (r >= 0.68) return 'bg-[#E3F4EC] text-[#1E5E3F]';
    if (r >= 0.60) return 'bg-[#FFF0D6] text-[#6B4100]';
    return 'bg-[#FCE3E0] text-[#8A2414]';
  };

  const handleExportExcel = () => {
    const pLabel = labels[period];
    const lines: string[] = [];
    
    // Header
    lines.push(`RAPPORT ANALYTIQUE KOLIX - ${pLabel.toUpperCase()}`);
    lines.push(`Date d'export;${new Date().toLocaleDateString('fr-FR')}`);
    lines.push(`Taux de conversion global;${reportData?.globalConversion || '2,7 %'}`);
    lines.push(`Taux d'abandon formulaire;${reportData?.cartAbandonment || '32,2 %'}`);
    lines.push('');

    // Funnel
    lines.push('--- ENTONNOIR DE CONVERSION ---');
    lines.push('Étape;Volume;Progression');
    funnelItems.forEach(f => {
      lines.push(`"${f.label}";"${f.value}";"${f.step}"`);
    });
    lines.push('');

    // Statuts
    lines.push('--- ANALYSE DES STATUTS DE COMMANDE ---');
    lines.push('Statut;Part;Nombre');
    displayStatuses.forEach(s => {
      lines.push(`"${s.rateLabel}";"${s.pct}";"${s.count}"`);
    });
    lines.push('');

    // Produits
    lines.push('--- VENTES PAR PRODUIT ---');
    lines.push('Produit;Unités;Part du CA;Chiffre d\'affaires;Taux de livraison');
    displayProducts.forEach(p => {
      lines.push(`"${p.name}";${p.units};"${p.sharePercent} %";"${p.ca}";"${p.rate}"`);
    });
    lines.push('');

    // Zones
    lines.push('--- VENTES PAR ZONE GÉOGRAPHIQUE ---');
    lines.push('Zone;Commandes reçues;Commandes livrées;Chiffre d\'affaires;Taux de livraison');
    displayZones.forEach(z => {
      lines.push(`"${z.name}";${z.orders};${z.done};"${z.ca}";"${z.rate}"`);
    });

    const csvContent = '\uFEFF' + lines.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `rapport_analytics_${period}j.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setToast(`Rapport Excel téléchargé avec succès (${pLabel}).`);
  };

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans animate-fade-in">
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
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold text-[#16131F] tracking-tight">Analytics</h1>
            {loading && <Loader2 className="w-5 h-5 animate-spin text-[#6C4CF1]" />}
          </div>
          <p className="text-sm text-[#5E5A70] mt-1 font-medium">
            Rapports approfondis sur les performances de votre boutique.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Period selector */}
          <div className="flex items-center bg-white p-1 rounded-2xl border border-[#E2DCF8] shadow-sm min-h-[46px]">
            {(['7', '30', '90', '365'] as PeriodType[]).map((p) => {
              const labelMap: Record<PeriodType, string> = { '7': '7 j', '30': '30 j', '90': '90 j', '365': '12 mois' };
              const active = period === p;
              return (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
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
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2.5 bg-white text-[#16131F] border border-[#E2DCF8] rounded-2xl text-xs sm:text-sm font-bold shadow-sm hover:bg-gray-50 transition-all active:scale-95 cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#5E5A70]" />
            Exporter en PDF
          </button>

          <button 
            onClick={handleExportExcel}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#6C4CF1] text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md shadow-[#6C4CF1]/25 hover:bg-[#5B3FD6] transition-all active:scale-95 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Exporter en Excel
          </button>
        </div>
      </div>

      {/* Funnel Section */}
      <section className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-sm space-y-6">
        <div className="flex flex-wrap justify-between items-end gap-4 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-[#16131F]">Conversion du formulaire boutique</h2>
            <p className="text-xs text-[#5E5A70] mt-0.5">De la visite à la commande livrée, {labels[period]}</p>
          </div>
          <div className="flex items-center gap-8">
            <div className="text-right">
              <span className="text-2xl font-black text-[#3F25A8] block leading-none">
                {reportData?.cartAbandonment ? reportData.cartAbandonment : pc(790, 2450)}
              </span>
              <span className="text-xs text-[#5E5A70] font-semibold mt-1 block">Formulaire ouvert → commande</span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-[#16131F] block leading-none">
                {reportData?.globalConversion ? reportData.globalConversion : pc(790, 29400)}
              </span>
              <span className="text-xs text-[#5E5A70] font-semibold mt-1 block">Visite → commande</span>
            </div>
          </div>
        </div>

        {/* Funnel chart columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-end pt-4">
          {funnelItems.map((item, idx) => {
            const rawMax = funnelItems[0]?.raw || 29400;
            const heightPct = Math.max(8, Math.sqrt(item.raw / rawMax) * 100);
            const barBg = idx === 3 ? 'bg-[#6C4CF1]' : idx === 4 ? 'bg-[#241D5E]' : 'bg-[#B9AAFF]';

            return (
              <div key={item.label} className="flex flex-col gap-2">
                <span className="text-xs font-bold text-[#1E5E3F] h-4 flex items-center">
                  {item.step}
                </span>
                <div className="h-40 flex items-end bg-[#FAF9FE] rounded-2xl p-1.5">
                  <div 
                    style={{ height: `${heightPct}%` }}
                    className={`w-full rounded-xl transition-all duration-500 ${barBg}`}
                  />
                </div>
                <div>
                  <span className="text-xl font-black text-[#16131F] block">{item.value}</span>
                  <span className="text-xs font-semibold text-[#5E5A70] line-clamp-1">{item.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Row: Status Analysis + Lecture Kolix AI */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch">
        {/* Status Analysis */}
        <section className="flex-1 lg:flex-[3] min-w-0 bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-sm space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#16131F]">Analyse des statuts de commande</h2>
            
            {/* Segmented Bar */}
            <div className="h-4 rounded-full overflow-hidden flex bg-gray-100 shadow-inner">
              {displayStatuses.map(s => {
                const segPct = totalStatusOrders > 0 ? (s.countRaw / totalStatusOrders) * 100 : 16.6;
                return (
                  <div 
                    key={s.name}
                    style={{ width: `${segPct}%`, backgroundColor: s.color }}
                    title={`${s.name}: ${s.pct}`}
                    className="h-full transition-all duration-300 hover:opacity-90"
                  />
                );
              })}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {displayStatuses.map(s => (
              <div key={s.name} className="border border-[#EEEAFB] rounded-2xl p-3.5 flex flex-col gap-1 hover:border-[#6C4CF1]/30 transition-colors bg-[#FAF9FE]/30">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                  <span className="text-xs font-bold text-[#3A3647] truncate">{s.rateLabel}</span>
                </div>
                <span className="text-xl font-extrabold text-[#16131F] mt-1">{s.pct}</span>
                <span className="text-xs text-[#5E5A70] font-medium">{s.count} commandes</span>
              </div>
            ))}
          </div>
        </section>

        {/* Lecture Kolix AI */}
        <section className="flex-1 lg:max-w-xs bg-[#241D5E] text-white rounded-3xl p-6 shadow-sm flex flex-col justify-between gap-4">
          <div className="space-y-3">
            <span className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-[#B9AAFF]">
              <Sparkles className="w-4 h-4 text-[#B9AAFF]" />
              Lecture Kolix AI
            </span>
            <p className="text-sm font-semibold text-white leading-relaxed">
              {reportData?.insights?.description || "Korhogo et Daloa livrent à peine plus d’une commande sur deux. Un appel de confirmation avant expédition ou un acompte Mobile Money pourrait réduire les retours."}
            </p>
          </div>
          <p className="text-xs text-[#D9D3F5] leading-relaxed pt-3 border-t border-white/10 font-medium">
            {reportData?.insights?.tip || "Votre formulaire convertit bien : près d’un formulaire ouvert sur trois devient une commande."}
          </p>
        </section>
      </div>

      {/* Sales by Period */}
      <section className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-sm space-y-4">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h2 className="text-lg font-bold text-[#16131F]">Ventes par période</h2>
            <p className="text-xs text-[#5E5A70] mt-0.5">Nombre de ventes livrées par période.</p>
          </div>
          <div className="flex items-center bg-[#F4F1FE] p-1 rounded-2xl min-h-[38px]">
            {(['jour', 'semaine', 'mois'] as GrainType[]).map((g) => {
              const labelMap: Record<GrainType, string> = { jour: 'Jour', semaine: 'Semaine', mois: 'Mois' };
              const active = grain === g;
              return (
                <button
                  key={g}
                  onClick={() => setGrain(g)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
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
            style={{ gridTemplateColumns: `repeat(${displayTimeBars.length}, minmax(0, 1fr))` }}
          >
            {displayTimeBars.map((item) => {
              const isPeak = item.n === maxBar;
              const barHeight = Math.round((item.n / maxBar) * 160);

              return (
                <div key={item.label} className="flex flex-col items-center justify-end h-full gap-2 group">
                  <span className="text-[11px] font-bold text-[#3A3647] group-hover:text-[#6C4CF1] transition-colors">
                    {item.n}
                  </span>
                  <div 
                    style={{ height: `${barHeight}px` }}
                    className={`w-full max-w-[44px] rounded-t-xl transition-all duration-300 ${
                      isPeak ? 'bg-[#6C4CF1] shadow-md shadow-[#6C4CF1]/20' : 'bg-[#B9AAFF] hover:bg-[#9780FF]'
                    }`}
                  />
                  <span className="text-xs font-semibold text-[#5E5A70] mt-1">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tables: Products & Geographic Zones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Products Table */}
        <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-[#16131F]">Ventes par produit</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-[#FAF9FE] text-[#5E5A70] text-xs uppercase tracking-wider">
                    <th className="py-3 px-6 font-bold">Produit</th>
                    <th className="py-3 px-3 font-bold text-right">Unités</th>
                    <th className="py-3 px-3 font-bold">Part du CA</th>
                    <th className="py-3 px-3 font-bold text-right">CA</th>
                    <th className="py-3 px-6 font-bold text-right">Livraison</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EDFB]">
                  {displayProducts.map((p) => {
                    return (
                      <tr key={p.name} className="hover:bg-[#FAF9FE]/50 transition-colors">
                        <td className="py-3.5 px-6 font-bold text-[#16131F]">{p.name}</td>
                        <td className="py-3.5 px-3 text-right text-[#3A3647] font-semibold">{fmt(p.units)}</td>
                        <td className="py-3.5 px-3 min-w-[120px]">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-[#F0EDFB] rounded-full overflow-hidden">
                              <div 
                                style={{ width: `${p.sharePercent}%` }} 
                                className="h-full bg-[#6C4CF1] rounded-full"
                              />
                            </div>
                            <span className="text-xs font-bold text-[#5E5A70] w-9 text-right">{p.sharePercent} %</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-right font-black text-[#16131F] whitespace-nowrap">
                          {p.ca}
                        </td>
                        <td className="py-3.5 px-6 text-right">
                          <span className={`inline-block text-xs font-bold rounded-lg px-2.5 py-1 ${getRateBadge(p.rateRaw)}`}>
                            {p.rate}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div className="p-4 border-t border-gray-100 bg-[#FAF9FE]/50 text-xs text-[#5E5A70] flex items-center justify-between">
            <span>Classé par volume de chiffre d'affaires</span>
          </div>
        </section>

        {/* Geographic Zones Table */}
        <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-[#16131F]">Ventes par zone géographique</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-[#FAF9FE] text-[#5E5A70] text-xs uppercase tracking-wider">
                    <th className="py-3 px-6 font-bold">Zone</th>
                    <th className="py-3 px-3 font-bold text-right">Commandes</th>
                    <th className="py-3 px-3 font-bold text-right">Livrées</th>
                    <th className="py-3 px-3 font-bold text-right">CA</th>
                    <th className="py-3 px-6 font-bold text-right">Livraison</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EDFB]">
                  {displayZones.map((z) => {
                    return (
                      <tr key={z.name} className="hover:bg-[#FAF9FE]/50 transition-colors">
                        <td className="py-3.5 px-6 font-bold text-[#16131F]">{z.name}</td>
                        <td className="py-3.5 px-3 text-right text-[#3A3647] font-semibold">{fmt(z.orders)}</td>
                        <td className="py-3.5 px-3 text-right text-[#3A3647] font-semibold">{fmt(z.done)}</td>
                        <td className="py-3.5 px-3 text-right font-black text-[#16131F] whitespace-nowrap">
                          {z.ca}
                        </td>
                        <td className="py-3.5 px-6 text-right">
                          <span className={`inline-block text-xs font-bold rounded-lg px-2.5 py-1 ${getRateBadge(z.rateRaw)}`}>
                            {z.rate}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div className="p-4 border-t border-gray-100 bg-[#FAF9FE]/50 text-xs text-[#5E5A70]">
            Taux de livraison = commandes livrées ÷ commandes reçues.
          </div>
        </section>
      </div>
    </div>
  );
};
