import type { ResetPasswordFormErrors } from '@/types/auth.types';
import { hasErrors, validateResetPasswordForm } from '@/utils/validators';
import { useCallback, useState } from 'react';
import { useAuth } from './use-auth';

export interface UseResetPasswordFormReturn {
  password: string;
  confirmPassword: string;
  errors: ResetPasswordFormErrors;
  touched: boolean;
  isLoading: boolean;
  error: string | null;
  handlePasswordChange: (text: string) => void;
  handleConfirmPasswordChange: (text: string) => void;
  handleSubmit: () => Promise<unknown>;
  clearError: () => void;
}

export function useResetPasswordForm(phone_number: string): UseResetPasswordFormReturn {
  const { resetPassword, isLoading, error, clearError } = useAuth();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<ResetPasswordFormErrors>({});
  const [touched, setTouched] = useState(false);

  const handlePasswordChange = useCallback(
    (text: string) => {
      setPassword(text);
      if (error) clearError();
      if (touched) setErrors(validateResetPasswordForm(text, confirmPassword));
    },
    [error, clearError, touched, confirmPassword],
  );

  const handleConfirmPasswordChange = useCallback(
    (text: string) => {
      setConfirmPassword(text);
      if (touched) setErrors(validateResetPasswordForm(password, text));
    },
    [touched, password],
  );

  const handleSubmit = useCallback(async () => {
    setTouched(true);
    const formErrors = validateResetPasswordForm(password, confirmPassword);
    setErrors(formErrors);
    if (hasErrors(formErrors)) return null;
    return resetPassword({ phone_number, password, password_confirmation: confirmPassword });
  }, [password, confirmPassword, phone_number, resetPassword]);

  return {
    password,
    confirmPassword,
    errors,
    touched,
    isLoading,
    error,
    handlePasswordChange,
    handleConfirmPasswordChange,
    handleSubmit,
    clearError,
  };
}
