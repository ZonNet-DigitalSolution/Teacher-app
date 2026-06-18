import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { SessionRequest, UpcomingPrivateSession } from './privateTypes';

interface PrivateState {
  requests: SessionRequest[];
  requestsLoading: boolean;
  requestsError: string | null;
  upcoming: UpcomingPrivateSession[];
  upcomingLoading: boolean;
}

const initialState: PrivateState = {
  requests: [],
  requestsLoading: false,
  requestsError: null,
  upcoming: [],
  upcomingLoading: false,
};

const privateSlice = createSlice({
  name: 'private',
  initialState,
  reducers: {
    setRequests(state, action: PayloadAction<SessionRequest[]>) {
      state.requests = action.payload;
    },
    removeRequest(state, action: PayloadAction<number>) {
      state.requests = state.requests.filter(r => r.id !== action.payload);
    },
    setRequestsLoading(state, action: PayloadAction<boolean>) {
      state.requestsLoading = action.payload;
    },
    setRequestsError(state, action: PayloadAction<string | null>) {
      state.requestsError = action.payload;
    },
    setUpcoming(state, action: PayloadAction<UpcomingPrivateSession[]>) {
      state.upcoming = action.payload;
    },
    setUpcomingLoading(state, action: PayloadAction<boolean>) {
      state.upcomingLoading = action.payload;
    },
  },
});

export const {
  setRequests,
  removeRequest,
  setRequestsLoading,
  setRequestsError,
  setUpcoming,
  setUpcomingLoading,
} = privateSlice.actions;

export default privateSlice.reducer;
