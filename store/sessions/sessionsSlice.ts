import type { APISession, ScheduleState } from "@/types/schedule.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: ScheduleState = {
  sessions: [],
  daySessions: {},
  selectedDate: new Date().toISOString().split("T")[0],
  isLoading: false,
  error: null,
};

const sessionsSlice = createSlice({
  name: "sessions",
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setSelectedDate(state, action: PayloadAction<string>) {
      state.selectedDate = action.payload;
    },
    setSessions(state, action: PayloadAction<APISession[]>) {
      state.sessions = action.payload;
    },
    setDaySessions(
      state,
      action: PayloadAction<{ date: string; sessions: APISession[] }>,
    ) {
      state.daySessions[action.payload.date] = action.payload.sessions;
      state.selectedDate = action.payload.date;
    },
    seedDaySessions(
      state,
      action: PayloadAction<Record<string, APISession[]>>,
    ) {
      state.daySessions = { ...state.daySessions, ...action.payload };
    },
    clearError(state) {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setSelectedDate,
  setSessions,
  setDaySessions,
  seedDaySessions,
  clearError,
} = sessionsSlice.actions;

export default sessionsSlice.reducer;
