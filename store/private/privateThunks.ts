import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/services/api';
import { API_ENDPOINTS } from '@/constants/endpoints';
import {
  setRequests,
  removeRequest,
  setRequestsLoading,
  setRequestsError,
  setUpcoming,
  setUpcomingLoading,
} from './privateSlice';

export const fetchSessionRequests = createAsyncThunk(
  'private/fetchRequests',
  async (_, { dispatch }) => {
    dispatch(setRequestsLoading(true));
    dispatch(setRequestsError(null));
    try {
      const res = await api.get(API_ENDPOINTS.PRIVATE.SESSION_REQUESTS, {
        params: { status: 'pending' },
      });
      dispatch(setRequests(res.data.data ?? res.data));
    } catch (e: any) {
      dispatch(setRequestsError(e.message ?? 'حدث خطأ'));
    } finally {
      dispatch(setRequestsLoading(false));
    }
  },
);

export const acceptSessionRequest = createAsyncThunk(
  'private/acceptRequest',
  async (
    { sessionId, message }: { sessionId: number; message?: string },
    { dispatch },
  ) => {
    await api.post(`${API_ENDPOINTS.PRIVATE.ACCEPT_REQUEST}/${sessionId}`, {
      ...(message ? { message } : {}),
    });
    dispatch(removeRequest(sessionId));
  },
);

export const rejectSessionRequest = createAsyncThunk(
  'private/rejectRequest',
  async (
    { sessionId, reason }: { sessionId: number; reason: string },
    { dispatch },
  ) => {
    await api.post(`${API_ENDPOINTS.PRIVATE.REJECT_REQUEST}/${sessionId}`, {
      reason,
    });
    dispatch(removeRequest(sessionId));
  },
);

export const fetchUpcomingSessions = createAsyncThunk(
  'private/fetchUpcoming',
  async (_, { dispatch }) => {
    dispatch(setUpcomingLoading(true));
    try {
      const res = await api.get(API_ENDPOINTS.PRIVATE.UPCOMING, {
        params: { status: 'upcoming' },
      });
      dispatch(setUpcoming(res.data.data ?? res.data));
    } finally {
      dispatch(setUpcomingLoading(false));
    }
  },
);
