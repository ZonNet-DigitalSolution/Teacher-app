import { api } from '@/services/api';
import { API_ENDPOINTS } from '@/constants/endpoints';
import type { SessionsResponse, GroupItem, SubjectItem, CreateSessionPayload } from '@/types/schedule.types';

function toApiDateFormat(isoDate: string): string {
  const [y, m, d] = isoDate.split('-');
  return `${d}/${m}/${y}`;
}

export const sessionsService = {
  async getWeekSessions(): Promise<SessionsResponse> {
    const { data } = await api.get<SessionsResponse>(`${API_ENDPOINTS.SCHEDULE.SESSIONS}?weekFlag=1`);
    return data;
  },

  async getDaySessions(isoDate: string): Promise<SessionsResponse> {
    const formatted = toApiDateFormat(isoDate);
    const { data } = await api.get<SessionsResponse>(
      `${API_ENDPOINTS.SCHEDULE.SESSIONS}?date=${encodeURIComponent(formatted)}&_ts=${Date.now()}`,
    );
    return data;
  },

  async fetchGroupsAndSubjects(): Promise<{ groups: GroupItem[]; subjects: SubjectItem[] }> {
    const { data } = await api.get(API_ENDPOINTS.GROUPS.LIST);
    const groups: GroupItem[] = Array.isArray(data?.data?.groups) ? data.data.groups : [];
    const subjects: SubjectItem[] = Array.isArray(data?.data?.subjects) ? data.data.subjects : [];
    return { groups, subjects };
  },

  async getSessionCount(groupId: number, subjectId: number): Promise<number> {
    const { data } = await api.get(
      `/teachers/sessions/group/${groupId}/subject/${subjectId}/number-of-sessions`,
    );
    return data?.data?.number_of_sessions ?? data?.number_of_sessions ?? 0;
  },

  async createSession(payload: CreateSessionPayload): Promise<any> {
    const { data } = await api.post(API_ENDPOINTS.SCHEDULE.SESSIONS, payload);
    return data?.data ?? data;
  },
};
