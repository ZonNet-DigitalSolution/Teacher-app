import { COUNTRIES, type Country } from '@/constants/countries';
import type { LoginFormErrors } from '@/types/auth.types';
import { hasErrors, validateLoginForm } from '@/utils/validators';
import { useCallback, useState } from 'react';
import { useAuth } from './use-auth';

export interface UseForgotPasswordFormReturn {
  phone: string;
  country: Country;
  pickerVisible: boolean;
  errors: LoginFormErrors;
  touched: boolean;
  isLoading: boolean;
  error: string | null;
  fullPhone: string;
  handlePhoneChange: (text: string) => void;
  handleCountrySelect: (country: Country) => void;
  openPicker: () => void;
  closePicker: () => void;
  handleSubmit: () => Promise<unknown>;
  clearError: () => void;
}

export function useForgotPasswordForm(): UseForgotPasswordFormReturn {
  const { sendOtpResetPassword, isLoading, error, clearError } = useAuth();

  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState<Country>(COUNTRIES[0]);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [touched, setTouched] = useState(false);

  const handlePhoneChange = useCallback(
    (text: string) => {
      setPhone(text);
      if (error) clearError();
      if (touched) setErrors(validateLoginForm(text));
    },
    [error, clearError, touched],
  );

  const handleCountrySelect = useCallback((c: Country) => {
    setCountry(c);
    setPickerVisible(false);
  }, []);

  const openPicker = useCallback(() => setPickerVisible(true), []);
  const closePicker = useCallback(() => setPickerVisible(false), []);

  const handleSubmit = useCallback(async () => {
    setTouched(true);
    const formErrors = validateLoginForm(phone);
    setErrors(formErrors);
    if (hasErrors(formErrors)) return null;
    return sendOtpResetPassword(`${country.dial}${phone}`);
  }, [phone, country, sendOtpResetPassword]);

  return {
    phone,
    country,
    pickerVisible,
    errors,
    touched,
    isLoading,
    error,
    fullPhone: `${country.dial}${phone}`,
    handlePhoneChange,
    handleCountrySelect,
    openPicker,
    closePicker,
    handleSubmit,
    clearError,
  };
}
