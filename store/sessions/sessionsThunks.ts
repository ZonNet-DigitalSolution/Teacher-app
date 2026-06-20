import { normalizeError } from "@/services/api";
import type { APISession, CreateSessionPayload } from "@/types/schedule.types";
import { groupByDate } from "@/utils/schedule";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { sessionsService } from "./sessionsService";
import {
  seedDaySessions,
  setAddGroups,
  setAddGroupsLoading,
  setAddSubjects,
  setCreating,
  setDaySessions,
  setError,
  setLoading,
  setSessionCount,
  setSessionCountLoading,
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

export const fetchAddSessionsGroups = createAsyncThunk(
  "sessions/fetchAddGroups",
  async (_, { dispatch }) => {
    try {
      dispatch(setAddGroupsLoading(true));
      const { groups, subjects } =
        await sessionsService.fetchGroupsAndSubjects();
      dispatch(setAddGroups(groups));
      dispatch(setAddSubjects(subjects));
      return { groups, subjects };
    } catch (err) {
      dispatch(setError(normalizeError(err)));
    } finally {
      dispatch(setAddGroupsLoading(false));
    }
  },
);

export const fetchSessionCount = createAsyncThunk(
  "sessions/fetchCount",
  async (
    { groupId, subjectId }: { groupId: number; subjectId: number },
    { dispatch },
  ) => {
    try {
      dispatch(setSessionCountLoading(true));
      dispatch(setSessionCount(null));
      const count = await sessionsService.getSessionCount(groupId, subjectId);
      dispatch(setSessionCount(count));
      return count;
    } catch (err) {
      dispatch(setError(normalizeError(err)));
    } finally {
      dispatch(setSessionCountLoading(false));
    }
  },
);

export const createSessionThunk = createAsyncThunk(
  "sessions/create",
  async (payload: CreateSessionPayload, { dispatch }) => {
    try {
      dispatch(setCreating(true));
      const result = await sessionsService.createSession(payload);
      return result;
    } catch (err) {
      throw new Error(normalizeError(err));
    } finally {
      dispatch(setCreating(false));
    }
  },
);
