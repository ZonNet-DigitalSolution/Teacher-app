import { nanoid } from '@reduxjs/toolkit';
import { useCallback } from 'react';

import {
  alertCallbackRegistry,
  clearAlertQueue,
  dismissAlert,
  showAlert,
} from '@/store/alert';
import type {
  AlertButtonWithHandler,
  AlertGatewayPayload,
  AlertType,
  ShowAlertOptions,
} from '@/types/alert.types';

import { useAppDispatch } from './store-hooks';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function stripHandler(
  btn: AlertButtonWithHandler | undefined,
): { label: string; style?: AlertButtonWithHandler['style'] } | undefined {
  if (!btn) return undefined;
  return { label: btn.label, style: btn.style };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * `useAlert` — the single entry point for triggering alerts across the app.
 *
 * @example
 * const alert = useAlert();
 * alert.success('Profile saved!');
 * alert.error('Something went wrong', { title: 'Error' });
 * alert.confirm({
 *   type: 'warning',
 *   message: 'Delete this item?',
 *   confirmAction: { label: 'Delete', style: 'danger', onPress: handleDelete },
 *   cancelAction: { label: 'Cancel', onPress: () => {} },
 * });
 */
export function useAlert() {
  const dispatch = useAppDispatch();

  // ── Core show ──────────────────────────────────────────────────────────────
  const show = useCallback(
    (options: ShowAlertOptions): string => {
      const id = nanoid();

      // Register callbacks outside Redux (functions are not serializable).
      if (options.confirmAction || options.cancelAction) {
        alertCallbackRegistry.register(id, {
          confirm: options.confirmAction?.onPress,
          cancel: options.cancelAction?.onPress,
        });
      }

      dispatch(
        showAlert({
          id,
          type: options.type,
          message: options.message,
          title: options.title,
          confirmAction: stripHandler(options.confirmAction),
          cancelAction: stripHandler(options.cancelAction),
          autoDismiss: options.autoDismiss,
        }),
      );

      return id;
    },
    [dispatch],
  );

  // ── Convenience helpers ────────────────────────────────────────────────────
  const success = useCallback(
    (message: string, options?: Partial<Omit<ShowAlertOptions, 'type' | 'message'>>) =>
      show({ type: 'success', message, autoDismiss: 3000, ...options }),
    [show],
  );

  const error = useCallback(
    (message: string, options?: Partial<Omit<ShowAlertOptions, 'type' | 'message'>>) =>
      show({ type: 'error', message, ...options }),
    [show],
  );

  const warning = useCallback(
    (message: string, options?: Partial<Omit<ShowAlertOptions, 'type' | 'message'>>) =>
      show({ type: 'warning', message, ...options }),
    [show],
  );

  const info = useCallback(
    (message: string, options?: Partial<Omit<ShowAlertOptions, 'type' | 'message'>>) =>
      show({ type: 'info', message, autoDismiss: 4000, ...options }),
    [show],
  );

  /**
   * Shorthand for a confirm/cancel dialog.
   * @example
   * alert.confirm({
   *   type: 'warning',
   *   message: 'Are you sure?',
   *   confirmAction: { label: 'Yes', style: 'danger', onPress: doDelete },
   *   cancelAction: { label: 'No', onPress: () => {} },
   * });
   */
  const confirm = useCallback(
    (options: Omit<ShowAlertOptions, 'type'> & { type?: AlertType }) =>
      show({ type: 'warning', ...options }),
    [show],
  );

  // ── Queue control ──────────────────────────────────────────────────────────
  const dismiss = useCallback(() => dispatch(dismissAlert()), [dispatch]);
  const clearQueue = useCallback(() => dispatch(clearAlertQueue()), [dispatch]);

  // ── Gateway helper (for use outside React, e.g. thunks that import the hook result) ─
  /**
   * Show a simple alert without callbacks — same shape used by the axios gateway.
   * Useful when you have a dispatch reference but not the full hook.
   */
  const gateway = useCallback(
    (payload: AlertGatewayPayload) =>
      show({ ...payload, type: payload.type }),
    [show],
  );

  return { show, success, error, warning, info, confirm, dismiss, clearQueue, gateway } as const;
}
