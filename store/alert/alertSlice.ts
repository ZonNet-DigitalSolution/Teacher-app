import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import type { Alert, AlertState } from '@/types/alert.types';

// ─── Selectors ────────────────────────────────────────────────────────────────
// Typed against a partial root shape to avoid a circular store→slice import.

type StateWithAlert = { alert: AlertState };

export const selectCurrentAlert = (state: StateWithAlert): Alert | null =>
  state.alert.queue[0] ?? null;

export const selectAlertQueue = (state: StateWithAlert): Alert[] =>
  state.alert.queue;

export const selectAlertQueueLength = (state: StateWithAlert): number =>
  state.alert.queue.length;

// ─── Slice ────────────────────────────────────────────────────────────────────

const initialState: AlertState = {
  queue: [],
};

const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    /**
     * Enqueue a new alert.
     * Uses the `prepare` callback to auto-generate a unique `id` so callers
     * never have to provide one.
     */
    showAlert: {
      reducer(state, action: PayloadAction<Alert>) {
        state.queue.push(action.payload);
      },
      prepare(payload: Omit<Alert, 'id'>) {
        return { payload: { id: nanoid(), ...payload } };
      },
    },

    /**
     * Dismiss the current (front-of-queue) alert.
     * If more alerts are waiting they become visible automatically.
     */
    dismissAlert(state) {
      state.queue.shift();
    },

    /** Remove all pending alerts. */
    clearAlertQueue(state) {
      state.queue = [];
    },
  },
});

export const { showAlert, dismissAlert, clearAlertQueue } = alertSlice.actions;
export default alertSlice.reducer;
