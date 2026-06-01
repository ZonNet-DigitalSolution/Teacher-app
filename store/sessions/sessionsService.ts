import { api } from '@/services/api';
import { API_ENDPOINTS } from '@/constants/endpoints';
import type { SessionsResponse } from '@/types/schedule.types';

export const sessionsService = {
  async getWeekSessions(): Promise<SessionsResponse> {
    const { data } = await api.get<SessionsResponse>(`${API_ENDPOINTS.SCHEDULE.SESSIONS}?weekFlag=1`);
    return data;
  },

  async getDaySessions(isoDate: string): Promise<SessionsResponse> {
    const { data } = await api.get<SessionsResponse>(
      `${API_ENDPOINTS.SCHEDULE.SESSIONS}?date=${encodeURIComponent(isoDate)}&_ts=${Date.now()}`,
    );
    return data;
  },
};
