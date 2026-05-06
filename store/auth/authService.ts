import { api } from '@/services/api';
import { API_ENDPOINTS } from '@/constants/endpoints';
import type { RegisterPayload, SetupPasswordPayload, User } from '@/types/auth.types';

export type CheckPhoneResult = {
  has_password: boolean;
  needs_password_setup?: boolean;
  phone_number: string;
};

export type AuthResult = { token: string; user: User };

export const authService = {
  async checkPhone(phone_number: string): Promise<CheckPhoneResult> {
    const { data } = await api.post(API_ENDPOINTS.AUTH.CHECK_PHONE, { phone_number });
    return data.data ?? data;
  },

  async loginWithPassword(phone_number: string, password: string): Promise<AuthResult> {
    const { data } = await api.post(API_ENDPOINTS.AUTH.LOGIN_PASSWORD, { phone_number, password });
    const payload = data.data ?? data;
    return { token: payload.token, user: payload };
  },

  async verifyOtp(phone_number: string, otp_code: string): Promise<AuthResult> {
    const { data } = await api.post(API_ENDPOINTS.AUTH.VERIFY_OTP, { phone_number, otp_code });
    const payload = data.data ?? data;
    return { token: payload.token, user: payload.userData ?? payload };
  },

  async setupPassword(payload: SetupPasswordPayload): Promise<AuthResult> {
    const { data } = await api.post(API_ENDPOINTS.AUTH.SETUP_PASSWORD, payload);
    const result = data.data ?? data;
    return { token: result.token, user: result.userData ?? result };
  },

  async register(payload: RegisterPayload): Promise<void> {
    await api.post(API_ENDPOINTS.AUTH.REGISTER, payload);
  },

  async sendOtpResetPassword(phone_number: string): Promise<void> {
    await api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { phone_number });
  },

  async verifyOtpResetPassword(phone_number: string, otp_code: string): Promise<void> {
    await api.post(API_ENDPOINTS.AUTH.VERIFY_FORGOT_PASSWORD, { phone_number, otp_code });
  },

  async resetPassword(
    phone_number: string,
    password: string,
    password_confirmation: string,
  ): Promise<void> {
    await api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
      phone_number,
      password,
      password_confirmation,
    });
  },

  async getProfile(): Promise<User> {
    const { data } = await api.get(API_ENDPOINTS.AUTH.PROFILE);
    return data.data ?? data;
  },

  async logout(): Promise<void> {
    try {
      await api.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch {
      // best-effort — always clear locally
    }
  },
};
