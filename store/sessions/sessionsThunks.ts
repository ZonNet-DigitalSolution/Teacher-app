import { normalizeError } from "@/services/api";
import type { APISession } from "@/types/schedule.types";
import { groupByDate } from "@/utils/schedule";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { sessionsService } from "./sessionsService";
import {
  seedDaySessions,
  setDaySessions,
  setError,
  setLoading,
  setSessions,
} from "./sessionsSlice";

export const fetchWeekSessions = createAsyncThunk(
  "sessions/fetchWeek",
  async (_, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const res = await sessionsService.getWeekSessions();
      const sessions = (res.data ?? []) as APISession[];
      dispatch(setSessions(sessions));
      dispatch(seedDaySessions(groupByDate(sessions)));
      return sessions;
    } catch (err) {
      const msg = normalizeError(err);
      dispatch(setError(msg));
      throw new Error(msg);
    } finally {
      dispatch(setLoading(false));
    }
  },
);

export const fetchDaySessions = createAsyncThunk(
  "sessions/fetchDay",
  async (isoDate: string, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const res = await sessionsService.getDaySessions(isoDate);
      const sessions = (res.data ?? []) as APISession[];
      dispatch(setDaySessions({ date: isoDate, sessions }));
      return { date: isoDate, sessions };
    } catch (err) {
      const msg = normalizeError(err);
      dispatch(setError(msg));
      throw new Error(msg);
    } finally {
      dispatch(setLoading(false));
    }
  },
);
