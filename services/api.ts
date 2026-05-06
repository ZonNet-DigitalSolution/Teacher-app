import { clearSession, getToken } from "@/utils/secure-storage";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { alertGateway } from "./alertGateway";

export const BASE_URL = "https://admin.learnadolphin.com/api";

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ─── Request Interceptor — inject Bearer token ────────────────────────────────
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Response Interceptor — handle errors + global alert ─────────────────────
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      await clearSession();
      delete api.defaults.headers.common["Authorization"];
      // 401 is handled by AuthGuard redirect; no alert needed here.
      return Promise.reject(error);
    }

    // Surface all other errors as a global alert so every feature benefits
    // automatically. Individual thunks/callers may still catch and handle
    // errors themselves — this is purely additive.
    const message = normalizeError(error);
    alertGateway({ type: "error", message });

    return Promise.reject(error);
  },
);

// ─── Error Normalizer ─────────────────────────────────────────────────────────
export function normalizeError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const serverMsg =
      error.response?.data?.message ||
      error.response?.data?.error ||
      (error.response?.data?.errors as string[])?.[0];
    if (typeof serverMsg === "string") return serverMsg;
    if (error.code === "ECONNABORTED")
      return "انتهت مهلة الطلب. تحقق من اتصالك بالإنترنت.";
    if (!error.response)
      return "تعذر الاتصال بالخادم. تحقق من اتصالك بالإنترنت.";
    if (error.response.status === 401) return "بيانات الدخول غير صحيحة.";
    if (error.response.status === 422)
      return "بيانات غير صالحة. يرجى المراجعة.";
    if (error.response.status >= 500)
      return "حدث خطأ في الخادم. يرجى المحاولة لاحقاً.";
  }
  if (error instanceof Error) return error.message;
  return "حدث خطأ غير متوقع.";
}
