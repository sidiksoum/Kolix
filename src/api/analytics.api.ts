import { apiClient } from './client';
import { API_ENDPOINTS } from './endpoints';
import { DashboardAnalytics } from '../types/analytics';
import { PeriodType } from '../types/common';
import { MOCK_DASHBOARD_DATA } from './mockData';

export const analyticsApi = {
  async getDashboard(period: PeriodType = 'mois'): Promise<DashboardAnalytics> {
    const fallback = MOCK_DASHBOARD_DATA[period] || MOCK_DASHBOARD_DATA.mois;
    try {
      const res = await apiClient.get<any>(API_ENDPOINTS.ANALYTICS.DASHBOARD(period));
      const serverData = res?.data || res;
      if (serverData && typeof serverData === 'object') {
        return {
          ...fallback,
          ...serverData,
          chartData: (Array.isArray(serverData.chartData) && serverData.chartData.length > 0)
            ? serverData.chartData
            : fallback.chartData,
          kpis: (Array.isArray(serverData.kpis) && serverData.kpis.length > 0)
            ? serverData.kpis
            : fallback.kpis,
          statusDistribution: (Array.isArray(serverData.status_distribution) && serverData.status_distribution.length > 0)
            ? serverData.status_distribution
            : (Array.isArray(serverData.statusDistribution) ? serverData.statusDistribution : fallback.statusDistribution),
          zones: (Array.isArray(serverData.zones) && serverData.zones.length > 0)
            ? serverData.zones
            : fallback.zones,
          topProducts: (Array.isArray(serverData.topProducts) && serverData.topProducts.length > 0)
            ? serverData.topProducts
            : fallback.topProducts,
          calendarDays: (Array.isArray(serverData.calendarDays) && serverData.calendarDays.length > 0)
            ? serverData.calendarDays
            : fallback.calendarDays
        };
      }
      return fallback;
    } catch {
      return fallback;
    }
  }
};
