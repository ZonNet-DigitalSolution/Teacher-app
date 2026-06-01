export type LessonStatus = "live" | "upcoming" | "done";
export type ScheduleView = "daily" | "weekly";

export const VIEW_OPTIONS: { value: ScheduleView; label: string }[] = [
  { value: "daily", label: "يومي" },
  { value: "weekly", label: "أسبوعي" },
];

export type Lesson = {
  id: string;
  date: string; // "YYYY-MM-DD"
  subject: string;
  grade: string;
  lessonTitle: string;
  group: string;
  time: string;
  endTime: string;
  status: LessonStatus;
  remaining?: string;
  hasContent?: boolean;
  sessionLink?: string;
  groupId?: number;
};

export type Day = {
  date: string; // "YYYY-MM-DD"
  name: string;
  num: number;
  month: string;
  isToday: boolean;
};

// ─── API Types (from scheduleRepo) ────────────────────────────────────────────

export type APISession = {
  id: number;
  name: string | null;
  date: string;
  start_time: string;
  subject: string;
  group_id: number;
  group_names: string[];
  session_link: string;
  teacher_status: string | null;
  status:
    | "active"
    | "postponed"
    | "postpand"
    | "alternate"
    | "canceled"
    | string;
  has_alternative_session: boolean;
  alternate_session: unknown | null;
  class_names?: string[] | string | null;
  whatsapp_link?: string | null;
  has_content?: boolean;
  parent_session?: {
    id: number;
    name: string | null;
    start_time: string;
    date: string;
    status: string;
  } | null;
};

export type SessionsResponse = {
  success: boolean;
  data: APISession[];
};

export interface ScheduleState {
  sessions: APISession[];
  daySessions: Record<string, APISession[]>; // keyed by "YYYY-MM-DD"
  selectedDate: string;
  isLoading: boolean;
  error: string | null;

  // Add Sessions form
  addGroups: GroupItem[];
  addSubjects: SubjectItem[];
  addGroupsLoading: boolean;
  sessionCount: number | null;
  sessionCountLoading: boolean;
  creating: boolean;
}

export type SubjectItem = {
  id: number;
  name: string;
};

export type GroupItem = {
  id: number;
  name: string;
  time: string | null;
  is_special: 0 | 1;
  classes?: string[];
  type?: string;
  status?: string;
  package_name?: string;
  package_id?: number;
  student_count?: number;
  country_name?: string;
  country_code?: string;
};

export type DayTimeSelection = {
  day: string;
  start_time: string;
};

export type CreateSessionPayload = {
  group_id: string;
  subject_id: string;
  is_special: boolean;
  days: string[] | DayTimeSelection[];
};
