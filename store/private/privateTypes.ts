export type PrivateTabId = "new" | "accepted" | "cancelled";

export type PrivateBookingStatus = "pending_teacher" | "accepted" | "cancelled";

export type PrivateSessionBooking = {
  id: string;
  studentName: string;
  subject: string;
  date: string;
  time: string;
  duration: string;
  status: PrivateBookingStatus | string;
  statusLabel: string;
  responseDeadline: string | null;
  studentNotes: string | null;
};

export type PrivateBookingsByTab = Record<PrivateTabId, PrivateSessionBooking[]>;

export type PrivateState = {
  requests: PrivateBookingsByTab;
  isLoading: boolean;
  isRefreshing: boolean;
  actionLoadingId: string | null;
  error: string | null;
};

export const PRIVATE_STATUS_BY_TAB: Record<PrivateTabId, PrivateBookingStatus> = {
  new: "pending_teacher",
  accepted: "accepted",
  cancelled: "cancelled",
};
