import { API_ENDPOINTS } from "@/constants/endpoints";
import { api } from "@/services/api";
import type {
  PrivateBookingSource,
  PrivateBookingStatus,
  PrivateBookingsByTab,
  PrivateSessionBooking,
} from "./privateTypes";

type RawRecord = Record<string, any>;

const STATUS_LABELS: Record<string, string> = {
  pending_teacher: "قيد الانتظار",
  pending: "قيد الانتظار",
  accepted: "مقبولة",
  confirmed: "مؤكدة",
  cancelled: "ملغية",
  rejected: "مرفوضة",
  searching: "طلب تجربة",
  matched: "مقبولة",
  completed: "مكتملة",
};

const PRIVATE_ENDPOINT_BY_STATUS: Record<PrivateBookingStatus, string> = {
  pending_teacher: API_ENDPOINTS.PRIVATE.PENDING,
  accepted: API_ENDPOINTS.PRIVATE.ACCEPTED,
  cancelled: API_ENDPOINTS.PRIVATE.CANCELLED,
};

function asRecord(value: unknown): RawRecord {
  return value && typeof value === "object" ? (value as RawRecord) : {};
}

function asText(value: unknown, fallback: string): string {
  if (typeof value === "string" && value.trim().length > 0) {
    return value;
  }
  if (typeof value === "number") {
    return String(value);
  }
  return fallback;
}

function extractBookingArray(payload: unknown): unknown[] {
  const data = asRecord(payload).data;
  const nestedData = asRecord(data).data;

  if (Array.isArray(nestedData)) return nestedData;
  if (Array.isArray(data)) return data;
  if (Array.isArray(payload)) return payload;

  const deepNestedData = asRecord(nestedData).data;
  if (Array.isArray(deepNestedData)) return deepNestedData;

  return [];
}

function mapBooking(rawValue: unknown, source: PrivateBookingSource): PrivateSessionBooking {
  const raw = asRecord(rawValue);
  const student = asRecord(raw.student);
  const subject = asRecord(raw.subject);
  const packageInfo = asRecord(raw.package);
  const booking = asRecord(raw.booking);
  const cancelledBooking = asRecord(raw.cancelled_booking);
  const scheduleSource =
    Object.keys(booking).length > 0
      ? booking
      : Object.keys(cancelledBooking).length > 0
        ? cancelledBooking
        : raw;
  const backendId = asText(raw.id, "");
  const durationMinutes =
    scheduleSource.duration_minutes ??
    scheduleSource.durationMinutes ??
    raw.duration_minutes ??
    raw.durationMinutes ??
    raw.duration ??
    packageInfo.duration_minutes;
  const status = asText(
    raw.status,
    source === "trial_request"
      ? "searching"
      : source === "one_to_one_session"
        ? "pending"
        : "pending_teacher",
  );
  const statusFallback = source === "trial_request" ? "طلب تجربة" : STATUS_LABELS[status] ?? status;

  return {
    id: `${source}:${backendId}`,
    backendId,
    source,
    studentName: asText(
      student.student_name ?? student.name ?? raw.student_name ?? raw.studentName,
      "طالب",
    ),
    subject: asText(subject.name ?? raw.subject_name ?? raw.subjectName, "حصة فردية"),
    date: asText(
      scheduleSource.scheduled_date ?? raw.scheduled_date ?? raw.date,
      source === "trial_request" ? "طلب تجربة" : "غير محدد",
    ),
    time: asText(
      scheduleSource.start_time ?? raw.start_time ?? raw.time,
      source === "trial_request" ? "بانتظار القبول" : "غير محدد",
    ),
    duration: durationMinutes ? `${durationMinutes} دقيقة` : "غير محدد",
    status,
    statusLabel: asText(raw.status_label ?? raw.statusLabel, statusFallback),
    responseDeadline: raw.response_deadline ?? raw.responseDeadline ?? null,
    studentNotes: raw.student_notes ?? raw.studentNotes ?? null,
  };
}

