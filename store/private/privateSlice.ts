import { createSlice } from "@reduxjs/toolkit";
import type { PrivateState } from "./privateTypes";
import {
  acceptPrivateBooking,
  fetchPrivateBookings,
  rejectPrivateBooking,
} from "./privateThunks";

const initialState: PrivateState = {
  requests: {
    new: [],
    accepted: [],
    cancelled: [],
  },
  isLoading: false,
  isRefreshing: false,
  actionLoadingId: null,
  error: null,
};

function hasLoadedBookings(state: PrivateState): boolean {
  return Object.values(state.requests).some((items) => items.length > 0);
}

const privateSlice = createSlice({
  name: "private",
  initialState,
  reducers: {
    clearPrivateError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPrivateBookings.pending, (state, action) => {
        const shouldRefresh = action.meta.arg?.refresh || hasLoadedBookings(state);
        state.error = null;
        state.isLoading = !shouldRefresh;
        state.isRefreshing = shouldRefresh;
      })
      .addCase(fetchPrivateBookings.fulfilled, (state, action) => {
        state.requests = action.payload;
        state.isLoading = false;
        state.isRefreshing = false;
      })
      .addCase(fetchPrivateBookings.rejected, (state, action) => {
        state.error =
          typeof action.payload === "string" ? action.payload : "تعذر تحميل طلبات الحصص الفردية";
        state.isLoading = false;
        state.isRefreshing = false;
      })
      .addCase(acceptPrivateBooking.pending, (state, action) => {
        state.actionLoadingId = action.meta.arg;
      })
      .addCase(acceptPrivateBooking.fulfilled, (state, action) => {
        state.requests.new = state.requests.new.filter((request) => request.id !== action.payload);
        state.actionLoadingId = null;
      })
      .addCase(acceptPrivateBooking.rejected, (state, action) => {
        state.error = typeof action.payload === "string" ? action.payload : "تعذر قبول الطلب";
        state.actionLoadingId = null;
      })
      .addCase(rejectPrivateBooking.pending, (state, action) => {
        state.actionLoadingId = action.meta.arg;
      })
      .addCase(rejectPrivateBooking.fulfilled, (state, action) => {
        state.requests.new = state.requests.new.filter((request) => request.id !== action.payload);
        state.actionLoadingId = null;
      })
      .addCase(rejectPrivateBooking.rejected, (state, action) => {
        state.error = typeof action.payload === "string" ? action.payload : "تعذر رفض الطلب";
        state.actionLoadingId = null;
      });
  },
});

export const { clearPrivateError } = privateSlice.actions;

export default privateSlice.reducer;
