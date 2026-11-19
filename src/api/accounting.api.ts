import { apiClient } from './client';
import { API_ENDPOINTS } from './endpoints';

export interface AccountingTransaction {
  id: string;
  date: string;
  label: string;
  type: 'Vente' | 'Charge';
  cat: string;
  mode: string;
  amount: number;
}

export interface AccountingDashboard {
  period: string;
  total_revenue: number;
  total_charges: number;
  net_profit: number;
  margin_percentage: number;
  momo_revenue: number;
  cash_revenue: number;
  momo_percentage: number;
  cash_percentage: number;
  charges_by_category: Record<string, number>;
  monthly_history: Array<{
    label: string;
    ca: number;
    ch: number;
    profit: string;
  }>;
  recent_transactions: AccountingTransaction[];
}

export interface ChargeCreateDto {
  date?: string;
  label: string;
  category: string;
  payment_mode?: string;
  amount: number;
}

export interface ChargeDto {
  id: string;
  date: string;
  label: string;
  category: string;
  payment_mode: string;
  amount: number;
}

export const accountingApi = {
  async getDashboard(month?: string): Promise<AccountingDashboard> {
    const res = await apiClient.get<any>(API_ENDPOINTS.ACCOUNTING.DASHBOARD(month));
    return res?.data || res;
  },

  async getCharges(): Promise<ChargeDto[]> {
    const res = await apiClient.get<any>(API_ENDPOINTS.ACCOUNTING.CHARGES);
    return res?.data || res;
  },

  async addCharge(data: ChargeCreateDto): Promise<ChargeDto> {
    const res = await apiClient.post<any>(API_ENDPOINTS.ACCOUNTING.CHARGES, data);
    return res?.data || res;
  },

  async deleteCharge(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.ACCOUNTING.DELETE_CHARGE(id));
  }
};

