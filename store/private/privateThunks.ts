import { normalizeError } from "@/services/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { privateService } from "./privateService";
import type { PrivateSessionBooking } from "./privateTypes";

export const fetchPrivateBookings = createAsyncThunk(
  "private/fetchBookings",
  async (_args: { refresh?: boolean } | undefined, { rejectWithValue }) => {
    try {
      return await privateService.getAllBookings();
    } catch (error) {
      return rejectWithValue(normalizeError(error));
    }
  },
);

export const acceptPrivateBooking = createAsyncThunk(
  "private/acceptBooking",
  async (booking: PrivateSessionBooking, { rejectWithValue }) => {
    try {
      await privateService.acceptBooking(booking);
      return booking.id;
    } catch (error) {
      return rejectWithValue(normalizeError(error));
    }
  },
);

export const rejectPrivateBooking = createAsyncThunk(
  "private/rejectBooking",
  async (booking: PrivateSessionBooking, { rejectWithValue }) => {
    try {
      await privateService.rejectBooking(booking);
      return booking.id;
    } catch (error) {
      return rejectWithValue(normalizeError(error));
    }
  },
);
