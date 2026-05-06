// ─── Alert Callback Registry ──────────────────────────────────────────────────
// Holds confirm/cancel callbacks keyed by alert ID.
// Functions cannot be stored in Redux (not serializable), so we park them here
// and look them up when the user presses a button.

interface AlertCallbacks {
  confirm?: () => void;
  cancel?: () => void;
}

const _registry = new Map<string, AlertCallbacks>();

export const alertCallbackRegistry = {
  register(id: string, callbacks: AlertCallbacks): void {
    _registry.set(id, callbacks);
  },

  get(id: string): AlertCallbacks | undefined {
    return _registry.get(id);
  },

  remove(id: string): void {
    _registry.delete(id);
  },

  clear(): void {
    _registry.clear();
  },
} as const;
