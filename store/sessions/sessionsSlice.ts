import type {
  APISession,
  GroupItem,
  ScheduleState,
  SubjectItem,
} from "@/types/schedule.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const MAX_CACHED_DAYS = 14;

const initialState: ScheduleState = {
  sessions: [],
  daySessions: {},
  selectedDate: new Date().toISOString().split("T")[0],
  isLoading: false,
  error: null,

  addGroups: [],
  addSubjects: [],
  addGroupsLoading: false,
  sessionCount: null,
  sessionCountLoading: false,
  creating: false,
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
      // Evict the oldest date when cache exceeds limit
      const keys = Object.keys(state.daySessions);
      if (keys.length > MAX_CACHED_DAYS) {
        delete state.daySessions[keys.sort()[0]];
      }
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

    setAddGroups(state, action: PayloadAction<GroupItem[]>) {
      state.addGroups = action.payload;
    },
    setAddSubjects(state, action: PayloadAction<SubjectItem[]>) {
      state.addSubjects = action.payload;
    },
    setAddGroupsLoading(state, action: PayloadAction<boolean>) {
      state.addGroupsLoading = action.payload;
    },
    setSessionCount(state, action: PayloadAction<number | null>) {
      state.sessionCount = action.payload;
    },
    setSessionCountLoading(state, action: PayloadAction<boolean>) {
      state.sessionCountLoading = action.payload;
    },
    setCreating(state, action: PayloadAction<boolean>) {
      state.creating = action.payload;
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
  setAddGroups,
  setAddSubjects,
  setAddGroupsLoading,
  setSessionCount,
  setSessionCountLoading,
  setCreating,
} = sessionsSlice.actions;

export default sessionsSlice.reducer;
