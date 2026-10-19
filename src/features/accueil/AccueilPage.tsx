import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PeriodType } from '../../types/common';
import { analyticsApi } from '../../api/analytics.api';
import { DashboardAnalytics } from '../../types/analytics';
import { 
  DollarSign, 
  Eye, 
  ShoppingBag, 
  CheckCircle2, 
  TrendingUp, 
  Calendar as CalendarIcon,
  MapPin,
  Package
} from 'lucide-react';
import { cn } from '../../utils/cn';

export const AccueilPage: React.FC = () => {
  const { user } = useAuth();
  const [period, setPeriod] = useState<PeriodType>('mois');
  const [data, setData] = useState<DashboardAnalytics | null>(null);

  useEffect(() => {
    analyticsApi.getDashboard(period).then(setData);
  }, [period]);

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-[#6C4CF1] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Icons map for KPIs
  const iconMap: Record<string, React.ReactNode> = {
    DollarSign: <DollarSign className="w-5 h-5" />,
    Eye: <Eye className="w-5 h-5" />,
    ShoppingBag: <ShoppingBag className="w-5 h-5" />,
    CheckCircle2: <CheckCircle2 className="w-5 h-5" />,
    TrendingUp: <TrendingUp className="w-5 h-5" />,
  };

  // Peak calculation for bar chart
  const maxCa = Math.max(...data.chartData.map(d => d.ca));
  const chartHeightMax = Math.ceil((maxCa * 1.15) / 100000) * 100000;
  const peakIdx = data.chartData.findIndex(d => d.ca === maxCa);

  // SVG Line path for sales
  const maxV = Math.max(...data.chartData.map(d => d.ventes)) * 1.15;
  const numPoints = data.chartData.length;
  const salesPath = 'M' + data.chartData.map((d, i) => {
    const x = ((i + 0.5) / numPoints) * 100;
    const y = 100 - (d.ventes / maxV) * 100;
    return `${x.toFixed(2)} ${y.toFixed(2)}`;
  }).join(' L');

  // Donut chart calculations
  let accumulatedDash = 0;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#241D5E] tracking-tight">
            Bienvenue {user.name.split(' ')[0]} !
          </h1>
          <p className="text-base text-[#5E5A70] font-medium mt-1">
            Voici l’aperçu de votre activité et de vos ventes
          </p>
        </div>

        {/* Period Selector */}
        <div
          role="group"
          aria-label="Période"
          className="flex bg-white rounded-full p-1 gap-1 shadow-kolix-sm border border-[#E2DCF8]/40"
        >
          {(['jour', 'semaine', 'mois'] as PeriodType[]).map((p) => {
            const labels = { jour: 'Jour', semaine: 'Semaine', mois: 'Mois' };
            const isSelected = period === p;
            return (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={cn(
                  'px-4 py-2 text-sm rounded-full transition-all duration-150 font-bold',
                  isSelected
                    ? 'bg-[#241D5E] text-white shadow-sm'
                    : 'bg-transparent text-[#3A3647] hover:text-[#16131F] font-semibold'
                )}
              >
                {labels[p]}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5 KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {data.kpis.map((kpi) => (
          <div
            key={kpi.id}
            className="bg-white rounded-[22px] p-5 flex flex-col gap-3.5 shadow-kolix hover:shadow-kolix-md transition-shadow"
          >
            <div className="flex justify-between items-start gap-2">
              <span
                className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: kpi.iconBg, color: kpi.iconFg }}
              >
                {iconMap[kpi.iconName]}
              </span>
              <span
                className={cn(
                  'text-xs font-extrabold rounded-full px-2.5 py-1 whitespace-nowrap',
                  kpi.isPositive ? 'bg-[#F4F1FE] text-[#3F25A8]' : 'bg-[#FCE3E0] text-[#8A2414]'
                )}
              >
                {kpi.isPositive ? '↗ ' : '↘ '} {kpi.trend}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-2xl font-extrabold text-[#241D5E] tracking-tight">
                {kpi.value}
              </div>
              <div className="text-xs text-[#5E5A70] font-semibold truncate">
                {kpi.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row: Revenue/Sales Bar+Line & Status Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Revenue & Sales Chart (Span 2) */}
        <section className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 flex flex-col gap-5 shadow-kolix">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <div>
              <h2 className="text-lg font-extrabold text-[#241D5E]">Chiffre d’affaires et ventes</h2>
              <span className="text-xs text-[#5E5A70] font-semibold">{data.periodLabel}</span>
            </div>
            <div className="flex gap-4 text-xs font-semibold text-[#3A3647]">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-[3px] bg-[#241D5E]" />
                CA (FCFA)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-4 h-0 border-t-[3px] border-[#A99BFA]" />
                Ventes livrées
              </span>
            </div>
          </div>

          {/* Chart Display Area */}
          <div className="grid grid-cols-[48px_1fr] gap-3 pt-2">
            {/* Y Ticks */}
            <div className="flex flex-col justify-between h-[260px] text-xs text-[#5E5A70] font-semibold text-right pr-2">
              <span>{(chartHeightMax / 1000000).toFixed(1)} M</span>
              <span>{((chartHeightMax * 2) / 3 / 1000000).toFixed(1)} M</span>
              <span>{((chartHeightMax / 3) / 1000000).toFixed(1)} M</span>
              <span>0</span>
            </div>

            {/* Bars and SVG Line Container */}
            <div className="flex flex-col gap-2 min-w-0">
              <div className="relative h-[260px] border-b border-[#E2DCF8] flex items-end gap-2 sm:gap-3 px-2">
                {/* Horizontal Guide Lines */}
                <div className="absolute left-0 right-0 top-0 border-t border-dashed border-[#EEEAFB]" />
                <div className="absolute left-0 right-0 top-1/3 border-t border-dashed border-[#EEEAFB]" />
                <div className="absolute left-0 right-0 top-2/3 border-t border-dashed border-[#EEEAFB]" />

                {/* Bars */}
                {data.chartData.map((d, i) => {
                  const h = (d.ca / chartHeightMax) * 100;
                  const isPeak = i === peakIdx;

                  return (
                    <div
                      key={i}
                      className="flex-1 h-full flex items-end justify-center relative group"
                    >
                      {/* Tooltip on peak or hover */}
                      <div
                        className={cn(
                          'absolute left-1/2 -translate-x-1/2 bg-[#241D5E] text-white text-[11px] font-bold rounded-lg px-2.5 py-1 whitespace-nowrap z-10 transition-opacity pointer-events-none shadow-md',
                          isPeak ? 'opacity-100 -top-8' : 'opacity-0 group-hover:opacity-100 -top-8'
                        )}
                      >
                        {d.label} · {d.formattedCa}
                      </div>

                      {/* Bar body */}
                      <div
                        className={cn(
                          'w-full max-w-[42px] rounded-t-lg transition-all duration-300 hover:brightness-110',
                          i % 2 === 0 ? 'bg-[#241D5E]' : 'bg-[#8B6CF6]'
                        )}
                        style={{ height: `${h.toFixed(1)}%` }}
                      />
                    </div>
                  );
                })}

                {/* SVG Overlay Line for Sales */}
                <svg
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
                >
                  <path
                    d={salesPath}
                    fill="none"
                    stroke="#A99BFA"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
              </div>

              {/* X Axis Labels */}
              <div
                className="grid gap-2 sm:gap-3 px-2 pt-1"
                style={{ gridTemplateColumns: `repeat(${numPoints}, minmax(0, 1fr))` }}
              >
                {data.chartData.map((d, i) => (
                  <span key={i} className="text-center text-xs font-semibold text-[#5E5A70]">
                    {d.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Right: Order Statuses Donut Chart */}
        <section className="bg-white rounded-3xl p-6 sm:p-7 flex flex-col gap-4 shadow-kolix justify-between">
          <h2 className="text-lg font-extrabold text-[#241D5E]">Statuts des commandes</h2>

          {/* Donut SVG */}
          <div className="relative w-44 h-44 mx-auto my-2">
            <svg viewBox="0 0 42 42" className="w-full h-full -rotate-90">
              <circle cx="21" cy="21" r="15.9" fill="none" stroke="#F0EDFB" strokeWidth="6" />
              {data.statusDistribution.map((item, idx) => {
                const dash = `${item.pct} ${100 - item.pct}`;
                const offset = -accumulatedDash;
                accumulatedDash += item.pct;

                return (
                  <circle
                    key={idx}
                    cx="21"
                    cy="21"
                    r="15.9"
                    fill="none"
                    stroke={item.color}
                    strokeWidth="6"
                    strokeDasharray={dash}
                    strokeDashoffset={offset}
                  />
                );
              })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-extrabold text-[#241D5E]">{data.conversionRate}</span>
              <span className="text-xs text-[#5E5A70] font-semibold">livrées</span>
            </div>
          </div>

          {/* Status Legend Grid */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs pt-2">
            {data.statusDistribution.map((s, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-[3px] shrink-0"
                  style={{
                    backgroundColor: s.color,
                    border: s.color === '#D6CFF7' ? '1px solid #A99BFA' : undefined
                  }}
                />
                <span className="flex-1 text-[#3A3647] font-semibold truncate">{s.label}</span>
                <span className="font-extrabold text-[#16131F]">{s.pct} %</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Bottom Grid: Zones de Vente, Top Produits, Livraisons Calendrier */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Ventes par zone */}
        <section className="bg-white rounded-3xl p-6 flex flex-col gap-4 shadow-kolix">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#6C4CF1]" />
            <h2 className="text-lg font-extrabold text-[#241D5E]">Ventes par zone</h2>
          </div>
          <div className="flex flex-col gap-3.5 mt-1">
            {data.zones.map((zone, i) => (
              <div key={i} className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-bold text-[#16131F]">
                  <span className="truncate pr-2">{zone.name}</span>
                  <span className="font-extrabold">{zone.formattedPercentage}</span>
                </div>
                <div className="h-2 bg-[#F0EDFB] rounded-full overflow-hidden">
                  <div
                    className={cn('h-full rounded-full transition-all duration-500', i === 0 ? 'bg-[#241D5E]' : 'bg-[#8B6CF6]')}
                    style={{ width: `${zone.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Top Produits */}
        <section className="bg-white rounded-3xl p-6 flex flex-col gap-3 shadow-kolix">
          <div className="flex justify-between items-baseline mb-1">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-[#6C4CF1]" />
              <h2 className="text-lg font-extrabold text-[#241D5E]">Top produits</h2>
            </div>
            <span className="text-xs text-[#5E5A70] font-semibold">Ventes livrées</span>
          </div>
          <div className="flex flex-col divide-y divide-[#F0EDFB]">
            {data.topProducts.map((p) => (
              <div key={p.rank} className="flex items-center gap-3 py-2.5">
                <span className="w-7 h-7 rounded-lg bg-[#F4F1FE] text-[#4B2FC9] text-xs font-extrabold flex items-center justify-center shrink-0">
                  {p.rank}
                </span>
                <div className="flex-1 min-w-0 flex flex-col">
                  <span className="text-sm font-bold text-[#16131F] truncate">{p.name}</span>
                  <span className="text-xs text-[#5E5A70]">{p.caFormatted}</span>
                </div>
                <span className="text-sm font-extrabold text-[#241D5E]">{p.salesCount}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Livraisons Calendar (Octobre 2026) */}
        <section className="bg-white rounded-3xl p-6 flex flex-col gap-3 shadow-kolix">
          <div className="flex justify-between items-baseline">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-[#6C4CF1]" />
              <h2 className="text-lg font-extrabold text-[#241D5E]">Livraisons</h2>
            </div>
            <span className="text-xs font-bold text-[#5E5A70]">Octobre 2026</span>
          </div>

          {/* Weekdays */}
          <div className="grid grid-cols-7 text-center gap-1 text-[11px] font-bold text-[#5E5A70] pt-1">
            <span>L</span><span>M</span><span>M</span><span>J</span><span>V</span><span>S</span><span>D</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {data.calendarDays.map((d, i) => {
              if (d.dayNumber === null) {
                return <span key={i} className="py-2" />;
              }

              return (
                <span
                  key={i}
                  className={cn(
                    'py-1.5 rounded-lg font-semibold text-xs transition-colors',
                    d.isToday && 'bg-[#241D5E] text-white font-extrabold shadow-sm',
                    d.hasPostponed && !d.isToday && 'bg-[#E9E3FD] text-[#3F25A8] font-bold ring-1 ring-[#A99BFA]/70',
                    !d.isToday && !d.hasPostponed && (d.isPast ? 'text-[#8B869C]' : 'text-[#16131F]')
                  )}
                >
                  {d.dayNumber}
                </span>
              );
            })}
          </div>

          {/* Calendar Legend */}
          <div className="flex flex-wrap gap-4 text-xs font-semibold text-[#3A3647] pt-2 border-t border-[#F0EDFB]">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-[#241D5E]" />
              Aujourd’hui
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-[#E9E3FD] border border-[#A99BFA]" />
              Livraisons reportées
            </span>
          </div>
        </section>
      </div>
    </div>
  );
};
