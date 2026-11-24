import { apiClient } from './client';
import { API_ENDPOINTS } from './endpoints';
import { DashboardAnalytics } from '../types/analytics';
import { PeriodType } from '../types/common';
import { MOCK_DASHBOARD_DATA } from './mockData';

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
    const fallback = MOCK_DASHBOARD_DATA[period] || MOCK_DASHBOARD_DATA.mois;
    try {
      const res = await apiClient.get<any>(API_ENDPOINTS.ANALYTICS.DASHBOARD(period));
      const serverData = res?.data || res;
      if (serverData && typeof serverData === 'object') {
        const kpis = (Array.isArray(serverData.kpis) && serverData.kpis.length > 0)
          ? serverData.kpis
          : fallback.kpis;
        return {
          period: serverData.period || period,
          periodLabel: serverData.periodLabel || fallback.periodLabel,
          kpis,
          chartData: (Array.isArray(serverData.chartData) && serverData.chartData.length > 0)
            ? serverData.chartData
            : fallback.chartData,
          conversionRate: serverData.conversionRate || fallback.conversionRate,
          statusDistribution: (Array.isArray(serverData.status_distribution) && serverData.status_distribution.length > 0)
            ? serverData.status_distribution
            : ((Array.isArray(serverData.statusDistribution) && serverData.statusDistribution.length > 0)
              ? serverData.statusDistribution
              : fallback.statusDistribution),
          zones: (Array.isArray(serverData.zones) && serverData.zones.length > 0)
            ? serverData.zones
            : fallback.zones,
          topProducts: (Array.isArray(serverData.topProducts) && serverData.topProducts.length > 0)
            ? serverData.topProducts
            : fallback.topProducts,
          calendarDays: (Array.isArray(serverData.calendarDays) && serverData.calendarDays.length > 0)
            ? serverData.calendarDays
            : fallback.calendarDays,
          calendarMonth: serverData.calendarMonth || serverData.calendar_month || fallback.calendarMonth
        };
      }
      return fallback;
    } catch {
      return fallback;
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
