// ─── Alert Gateway ────────────────────────────────────────────────────────────
// A zero-dependency bridge that lets non-React code (axios interceptors,
// service functions, utility modules) push alerts into the Redux store
// without creating circular imports.
//
// Usage:
//   1. In RootLayoutNav (once, on mount):
//        registerAlertGateway((payload) => dispatch(showAlert(payload)));
//   2. Anywhere else (e.g. axios interceptor):
//        alertGateway({ type: 'error', message: normalizeError(err) });

import type { AlertGatewayPayload } from '@/types/alert.types';

type GatewayFn = (payload: AlertGatewayPayload) => void;

let _gateway: GatewayFn | null = null;

/**
 * Register the dispatch-bound gateway function.
 * Call this once from the root layout after the Redux store is available.
 */
export function registerAlertGateway(fn: GatewayFn): void {
  _gateway = fn;
}

/**
 * Fire an alert from anywhere outside the React tree.
 * Silently no-ops if the gateway has not been registered yet.
 */
export function alertGateway(payload: AlertGatewayPayload): void {
  _gateway?.(payload);
}
