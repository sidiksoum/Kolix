// src/features/admin/components/OverviewSection.tsx
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { AdminSection } from '../types';

interface OverviewSectionProps {
  onNavigate: (section: AdminSection, filter?: string) => void;
  pendingWithdrawalsCount: number;
  unpaidCount: number;
  trialEndingCount: number;
  suspendedCount: number;
}

export const OverviewSection: React.FC<OverviewSectionProps> = ({
  onNavigate,
  pendingWithdrawalsCount,
  unpaidCount,
  trialEndingCount,
  suspendedCount,
}) => {
  const kpis = [
    {
      hero: true,
      label: 'Revenu mensuel récurrent',
      value: '5 480 000 FCFA',
      note: 'Abonnements actifs',
    },
    {
      hero: false,
      label: 'Marchands inscrits',
      value: '1 248',
      note: 'Depuis le lancement',
    },
    {
      hero: false,
      label: 'Abonnés payants',
      value: '612',
      note: '49 % des inscrits',
    },
    {
      hero: false,
      label: 'En essai gratuit',
      value: '184',
      note: 'Fin d’essai sous 7 jours',
    },
    {
      hero: false,
      label: 'Inscriptions (30 j)',
      value: '236',
      note: '↗ +14 % vs mois précédent',
    },
    {
      hero: false,
      label: 'Essai → payant',
      value: '41 %',
      note: 'Sur les 90 derniers jours',
    },
  ];

  const signupsData = [
    { label: 'Juin', n: 98 },
    { label: 'Juil.', n: 132 },
    { label: 'Août', n: 161 },
    { label: 'Sept.', n: 188 },
    { label: 'Oct.', n: 207 },
    { label: 'Nov.', n: 236 },
  ];

  const planSplit = [
    { name: 'Kolix Start', count: 268, mrr: '1 340 000 FCFA', pct: 100, color: '#6C4CF1' },
    { name: 'Kolix Grow', count: 214, mrr: '2 140 000 FCFA', pct: 80, color: '#6C4CF1' },
    { name: 'Kolix Pro', count: 118, mrr: '1 770 000 FCFA', pct: 44, color: '#241D5E' },
    { name: 'Kolix Empire', count: 12, mrr: '720 000 FCFA', pct: 5, color: '#F5C800' },
  ];

  const todoItems = [
    {
      count: pendingWithdrawalsCount,
      label: 'retraits en attente de validation',
      section: 'withdraw' as AdminSection,
      bg: '#FFF6CC',
      fg: '#4D3B00',
    },
    {
      count: unpaidCount,
      label: 'abonnement impayé à relancer',
      section: 'merchants' as AdminSection,
      filter: 'Impayé',
      bg: '#FFF0D6',
      fg: '#6B4100',
    },
    {
      count: trialEndingCount,
      label: 'essais qui se terminent cette semaine',
      section: 'merchants' as AdminSection,
      filter: 'Essai',
      bg: '#E8EEFB',
      fg: '#1F3F8A',
    },
    {
      count: suspendedCount,
      label: 'compte suspendu à réexaminer',
      section: 'merchants' as AdminSection,
      filter: 'Suspendu',
      bg: '#FCE3E0',
      fg: '#8A2414',
    },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#16131F] tracking-tight">Vue d’ensemble</h1>
        <p className="text-sm text-[#5E5A70] mt-1 font-medium">
          L’état de la plateforme Kolix, toutes boutiques confondues.
        </p>
      </div>

      {/* 6 KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            className={`rounded-[18px] p-5 flex flex-col justify-between gap-2.5 transition-all ${
              kpi.hero
                ? 'bg-[#6C4CF1] text-white shadow-lg shadow-[#6C4CF1]/20'
                : 'bg-white text-[#16131F] shadow-sm border border-[#EEEAFB]'
            }`}
          >
            <span
              className={`text-xs font-semibold ${
                kpi.hero ? 'text-[#EDE8FF]' : 'text-[#5E5A70]'
              }`}
            >
              {kpi.label}
            </span>
            <span className="text-2xl font-bold tracking-tight whitespace-nowrap">
              {kpi.value}
            </span>
            <span
              className={`text-[11px] font-medium ${
                kpi.hero ? 'text-[#EDE8FF]' : 'text-[#5E5A70]'
              }`}
            >
              {kpi.note}
            </span>
          </div>
        ))}
      </div>

      {/* Middle Row: Signups Chart & Plan Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
        {/* Signups Chart (2 cols) */}
        <section className="lg:col-span-2 bg-white rounded-[18px] p-6 shadow-sm border border-[#EEEAFB] flex flex-col justify-between gap-4">
          <h2 className="text-base font-bold text-[#16131F]">
            Nouvelles inscriptions · 6 derniers mois
          </h2>

          <div className="grid grid-cols-6 gap-3 sm:gap-4 h-48 items-end border-b border-[#E2DCF8] pb-3">
            {signupsData.map((item, idx) => {
              const heightPx = Math.round((item.n / 236) * 150);
              const isLatest = idx === signupsData.length - 1;
              return (
                <div key={item.label} className="flex flex-col items-center justify-end h-full gap-2 group">
                  <span className="text-xs font-bold text-[#16131F] group-hover:text-[#6C4CF1] transition-colors">
                    {item.n}
                  </span>
                  <div
                    style={{ height: `${heightPx}px` }}
                    className={`w-full max-w-[46px] rounded-t-lg transition-all duration-300 ${
                      isLatest
                        ? 'bg-[#6C4CF1] shadow-md shadow-[#6C4CF1]/20'
                        : 'bg-[#B9AAFF] hover:bg-[#9E8BF8]'
                    }`}
                  />
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-6 gap-3 sm:gap-4 text-center">
            {signupsData.map((item) => (
              <span key={item.label} className="text-xs font-semibold text-[#5E5A70]">
                {item.label}
              </span>
            ))}
          </div>
        </section>

        {/* Plan Split (1 col) */}
        <section className="bg-white rounded-[18px] p-6 shadow-sm border border-[#EEEAFB] flex flex-col justify-between gap-4">
          <h2 className="text-base font-bold text-[#16131F]">Abonnés payants par plan</h2>

          <div className="flex flex-col gap-4">
            {planSplit.map((p) => (
              <div key={p.name} className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold text-[#16131F]">{p.name}</span>
                  <span className="text-xs text-[#5E5A70]">
                    <strong className="text-[#16131F]">{p.count}</strong> · {p.mrr}
                  </span>
                </div>
                <div className="h-2 bg-[#F0EDFB] rounded-full overflow-hidden">
                  <div
                    style={{ width: `${p.pct}%`, backgroundColor: p.color }}
                    className="h-full rounded-full transition-all duration-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Bottom Section: To Do */}
      <section className="bg-white rounded-[18px] p-6 shadow-sm border border-[#EEEAFB] flex flex-col gap-2">
        <h2 className="text-base font-bold text-[#16131F] mb-1">À traiter</h2>
        <div className="divide-y divide-[#F0EDFB]">
          {todoItems.map((item, idx) => (
            <button
              key={idx}
              onClick={() => onNavigate(item.section, item.filter)}
              className="w-full flex items-center gap-3.5 py-3 hover:bg-gray-50/70 rounded-xl px-2 transition-colors cursor-pointer text-left text-sm"
            >
              <span
                style={{ backgroundColor: item.bg, color: item.fg }}
                className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0"
              >
                {item.count}
              </span>
              <span className="flex-1 font-medium text-[#16131F]">{item.label}</span>
              <span className="text-xs font-bold text-[#5E5A70] flex items-center gap-1">
                Ouvrir <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

