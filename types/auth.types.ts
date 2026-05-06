// ─── Domain Models ───────────────────────────────────────────────────────────

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  image?: string;
  [key: string]: any;
}

// ─── API Payloads ─────────────────────────────────────────────────────────────

export interface CheckPhonePayload {
  phone_number: string;
}

export interface LoginWithPasswordPayload {
  phone_number: string;
  password: string;
}

export interface SetupPasswordPayload {
  phone_number: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface RegisterPayload {
  full_name_ar: string;
  email: string;
  phone_number: string;
  password: string;
  password_confirmation: string;
  employment_type: string;
}

export interface VerifyOtpPayload {
  phone_number: string;
  otp_code: string;
}

export interface SendOtpResetPasswordPayload {
  phone_number: string;
}

export interface VerifyOtpResetPasswordPayload {
  phone_number: string;
  otp_code: string;
}

export interface ResetPasswordPayload {
  phone_number: string;
  password: string;
  password_confirmation: string;
}

// ─── API Response Shapes ──────────────────────────────────────────────────────

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status?: number;
}

export interface CheckPhoneData {
  has_password?: boolean;
  needs_password_setup?: boolean;
  phone_number?: string;
  userData?: User;
  token?: string;
}

export interface AuthData {
  userData?: User;
  token?: string;
  needs_password_setup?: boolean;
  phone_number?: string;
}

// ─── Redux State ──────────────────────────────────────────────────────────────

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
}

// ─── Form Errors (validation) ─────────────────────────────────────────────────

export interface LoginFormErrors {
  phone?: string;
}

export interface RegisterFormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
}

export interface OtpFormErrors {
  otp?: string;
}

export interface PasswordLoginFormErrors {
  password?: string;
}

export interface SetupPasswordFormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export interface ResetPasswordFormErrors {
  password?: string;
  confirmPassword?: string;
}
