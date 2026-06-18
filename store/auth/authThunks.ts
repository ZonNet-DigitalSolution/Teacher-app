import { api, normalizeError } from '@/services/api';
import type { RegisterPayload, SetupPasswordPayload, User } from '@/types/auth.types';
import { clearSession, getSavedUser, getToken, saveToken, saveUser } from '@/utils/secure-storage';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from './authService';
import { clearAuth, setError, setInitialized, setLoading, setToken, setUser } from './authSlice';

// ─── Helper ───────────────────────────────────────────────────────────────────

async function persistAuth(token: string, user: User) {
  await Promise.all([saveToken(token), saveUser(user)]);
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

function logAuthStartup(message: string, details?: unknown) {
  if (!__DEV__) return;
  if (details === undefined) {
    console.log(`[startup:auth] ${message}`);
  } else {
    console.log(`[startup:auth] ${message}`, details);
  }
}

function warnAuthStartup(message: string, error?: unknown) {
  if (!__DEV__) return;
  console.warn(`[startup:auth] ${message}`, error);
}

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const initializeAuth = createAsyncThunk('auth/initialize', async (_, { dispatch }) => {
  try {
    logAuthStartup('reading saved token and user');
    const [token, user] = await Promise.all([getToken(), getSavedUser<User>()]);
    logAuthStartup('saved auth state read', {
      hasToken: !!token,
      hasUser: !!user,
    });

    if (token && user) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      dispatch(setToken(token));
      dispatch(setUser(user));
      logAuthStartup('saved session restored');
    } else {
      logAuthStartup('no complete saved session; login screen required');
    }
  } catch (error) {
    warnAuthStartup('failed to read saved auth state; login screen required', error);
  } finally {
    dispatch(setInitialized(true));
    logAuthStartup('auth marked initialized');
  }
});

export const checkPhone = createAsyncThunk(
  'auth/checkPhone',
  async (phone_number: string, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const result = await authService.checkPhone(phone_number);
      return result;
    } catch (err) {
      const msg = normalizeError(err);
      dispatch(setError(msg));
      throw new Error(msg);
    } finally {
      dispatch(setLoading(false));
    }
  },
);

export const loginWithPassword = createAsyncThunk(
  'auth/loginWithPassword',
  async (payload: { phone_number: string; password: string }, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const result = await authService.loginWithPassword(payload.phone_number, payload.password);
      await persistAuth(result.token, result.user);
      dispatch(setToken(result.token));
      dispatch(setUser(result.user));
      return result;
    } catch (err) {
      const msg = normalizeError(err);
      dispatch(setError(msg));
      throw new Error(msg);
    } finally {
      dispatch(setLoading(false));
    }
  },
);

export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async (payload: { phone_number: string; otp_code: string }, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const result = await authService.verifyOtp(payload.phone_number, payload.otp_code);
      await persistAuth(result.token, result.user);
      dispatch(setToken(result.token));
      dispatch(setUser(result.user));
      return result;
    } catch (err) {
      const msg = normalizeError(err);
      dispatch(setError(msg));
      throw new Error(msg);
    } finally {
      dispatch(setLoading(false));
    }
  },
);

export const setupPassword = createAsyncThunk(
  'auth/setupPassword',
  async (payload: SetupPasswordPayload, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const result = await authService.setupPassword(payload);
      await persistAuth(result.token, result.user);
      dispatch(setToken(result.token));
      dispatch(setUser(result.user));
      return result;
    } catch (err) {
      const msg = normalizeError(err);
      dispatch(setError(msg));
      throw new Error(msg);
    } finally {
      dispatch(setLoading(false));
    }
  },
);

export const registerTeacher = createAsyncThunk(
  'auth/register',
  async (payload: RegisterPayload, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      await authService.register(payload);
    } catch (err) {
      const msg = normalizeError(err);
      dispatch(setError(msg));
      throw new Error(msg);
    } finally {
      dispatch(setLoading(false));
    }
  },
);

export const sendOtpResetPassword = createAsyncThunk(
  'auth/sendOtpResetPassword',
  async (phone_number: string, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      await authService.sendOtpResetPassword(phone_number);
    } catch (err) {
      const msg = normalizeError(err);
      dispatch(setError(msg));
      throw new Error(msg);
    } finally {
      dispatch(setLoading(false));
    }
  },
);

export const verifyOtpResetPassword = createAsyncThunk(
  'auth/verifyOtpResetPassword',
  async (payload: { phone_number: string; otp_code: string }, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      await authService.verifyOtpResetPassword(payload.phone_number, payload.otp_code);
    } catch (err) {
      const msg = normalizeError(err);
      dispatch(setError(msg));
      throw new Error(msg);
    } finally {
      dispatch(setLoading(false));
    }
  },
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (
    payload: { phone_number: string; password: string; password_confirmation: string },
    { dispatch },
  ) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      await authService.resetPassword(
        payload.phone_number,
        payload.password,
        payload.password_confirmation,
      );
    } catch (err) {
      const msg = normalizeError(err);
      dispatch(setError(msg));
      throw new Error(msg);
    } finally {
      dispatch(setLoading(false));
    }
  },
);

export const logout = createAsyncThunk('auth/logout', async (_, { dispatch }) => {
  await authService.logout();
  await clearSession();
  delete api.defaults.headers.common['Authorization'];
  dispatch(clearAuth());
});
