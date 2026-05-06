import type { SetupPasswordFormErrors } from '@/types/auth.types';
import { hasErrors, validateSetupPasswordForm } from '@/utils/validators';
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from './use-auth';

type FormValues = {
  email: string;
  password: string;
  confirmPassword: string;
};

export interface UseSetupPasswordFormReturn {
  values: FormValues;
  errors: SetupPasswordFormErrors;
  isLoading: boolean;
  error: string | null;
  handleChange: (field: keyof FormValues) => (text: string) => void;
  handleSubmit: () => Promise<unknown>;
  clearError: () => void;
}

export function useSetupPasswordForm(phone_number: string): UseSetupPasswordFormReturn {
  const { setupPassword, isLoading, error, clearError } = useAuth();

  const [values, setValues] = useState<FormValues>({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<SetupPasswordFormErrors>({});
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!touched) return;
    setErrors(validateSetupPasswordForm(values.email, values.password, values.confirmPassword));
  }, [values, touched]);

  const handleChange = useCallback(
    (field: keyof FormValues) =>
      (text: string) => {
        setValues((prev) => ({ ...prev, [field]: text }));
        if (error) clearError();
      },
    [error, clearError],
  );

  const handleSubmit = useCallback(async () => {
    setTouched(true);
    const formErrors = validateSetupPasswordForm(
      values.email,
      values.password,
      values.confirmPassword,
    );
    setErrors(formErrors);
    if (hasErrors(formErrors)) return null;
    return setupPassword({
      phone_number,
      email: values.email,
      password: values.password,
      password_confirmation: values.confirmPassword,
    });
  }, [values, phone_number, setupPassword]);

  return {
    values,
    errors,
    isLoading,
    error,
    handleChange,
    handleSubmit,
    clearError,
  };
}
