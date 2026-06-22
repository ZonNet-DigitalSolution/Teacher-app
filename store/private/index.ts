import type { RootState } from "@/store";
import { createSelector } from "@reduxjs/toolkit";
export { clearPrivateError, default as privateReducer } from "./privateSlice";
export {
  acceptPrivateBooking,
  fetchPrivateBookings,
  rejectPrivateBooking
} from "./privateThunks";
export type {
  PrivateBookingsByTab, PrivateBookingSource,
  PrivateBookingStatus, PrivateSessionBooking,
  PrivateTabId
} from "./privateTypes";

export const selectNewRequestCount = createSelector(
  (state: RootState) => state.private.requests.new,
  (newRequests) => newRequests.length,
);
