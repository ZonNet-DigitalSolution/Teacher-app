import type { PasswordLoginFormErrors } from "@/types/auth.types";
import { hasErrors, validatePasswordLoginForm } from "@/utils/validators";
import { useCallback, useState } from "react";
import { useAuth } from "./use-auth";

export interface UsePasswordLoginFormReturn {
  password: string;
  errors: PasswordLoginFormErrors;
  touched: boolean;
  isLoading: boolean;
  error: string | null;
  handlePasswordChange: (text: string) => void;
  handleSubmit: () => Promise<unknown>;
  clearError: () => void;
}

export function usePasswordLoginForm(
  phone_number: string,
): UsePasswordLoginFormReturn {
  const { loginWithPassword, isLoading, error, clearError } = useAuth();

  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<PasswordLoginFormErrors>({});
  const [touched, setTouched] = useState(false);

  const handlePasswordChange = useCallback(
    (text: string) => {
      setPassword(text);
      if (error) clearError();
      if (touched) setErrors(validatePasswordLoginForm(text));
    },
    [error, clearError, touched],
  );

  const handleSubmit = useCallback(async () => {
    setTouched(true);
    const formErrors = validatePasswordLoginForm(password);
    setErrors(formErrors);
    if (hasErrors(formErrors)) return null;
    const res = loginWithPassword({ phone_number, password });
    return res;
  }, [password, phone_number, loginWithPassword]);

  return {
    password,
    errors,
    touched,
    isLoading,
    error,
    handlePasswordChange,
    handleSubmit,
    clearError,
  };
}
