import { api } from "./api";

export type InboxNotification = {
  id: string;
  type: string;
  data: { title: string; body: string; [key: string]: unknown };
  read_at: string | null;
  created_at: string;
};

export type InboxResponse = {
  notifications: InboxNotification[];
  lastPage: number;
};

export const notificationsService = {
  async getInbox(page = 1): Promise<InboxResponse> {
    const { data } = await api.get("/teachers/notifications", {
      params: { page },
    });
    const raw = data?.data ?? data;
    const items: InboxNotification[] = Array.isArray(raw?.data)
      ? raw.data
      : Array.isArray(raw)
        ? raw
        : [];
    const lastPage: number =
      raw?.last_page ?? raw?.meta?.last_page ?? 1;
    return { notifications: items, lastPage };
  },

  async getUnreadCount(): Promise<number> {
    const { data } = await api.get("/teachers/notifications/unread-count");
    return data?.data?.count ?? data?.count ?? 0;
  },

  async markAsRead(id: string): Promise<void> {
    await api.post(`/teachers/notifications/${id}/read`);
  },

  async markAllAsRead(): Promise<void> {
    await api.post("/teachers/notifications/read-all");
  },
};
