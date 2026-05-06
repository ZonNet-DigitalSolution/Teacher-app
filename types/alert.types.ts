// ─── Alert System Types ───────────────────────────────────────────────────────
// Fully serializable types stored in Redux +
// rich callback types used only in the hook layer.

export type AlertType = 'success' | 'error' | 'warning' | 'info';
export type AlertButtonStyle = 'primary' | 'secondary' | 'danger';

// ─── Serializable (safe for Redux) ───────────────────────────────────────────

/** A button descriptor stored in Redux state (no functions). */
export interface AlertButton {
  label: string;
  style?: AlertButtonStyle;
}

/** A single alert entry stored in the Redux queue. Fully serializable. */
export interface Alert {
  id: string;
  type: AlertType;
  message: string;
  title?: string;
  confirmAction?: AlertButton;
  cancelAction?: AlertButton;
  /** Auto-dismiss after N milliseconds. Omit to require manual dismiss. */
  autoDismiss?: number;
}

export interface AlertState {
  queue: Alert[];
}

// ─── Rich API (used in useAlert hook only, never stored in Redux) ─────────────

/** Full button descriptor including the press handler (not Redux-safe). */
export type AlertButtonWithHandler = AlertButton & {
  onPress: () => void;
};

/**
 * Options passed to `useAlert` show helpers.
 * `confirmAction` and `cancelAction` carry real callbacks; these are held
 * in the callback registry and never placed in the Redux store.
 */
export interface ShowAlertOptions {
  type: AlertType;
  message: string;
  title?: string;
  confirmAction?: AlertButtonWithHandler;
  cancelAction?: AlertButtonWithHandler;
  autoDismiss?: number;
}

/**
 * Lightweight payload used by the alert gateway (axios interceptors, services).
 * No callbacks — just metadata for informational/error toasts.
 */
export type AlertGatewayPayload = Pick<Alert, 'type' | 'message'> &
  Partial<Pick<Alert, 'title' | 'autoDismiss'>>;
