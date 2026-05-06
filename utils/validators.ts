import type {
  LoginFormErrors,
  RegisterFormErrors,
  OtpFormErrors,
  PasswordLoginFormErrors,
  SetupPasswordFormErrors,
  ResetPasswordFormErrors,
} from '@/types/auth.types';

// ─── Rules ───────────────────────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\d{7,15}$/;

// ─── Individual Validators ───────────────────────────────────────────────────

export function validatePhone(value: string): string | undefined {
  const digits = value.replace(/\D/g, '');
  if (!digits) return 'رقم الهاتف مطلوب';
  if (!PHONE_RE.test(digits)) return 'رقم الهاتف غير صحيح';
}

export function validateEmail(value: string): string | undefined {
  if (!value.trim()) return 'البريد الإلكتروني مطلوب';
  if (!EMAIL_RE.test(value.trim())) return 'صيغة البريد الإلكتروني غير صحيحة';
}

export function validateFullName(value: string): string | undefined {
  if (!value.trim()) return 'الاسم الكامل مطلوب';
  if (value.trim().length < 2) return 'الاسم يجب أن يكون حرفين على الأقل';
}

export function validatePassword(value: string): string | undefined {
  if (!value) return 'كلمة المرور مطلوبة';
  if (value.length < 8) return 'كلمة المرور يجب أن تكون ٨ أحرف على الأقل';
  if (!/\d/.test(value)) return 'كلمة المرور يجب أن تحتوي على رقم واحد على الأقل';
}

export function validateConfirmPassword(
  password: string,
  confirm: string
): string | undefined {
  if (!confirm) return 'تأكيد كلمة المرور مطلوب';
  if (password !== confirm) return 'كلمتا المرور غير متطابقتين';
}

export function validateOtp(value: string): string | undefined {
  if (!value.trim()) return 'رمز التحقق مطلوب';
  if (!/^\d{4,6}$/.test(value.trim())) return 'رمز التحقق غير صحيح';
}

// ─── Form Validators ─────────────────────────────────────────────────────────

export function validateLoginForm(phone: string): LoginFormErrors {
  const errors: LoginFormErrors = {};
  const phoneErr = validatePhone(phone);
  if (phoneErr) errors.phone = phoneErr;
  return errors;
}

export function validateRegisterForm(
  fullName: string,
  email: string,
  phone: string,
  password: string,
  confirmPassword: string
): RegisterFormErrors {
  const errors: RegisterFormErrors = {};
  const nameErr = validateFullName(fullName);
  if (nameErr) errors.fullName = nameErr;
  const emailErr = validateEmail(email);
  if (emailErr) errors.email = emailErr;
  const phoneErr = validatePhone(phone);
  if (phoneErr) errors.phone = phoneErr;
  const passErr = validatePassword(password);
  if (passErr) errors.password = passErr;
  const confirmErr = validateConfirmPassword(password, confirmPassword);
  if (confirmErr) errors.confirmPassword = confirmErr;
  return errors;
}

export function validateOtpForm(otp: string): OtpFormErrors {
  const errors: OtpFormErrors = {};
  const otpErr = validateOtp(otp);
  if (otpErr) errors.otp = otpErr;
  return errors;
}

export function validatePasswordLoginForm(password: string): PasswordLoginFormErrors {
  const errors: PasswordLoginFormErrors = {};
  if (!password) errors.password = 'كلمة المرور مطلوبة';
  return errors;
}

export function validateSetupPasswordForm(
  email: string,
  password: string,
  confirmPassword: string
): SetupPasswordFormErrors {
  const errors: SetupPasswordFormErrors = {};
  const emailErr = validateEmail(email);
  if (emailErr) errors.email = emailErr;
  const passErr = validatePassword(password);
  if (passErr) errors.password = passErr;
  const confirmErr = validateConfirmPassword(password, confirmPassword);
  if (confirmErr) errors.confirmPassword = confirmErr;
  return errors;
}

export function validateResetPasswordForm(
  password: string,
  confirmPassword: string
): ResetPasswordFormErrors {
  const errors: ResetPasswordFormErrors = {};
  const passErr = validatePassword(password);
  if (passErr) errors.password = passErr;
  const confirmErr = validateConfirmPassword(password, confirmPassword);
  if (confirmErr) errors.confirmPassword = confirmErr;
  return errors;
}

export function hasErrors(errors: object): boolean {
  return Object.values(errors).some(Boolean);
}
