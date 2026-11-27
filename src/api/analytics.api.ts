import { apiClient } from './client';
import { API_ENDPOINTS } from './endpoints';
import { DashboardAnalytics, DashboardKpiItem } from '../types/analytics';
import { PeriodType } from '../types/common';

const EMPTY_KPIS: DashboardKpiItem[] = [
  { id: 'ca', label: 'Chiffre d’affaires (FCFA)', value: '0', rawValue: 0, trend: '+0 %', isPositive: true, iconName: 'DollarSign', iconBg: '#E9E3FD', iconFg: '#4B2FC9' },
  { id: 'visites', label: 'Visites boutique', value: '0', rawValue: 0, trend: '+0 %', isPositive: true, iconName: 'Eye', iconBg: '#E3EEFF', iconFg: '#1F4FA8' },
  { id: 'commandes', label: 'Commandes reçues', value: '0', rawValue: 0, trend: '+0 %', isPositive: true, iconName: 'ShoppingBag', iconBg: '#FFEBDD', iconFg: '#8A3D0A' },
  { id: 'ventes', label: 'Ventes effectives', value: '0', rawValue: 0, trend: '+0 %', isPositive: true, iconName: 'CheckCircle2', iconBg: '#E9E3FD', iconFg: '#4B2FC9' },
  { id: 'conversion', label: 'Taux de conversion', value: '0 %', rawValue: 0, trend: '+0 pt', isPositive: true, iconName: 'TrendingUp', iconBg: '#E3EEFF', iconFg: '#1F4FA8' },
];

const getEmptyDashboard = (period: PeriodType): DashboardAnalytics => ({
  period,
  periodLabel: period === 'jour' ? "Aujourd'hui" : period === 'semaine' ? 'Cette semaine' : 'Ce mois-ci',
  kpis: EMPTY_KPIS,
  chartData: [],
  conversionRate: '0 %',
  statusDistribution: [],
  zones: [],
  topProducts: [],
  calendarDays: [],
  calendarMonth: new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
});

function normalizeKpi(k: any, idx: number): DashboardKpiItem {
  const defaultStyles = [
    { name: 'DollarSign', bg: '#E9E3FD', fg: '#4B2FC9' },
    { name: 'Eye', bg: '#E3EEFF', fg: '#1F4FA8' },
    { name: 'ShoppingBag', bg: '#FFEBDD', fg: '#8A3D0A' },
    { name: 'CheckCircle2', bg: '#E9E3FD', fg: '#4B2FC9' },
    { name: 'TrendingUp', bg: '#E3EEFF', fg: '#1F4FA8' },
  ];
  const fallbackStyle = defaultStyles[idx % defaultStyles.length];

  return {
    id: String(k.id || `kpi-${idx}`),
    label: String(k.label || ''),
    value: String(k.value ?? '0'),
    rawValue: Number(k.rawValue ?? k.raw_value ?? 0),
    trend: String(k.trend ?? k.change ?? '+0 %'),
    isPositive: Boolean(k.isPositive ?? k.is_positive ?? true),
    iconName: String(k.iconName || k.icon || fallbackStyle.name),
    iconBg: String(k.iconBg || fallbackStyle.bg),
    iconFg: String(k.iconFg || fallbackStyle.fg),
  };
}

export interface FunnelStep {
  label: string;
  value: string;
  raw: number;
  step: string;
}

export interface StatusItem {
  name: string;
  rateLabel: string;
  count: string;
  rawCount: number;
  pct: string;
  pctRaw: number;
  color: string;
}

export interface TimeBarItem {
  label: string;
  n: number;
  heightPercent: number;
}

export interface ProductReportItem {
  name: string;
  units: number;
  ca: string;
  caRaw: number;
  sharePercent: number;
  rate: string;
  rateRaw: number;
}

export interface ZoneReportItem {
  name: string;
  orders: number;
  done: number;
  ca: string;
  rate: string;
  rateRaw: number;
}

export interface AnalyticsReportData {
  period: string;
  grain: string;
  globalConversion: string;
  cartAbandonment: string;
  funnel: FunnelStep[];
  statuses: StatusItem[];
  timeBars: TimeBarItem[];
  products: ProductReportItem[];
  zones: ZoneReportItem[];
  insights: {
    title: string;
    description: string;
    tip: string;
  };
}

export const analyticsApi = {
  async getDashboard(period: PeriodType = 'mois'): Promise<DashboardAnalytics> {
    const emptyFallback = getEmptyDashboard(period);
    try {
      const res = await apiClient.get<any>(API_ENDPOINTS.ANALYTICS.DASHBOARD(period));
      const serverData = res?.data || res;
      if (serverData && typeof serverData === 'object') {
        const rawKpis = Array.isArray(serverData.kpis) && serverData.kpis.length > 0
          ? serverData.kpis
          : emptyFallback.kpis;
        const kpis = rawKpis.map(normalizeKpi);

        const rawConv = serverData.conversionRate ?? serverData.conversion_rate;
        const conversionRate = typeof rawConv === 'string'
          ? rawConv
          : (rawConv && typeof rawConv === 'object' && rawConv.global)
            ? String(rawConv.global)
            : '0 %';

        return {
          period: serverData.period || period,
          periodLabel: serverData.periodLabel || emptyFallback.periodLabel,
          kpis,
          chartData: Array.isArray(serverData.chartData) ? serverData.chartData : [],
          conversionRate,
          statusDistribution: Array.isArray(serverData.status_distribution) 
            ? serverData.status_distribution 
            : (Array.isArray(serverData.statusDistribution) ? serverData.statusDistribution : []),
          zones: Array.isArray(serverData.zones) ? serverData.zones : [],
          topProducts: Array.isArray(serverData.topProducts) ? serverData.topProducts : [],
          calendarDays: Array.isArray(serverData.calendarDays) ? serverData.calendarDays : [],
          calendarMonth: serverData.calendarMonth || serverData.calendar_month || emptyFallback.calendarMonth
        };
      }
      return emptyFallback;
    } catch {
      return emptyFallback;
    }
  },

  async getReports(period: string = '30', grain: string = 'semaine'): Promise<AnalyticsReportData | null> {
    try {
      const res = await apiClient.get<any>(API_ENDPOINTS.ANALYTICS.REPORTS(period, grain));
      const data = res?.data || res;
      if (data && typeof data === 'object' && Array.isArray(data.funnel)) {
        return data as AnalyticsReportData;
      }
      return null;
    } catch (err) {
      console.warn('Analytics reports fetch error:', err);
      return null;
    }
  }
};
