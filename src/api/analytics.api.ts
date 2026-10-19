import { apiClient } from './client';
import { API_ENDPOINTS } from './endpoints';
import { DashboardAnalytics } from '../types/analytics';
import { PeriodType } from '../types/common';
import { MOCK_DASHBOARD_DATA } from './mockData';

export const analyticsApi = {
  async getDashboard(period: PeriodType = 'mois'): Promise<DashboardAnalytics> {
    try {
      const res = await apiClient.get<{ data: DashboardAnalytics }>(API_ENDPOINTS.ANALYTICS.DASHBOARD(period));
      return res.data;
    } catch {
      return MOCK_DASHBOARD_DATA[period] || MOCK_DASHBOARD_DATA.mois;
    }
  }
};
