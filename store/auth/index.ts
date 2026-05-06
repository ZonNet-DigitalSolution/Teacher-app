export { default as authReducer } from './authSlice';
export { clearAuth, clearError, setError, setInitialized, setLoading, setToken, setUser, updateUser } from './authSlice';
export {
  checkPhone,
  initializeAuth,
  loginWithPassword,
  logout,
  registerTeacher,
  resetPassword,
  sendOtpResetPassword,
  setupPassword,
  verifyOtp,
  verifyOtpResetPassword,
} from './authThunks';
export type { AuthResult, CheckPhoneResult } from './authService';
