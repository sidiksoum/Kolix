import { apiClient } from './client';
import { API_ENDPOINTS } from './endpoints';

export interface AffiliateReferralItem {
  id: string;
  referred_shop_name: string;
  referred_user_name: string;
  source: string;
  plan: string;
  status: string;
  months_count: number;
  total_months: number;
  earned_total: number;
  monthly_commission: number;
}

export interface MonthlyGainItem {
  month: string;
  amount: number;
}

export interface AffiliateSummaryData {
  affiliate_code: string;
  affiliate_slug: string;
  affiliate_link: string;
  available_balance: number;
  total_earned: number;
  is_locked: boolean;
  lock_reason?: string;
  monthly_gains: MonthlyGainItem[];
  referrals: AffiliateReferralItem[];
}

export interface SubscribeWithCommissionDto {
  plan_name: string;
  duration_months: number;
}

export const affiliatesApi = {
  async getSummary(): Promise<AffiliateSummaryData | null> {
    try {
      const res = await apiClient.get<any>(API_ENDPOINTS.AFFILIATES.SUMMARY);
      return res?.data || res;
    } catch (err) {
      console.warn('Error fetching affiliate summary:', err);
      return null;
    }
  },

  async transferCommissions(amount: number): Promise<string> {
    const res = await apiClient.post<any>(API_ENDPOINTS.AFFILIATES.TRANSFER, { amount });
    return res?.message || 'Transfert effectué avec succès';
  },

  async subscribeWithCommissions(dto: SubscribeWithCommissionDto): Promise<{ message: string; data?: any }> {
    const res = await apiClient.post<any>(API_ENDPOINTS.AFFILIATES.SUBSCRIBE, dto);
    return {
      message: res?.message || 'Abonnement activé avec succès',
      data: res?.data
    };
  }
};
