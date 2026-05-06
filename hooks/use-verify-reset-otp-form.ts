import type { OtpFormErrors } from '@/types/auth.types';
import { hasErrors, validateOtpForm } from '@/utils/validators';
import { useCallback, useState } from 'react';
import { useAuth } from './use-auth';

export interface UseVerifyResetOtpFormReturn {
  otp: string;
  errors: OtpFormErrors;
  touched: boolean;
  isLoading: boolean;
  error: string | null;
  handleOtpChange: (text: string) => void;
  handleSubmit: () => Promise<unknown>;
  clearError: () => void;
}

export function useVerifyResetOtpForm(phone_number: string): UseVerifyResetOtpFormReturn {
  const { verifyOtpResetPassword, isLoading, error, clearError } = useAuth();

  const [otp, setOtp] = useState('');
  const [errors, setErrors] = useState<OtpFormErrors>({});
  const [touched, setTouched] = useState(false);

  const handleOtpChange = useCallback(
    (text: string) => {
      setOtp(text);
      if (error) clearError();
      if (touched) setErrors(validateOtpForm(text));
    },
    [error, clearError, touched],
  );

  const handleSubmit = useCallback(async () => {
    setTouched(true);
    const formErrors = validateOtpForm(otp);
    setErrors(formErrors);
    if (hasErrors(formErrors)) return null;
    return verifyOtpResetPassword({ phone_number, otp_code: otp });
  }, [otp, phone_number, verifyOtpResetPassword]);

  return {
    otp,
    errors,
    touched,
    isLoading,
    error,
    handleOtpChange,
    handleSubmit,
    clearError,
  };
}
