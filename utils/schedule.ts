import type {
  APISession,
  Day,
  Lesson,
  LessonStatus,
} from "@/types/schedule.types";

// ─── Arabic labels ────────────────────────────────────────────────────────────

const ARABIC_DAY_NAMES = [
  "الأحد",
  "الاثنين",
  "الثلاثاء",
  "الأربعاء",
  "الخميس",
  "الجمعة",
  "السبت",
];
const ARABIC_MONTHS = [
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
];

// ─── Day generation ───────────────────────────────────────────────────────────

/**
 * Returns 13 days: 6 past + today (index 6) + 6 future.
 */
export function generateDays(): Day[] {
  const today = new Date();
  return Array.from({ length: 13 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - 6 + i);
    return {
      date: d.toISOString().split("T")[0],
      name: ARABIC_DAY_NAMES[d.getDay()],
      num: d.getDate(),
      month: ARABIC_MONTHS[d.getMonth()],
      isToday: i === 6,
    };
  });
}

// ─── Time helpers ─────────────────────────────────────────────────────────────

export function formatTime(timeStr: string): string {
  if (!timeStr) return "";
  const [hStr, mStr] = timeStr.split(":");
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  if (isNaN(h)) return timeStr;
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${h >= 12 ? "م" : "ص"}`;
}

function addMinutes(timeStr: string, minutes: number): string {
  if (!timeStr) return "";
  const [hStr, mStr] = timeStr.split(":");
  const total = parseInt(hStr, 10) * 60 + parseInt(mStr, 10) + minutes;
  const h = Math.floor(total / 60) % 24;
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function getRemainingMinutes(dateISO: string, startTime: string): number {
  const [y, mo, d] = dateISO.split("-").map(Number);
  const [h, mi] = startTime.split(":").map(Number);
  const sessionStart = new Date(y, mo - 1, d, h, mi);
  return Math.round((sessionStart.getTime() - Date.now()) / 60000);
}

function formatRemaining(minutes: number): string {
  if (minutes <= 0) return "";
  if (minutes < 60) return `${minutes} دقيقة`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const hLabel = h === 1 ? "ساعة" : `${h} ساعات`;
  return m === 0 ? hLabel : `${hLabel} و ${m} دقيقة`;
}

// ─── APISession → Lesson ──────────────────────────────────────────────────────

function deriveStatus(session: APISession): LessonStatus {
  const { status, start_time } = session;
  const date = session.date.split("T")[0];

  if (status === "canceled" || status === "postponed" || status === "postpand")
    return "done";

  const todayISO = new Date().toISOString().split("T")[0];
  if (date < todayISO) return "done";

  if (date === todayISO && start_time) {
    const remaining = getRemainingMinutes(date, start_time);
    if (remaining <= 0 && remaining > -120) return "live";
    if (remaining <= 0) return "done";
  }

  return "upcoming";
}

export function mapSession(session: APISession): Lesson {
  const date = session.date.split("T")[0];
  const status = deriveStatus(session);
  const todayISO = new Date().toISOString().split("T")[0];
  const remainingMins =
    status === "upcoming" && date === todayISO
      ? getRemainingMinutes(date, session.start_time)
      : 0;

  const grade = Array.isArray(session.class_names)
    ? session.class_names.join("، ")
    : (session.class_names ?? "");
  return {
    id: String(session.id),
    date,
    subject: session.subject,
    grade,
    lessonTitle: session.name ?? "",
    group: session.group_names[0] || "غير معرف",
    time: formatTime(session.start_time),
    endTime: formatTime(addMinutes(session.start_time, 60)), //
    status,
    remaining: remainingMins > 0 ? formatRemaining(remainingMins) : undefined,
    hasContent: session.has_content ?? false,
    sessionLink: session.session_link,
    groupId: session.group_id,
  };
}

// ─── Group sessions by date ───────────────────────────────────────────────────

export function groupByDate(
  sessions: APISession[],
): Record<string, APISession[]> {
  return sessions.reduce<Record<string, APISession[]>>((acc, s) => {
    const key = s.date.split("T")[0];
    if (!acc[key]) acc[key] = [];
    acc[key].push(s);
    return acc;
  }, {});
}