async function getPrivateBookingsByStatus(
  status: PrivateBookingStatus,
): Promise<PrivateSessionBooking[]> {
  const { data } = await api.get(PRIVATE_ENDPOINT_BY_STATUS[status]);
  return extractBookingArray(data)
    .map((booking) => mapBooking(booking, "private_booking"))
    .filter((booking) => booking.backendId.length > 0);
}

async function getOneToOneSessions(endpoint: string): Promise<PrivateSessionBooking[]> {
  const { data } = await api.get(endpoint);
  return extractBookingArray(data)
    .map((booking) => mapBooking(booking, "one_to_one_session"))
    .filter((booking) => booking.backendId.length > 0);
}

async function getTrialRequests(endpoint: string): Promise<PrivateSessionBooking[]> {
  const { data } = await api.get(endpoint);
  return extractBookingArray(data)
    .map((booking) => mapBooking(booking, "trial_request"))
    .filter((booking) => booking.backendId.length > 0);
}

function getActionEndpoint(
  booking: PrivateSessionBooking,
  action: "accept" | "reject",
): string {
  if (booking.source === "one_to_one_session") {
    return action === "accept"
      ? API_ENDPOINTS.PRIVATE.ONE_TO_ONE_ACCEPT(booking.backendId)
      : API_ENDPOINTS.PRIVATE.ONE_TO_ONE_REJECT(booking.backendId);
  }

  if (booking.source === "trial_request") {
    return action === "accept"
      ? API_ENDPOINTS.PRIVATE.TRIAL_ACCEPT(booking.backendId)
      : API_ENDPOINTS.PRIVATE.TRIAL_DECLINE(booking.backendId);
  }

  return action === "accept"
    ? API_ENDPOINTS.PRIVATE.ACCEPT(booking.backendId)
    : API_ENDPOINTS.PRIVATE.REJECT(booking.backendId);
}

export const privateService = {
  async getAllBookings(): Promise<PrivateBookingsByTab> {
    const [
      pendingPrivate,
      acceptedPrivate,
      cancelledPrivate,
      pendingOneToOne,
      acceptedOneToOne,
      confirmedOneToOne,
      cancelledOneToOne,
      rejectedOneToOne,
      trialRequests,
      matchedTrials,
      cancelledTrials,
    ] = await Promise.all([
      getPrivateBookingsByStatus("pending_teacher"),
      getPrivateBookingsByStatus("accepted"),
      getPrivateBookingsByStatus("cancelled"),
      getOneToOneSessions(API_ENDPOINTS.PRIVATE.ONE_TO_ONE_PENDING),
      getOneToOneSessions(API_ENDPOINTS.PRIVATE.ONE_TO_ONE_ACCEPTED),
      getOneToOneSessions(API_ENDPOINTS.PRIVATE.ONE_TO_ONE_CONFIRMED),
      getOneToOneSessions(API_ENDPOINTS.PRIVATE.ONE_TO_ONE_CANCELLED),
      getOneToOneSessions(API_ENDPOINTS.PRIVATE.ONE_TO_ONE_REJECTED),
      getTrialRequests(API_ENDPOINTS.PRIVATE.TRIAL_REQUESTS),
      getTrialRequests(API_ENDPOINTS.PRIVATE.TRIAL_MATCHED),
      getTrialRequests(API_ENDPOINTS.PRIVATE.TRIAL_CANCELLED),
    ]);

    return {
      new: [...trialRequests, ...pendingOneToOne, ...pendingPrivate],
      accepted: [...matchedTrials, ...acceptedOneToOne, ...confirmedOneToOne, ...acceptedPrivate],
      cancelled: [...cancelledTrials, ...rejectedOneToOne, ...cancelledOneToOne, ...cancelledPrivate],
    };
  },

  async acceptBooking(booking: PrivateSessionBooking): Promise<void> {
    await api.post(getActionEndpoint(booking, "accept"));
  },

  async rejectBooking(booking: PrivateSessionBooking): Promise<void> {
    await api.post(getActionEndpoint(booking, "reject"));
  },
};
