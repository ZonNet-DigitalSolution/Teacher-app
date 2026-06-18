import { normalizeError } from "@/services/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { privateService } from "./privateService";

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
  async (id: string, { rejectWithValue }) => {
    try {
      await privateService.acceptBooking(id);
      return id;
    } catch (error) {
      return rejectWithValue(normalizeError(error));
    }
  },
);

export const rejectPrivateBooking = createAsyncThunk(
  "private/rejectBooking",
  async (id: string, { rejectWithValue }) => {
    try {
      await privateService.rejectBooking(id);
      return id;
    } catch (error) {
      return rejectWithValue(normalizeError(error));
    }
  },
);
