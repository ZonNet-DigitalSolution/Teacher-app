import {
  checkPhone,
  clearError,
  loginWithPassword,
  logout,
  registerTeacher,
  resetPassword,
  sendOtpResetPassword,
  setupPassword,
  updateUser,
  verifyOtp,
  verifyOtpResetPassword,
} from '@/store/auth';
import type { RegisterPayload, SetupPasswordPayload, User } from '@/types/auth.types';
import { useCallback } from 'react';
import { shallowEqual } from 'react-redux';
import { useAppDispatch, useAppSelector } from './store-hooks';

export function useAuth() {
  const dispatch = useAppDispatch();

  const { user, token, isAuthenticated, isInitialized, isLoading, error } = useAppSelector(
    (s) => ({
      user: s.auth.user,
      token: s.auth.token,
      isAuthenticated: s.auth.isAuthenticated,
      isInitialized: s.auth.isInitialized,
      isLoading: s.auth.isLoading,
      error: s.auth.error,
    }),
    shallowEqual,
  );

  const handleCheckPhone = useCallback(
    (phone_number: string) => dispatch(checkPhone(phone_number)),
    [dispatch],
  );

  const handleLoginWithPassword = useCallback(
    (payload: { phone_number: string; password: string }) =>
      dispatch(loginWithPassword(payload)),
    [dispatch],
  );

  const handleVerifyOtp = useCallback(
    (payload: { phone_number: string; otp_code: string }) => dispatch(verifyOtp(payload)),
    [dispatch],
  );

  const handleSetupPassword = useCallback(
    (payload: SetupPasswordPayload) => dispatch(setupPassword(payload)),
    [dispatch],
  );

  const handleRegister = useCallback(
    (payload: RegisterPayload) => dispatch(registerTeacher(payload)),
    [dispatch],
  );

  const handleSendOtpResetPassword = useCallback(
    (phone_number: string) => dispatch(sendOtpResetPassword(phone_number)),
    [dispatch],
  );

  const handleVerifyOtpResetPassword = useCallback(
    (payload: { phone_number: string; otp_code: string }) =>
      dispatch(verifyOtpResetPassword(payload)),
    [dispatch],
  );

  const handleResetPassword = useCallback(
    (payload: { phone_number: string; password: string; password_confirmation: string }) =>
      dispatch(resetPassword(payload)),
    [dispatch],
  );

  const handleLogout = useCallback(() => dispatch(logout()), [dispatch]);

  const handleClearError = useCallback(() => dispatch(clearError()), [dispatch]);

  const handleUpdateUser = useCallback(
    (changes: Partial<User>) => dispatch(updateUser(changes)),
    [dispatch],
  );

  return {
    user,
    token,
    isAuthenticated,
    isInitialized,
    isLoading,
    error,
    checkPhone: handleCheckPhone,
    loginWithPassword: handleLoginWithPassword,
    verifyOtp: handleVerifyOtp,
    setupPassword: handleSetupPassword,
    register: handleRegister,
    sendOtpResetPassword: handleSendOtpResetPassword,
    verifyOtpResetPassword: handleVerifyOtpResetPassword,
    resetPassword: handleResetPassword,
    logout: handleLogout,
    clearError: handleClearError,
    updateUser: handleUpdateUser,
  };
}
