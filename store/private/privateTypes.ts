export interface SessionRequest {
  id: number;
  student: {
    id: number;
    name: string;
    avatar?: string;
  };
  subject: string;
  requested_date: string;   // ISO date string  e.g. "2026-06-20"
  requested_time: string;   // HH:MM            e.g. "10:00"
  duration_minutes: number;
  price: number;
  status: 'pending' | 'accepted' | 'rejected';
  message?: string;
  created_at: string;
}

export interface UpcomingPrivateSession {
  id: number;
  student: {
    id: number;
    name: string;
    avatar?: string;
  };
  subject: string;
  date: string;
  time: string;
  duration_minutes: number;
  join_link?: string;
}
