import { API_ENDPOINTS } from "@/constants/endpoints";
import { api } from "@/services/api";
import type {
  PrivateBookingStatus,
  PrivateBookingsByTab,
  PrivateSessionBooking,
} from "./privateTypes";

type RawRecord = Record<string, any>;

const STATUS_LABELS: Record<string, string> = {
  pending_teacher: "قيد الانتظار",
  accepted: "مقبولة",
  cancelled: "ملغية",
};

const ENDPOINT_BY_STATUS: Record<PrivateBookingStatus, string> = {
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

function mapBooking(rawValue: unknown): PrivateSessionBooking {
  const raw = asRecord(rawValue);
  const student = asRecord(raw.student);
  const subject = asRecord(raw.subject);
  const durationMinutes = raw.duration_minutes ?? raw.durationMinutes ?? raw.duration;
  const status = asText(raw.status, "pending_teacher");

  return {
    id: asText(raw.id, ""),
    studentName: asText(
      student.student_name ?? student.name ?? raw.student_name ?? raw.studentName,
      "طالب",
    ),
    subject: asText(subject.name ?? raw.subject_name ?? raw.subjectName, "حصة فردية"),
    date: asText(raw.scheduled_date ?? raw.date, "غير محدد"),
    time: asText(raw.start_time ?? raw.time, "غير محدد"),
    duration: durationMinutes ? `${durationMinutes} دقيقة` : "غير محدد",
    status,
    statusLabel: asText(raw.status_label ?? raw.statusLabel, STATUS_LABELS[status] ?? status),
    responseDeadline: raw.response_deadline ?? raw.responseDeadline ?? null,
    studentNotes: raw.student_notes ?? raw.studentNotes ?? null,
  };
}

async function getBookingsByStatus(
  status: PrivateBookingStatus,
): Promise<PrivateSessionBooking[]> {
  const { data } = await api.get(ENDPOINT_BY_STATUS[status]);
  return extractBookingArray(data)
    .map(mapBooking)
    .filter((booking) => booking.id.length > 0);
}

export const privateService = {
  async getAllBookings(): Promise<PrivateBookingsByTab> {
    const [pending, accepted, cancelled] = await Promise.all([
      getBookingsByStatus("pending_teacher"),
      getBookingsByStatus("accepted"),
      getBookingsByStatus("cancelled"),
    ]);

    return {
      new: pending,
      accepted,
      cancelled,
    };
  },

  async acceptBooking(id: string): Promise<void> {
    await api.post(API_ENDPOINTS.PRIVATE.ACCEPT(id));
  },

  async rejectBooking(id: string): Promise<void> {
    await api.post(API_ENDPOINTS.PRIVATE.REJECT(id));
  },
};
