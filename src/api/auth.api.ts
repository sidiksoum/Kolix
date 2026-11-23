import { apiClient } from './client';
import { API_ENDPOINTS } from './endpoints';

export interface LoginDto {
  identifier: string;
  password: string;
}

export interface RegisterStep1Dto {
  name: string;
  email: string;
  dial?: string;
  phone: string;
  password: string;
  activity?: string;
  country?: string;
  source?: string;
  promo_code?: string;
}

export interface VerifyOtpDto {
  phone?: string;
  email?: string;
  identifier?: string;
  otp_code: string;
}

export interface RegisterStep1Response {
  user_id: string;
  email?: string;
  phone: string;
  message: string;
  otp_debug?: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user_id: string;
  email: string;
  name: string;
  role: string;
  permissions?: string[];
  shop_id?: string;
  shop_domain?: string;
}

export interface StandardApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export const authApi = {
  async login(dto: LoginDto): Promise<AuthTokens> {
    const res = await apiClient.post<StandardApiResponse<AuthTokens>>(API_ENDPOINTS.AUTH.LOGIN, dto);
    if (res.data?.access_token) {
      apiClient.setToken(res.data.access_token);
      localStorage.setItem('kolix_user', JSON.stringify(res.data));
    }
    return res.data;
  },

  async registerStep1(dto: RegisterStep1Dto): Promise<RegisterStep1Response> {
    const res = await apiClient.post<StandardApiResponse<RegisterStep1Response>>(
      '/api/v1/auth/register/step1',
      dto
    );
    return res.data;
  },

  async verifyOtp(dto: VerifyOtpDto): Promise<AuthTokens> {
    const res = await apiClient.post<StandardApiResponse<AuthTokens>>(
      '/api/v1/auth/register/verify-otp',
      dto
    );
    if (res.data?.access_token) {
      apiClient.setToken(res.data.access_token);
      localStorage.setItem('kolix_user', JSON.stringify(res.data));
    }
    return res.data;
  },

  async getMe(): Promise<any> {
    const res = await apiClient.get<StandardApiResponse<any>>(API_ENDPOINTS.AUTH.ME);
    return res.data;
  },

  async requestPasswordReset(email: string): Promise<{ email: string; otp_debug?: string }> {
    const res = await apiClient.post<StandardApiResponse<{ email: string; otp_debug?: string }>>(
      API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
      { email }
    );
    return res.data;
  },

  async verifyResetOtp(email: string, otp_code: string): Promise<{ verified: boolean; email: string }> {
    const res = await apiClient.post<StandardApiResponse<{ verified: boolean; email: string }>>(
      API_ENDPOINTS.AUTH.VERIFY_RESET_OTP,
      { email, otp_code }
    );
    return res.data;
  },

  async resetPassword(email: string, otp_code: string, new_password: string): Promise<{ success: boolean }> {
    const res = await apiClient.post<StandardApiResponse<{ success: boolean }>>(
      API_ENDPOINTS.AUTH.RESET_PASSWORD,
      { email, otp_code, new_password }
    );
    return res.data;
  },

  logout() {
    apiClient.setToken(null);
    localStorage.removeItem('kolix_user');
  }
};

