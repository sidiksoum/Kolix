import { apiClient } from './client';
import { API_ENDPOINTS } from './endpoints';
import { DashboardAnalytics } from '../types/analytics';
import { PeriodType } from '../types/common';

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
    try {
      const res = await apiClient.get<any>(API_ENDPOINTS.ANALYTICS.DASHBOARD(period));
      const serverData = res?.data || res;
      if (serverData && typeof serverData === 'object') {
        return {
          period: serverData.period || period,
          periodLabel: serverData.periodLabel || 'Ce mois-ci',
          kpis: Array.isArray(serverData.kpis) ? serverData.kpis : [],
          chartData: Array.isArray(serverData.chartData) ? serverData.chartData : [],
          conversionRate: serverData.conversionRate || '0 %',
          statusDistribution: Array.isArray(serverData.status_distribution)
            ? serverData.status_distribution
            : (Array.isArray(serverData.statusDistribution) ? serverData.statusDistribution : []),
          zones: Array.isArray(serverData.zones) ? serverData.zones : [],
          topProducts: Array.isArray(serverData.topProducts) ? serverData.topProducts : [],
          calendarDays: Array.isArray(serverData.calendarDays) ? serverData.calendarDays : [],
          calendarMonth: serverData.calendarMonth || serverData.calendar_month || 'Novembre 2026'
        };
      }
      return {
        period,
        periodLabel: 'Période',
        kpis: [],
        chartData: [],
        conversionRate: '0 %',
        statusDistribution: [],
        zones: [],
        topProducts: [],
        calendarDays: [],
        calendarMonth: 'Novembre 2026'
      };
    } catch {
      return {
        period,
        periodLabel: 'Période',
        kpis: [],
        chartData: [],
        conversionRate: '0 %',
        statusDistribution: [],
        zones: [],
        topProducts: [],
        calendarDays: [],
        calendarMonth: 'Novembre 2026'
      };
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
