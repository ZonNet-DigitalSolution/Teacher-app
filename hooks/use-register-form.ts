import { COUNTRIES, type Country } from '@/constants/countries';
import type { RegisterFormErrors } from '@/types/auth.types';
import { hasErrors, validateRegisterForm } from '@/utils/validators';
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from './use-auth';

type FormValues = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

export interface UseRegisterFormReturn {
  values: FormValues;
  country: Country;
  pickerVisible: boolean;
  errors: RegisterFormErrors;
  isLoading: boolean;
  error: string | null;
  fullPhone: string;
  handleChange: (field: keyof FormValues) => (text: string) => void;
  handleCountrySelect: (country: Country) => void;
  openPicker: () => void;
  closePicker: () => void;
  handleSubmit: () => Promise<unknown>;
  clearError: () => void;
}

export function useRegisterForm(): UseRegisterFormReturn {
  const { register, isLoading, error, clearError } = useAuth();

  const [values, setValues] = useState<FormValues>({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [country, setCountry] = useState<Country>(COUNTRIES[0]);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!touched) return;
    setErrors(
      validateRegisterForm(
        values.fullName,
        values.email,
        values.phone,
        values.password,
        values.confirmPassword,
      ),
    );
  }, [values, touched]);

  const handleChange = useCallback(
    (field: keyof FormValues) =>
      (text: string) => {
        setValues((prev) => ({ ...prev, [field]: text }));
        if (error) clearError();
      },
    [error, clearError],
  );

  const handleCountrySelect = useCallback((c: Country) => {
    setCountry(c);
    setPickerVisible(false);
  }, []);

  const openPicker = useCallback(() => setPickerVisible(true), []);
  const closePicker = useCallback(() => setPickerVisible(false), []);

  const handleSubmit = useCallback(async () => {
    setTouched(true);
    const formErrors = validateRegisterForm(
      values.fullName,
      values.email,
      values.phone,
      values.password,
      values.confirmPassword,
    );
    setErrors(formErrors);
    if (hasErrors(formErrors)) return null;
    return register({
      full_name_ar: values.fullName,
      email: values.email,
      phone_number: `${country.dial}${values.phone}`,
      password: values.password,
      password_confirmation: values.confirmPassword,
      employment_type: 'employee',
    });
  }, [values, country, register]);

  return {
    values,
    country,
    pickerVisible,
    errors,
    isLoading,
    error,
    fullPhone: `${country.dial}${values.phone}`,
    handleChange,
    handleCountrySelect,
    openPicker,
    closePicker,
    handleSubmit,
    clearError,
  };
}
