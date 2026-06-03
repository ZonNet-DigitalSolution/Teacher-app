import { api } from "../../services/api";

const BASE = "/teachers/chat";

export type ChatGroup = {
  id: number;
  name: string;
  room_type: string;
  is_active: boolean;
  is_chat_enabled: boolean;
  member_count: number;
  unread_count: number;
  latest_message?: {
    content: string;
    created_at: string;
    sender?: { name: string };
  } | null;
};

export type ChatSender = {
  id: number;
  name: string;
  avatar?: string | null;
  type?: string;
};

export type ChatMessage = {
  id: number;
  content: string;
  message_type: string;
  sender: ChatSender;
  reply_to?: { id: number; content: string; sender: ChatSender } | null;
  attachments: any[];
  reactions: any[];
  is_edited: boolean;
  created_at: string;
};

export type ChatMember = {
  id: number;
  name: string;
  type: string;
  role?: string;
  avatar?: string | null;
  is_online?: boolean;
};

export const communityService = {
  async fetchGroups(): Promise<ChatGroup[]> {
    const { data } = await api.get(`${BASE}/groups`);
    return data?.data ?? [];
  },

  async fetchMessages(
    groupId: number,
    beforeId?: number,
    limit = 50,
  ): Promise<{ messages: ChatMessage[]; hasMore: boolean }> {
    const params: Record<string, any> = { limit };
    if (beforeId) params.before_id = beforeId;
    const { data } = await api.get(`${BASE}/groups/${groupId}/messages`, {
      params,
    });
    return {
      messages: data?.data ?? [],
      hasMore: data?.meta?.has_more ?? false,
    };
  },

  async sendMessage(
    groupId: number,
    content: string,
    type = "text",
    replyToId?: number,
  ): Promise<ChatMessage> {
    const body: Record<string, any> = { type, content };
    if (replyToId) body.reply_to_id = replyToId;
    const { data } = await api.post(`${BASE}/groups/${groupId}/messages`, body);
    return data?.data ?? data;
  },

  async markAsRead(groupId: number): Promise<void> {
    await api.post(`${BASE}/groups/${groupId}/read`);
  },

  async updateGroup(
    groupId: number,
    payload: {
      name?: string;
      details?: string;
      is_review?: boolean;
      avatarUri?: string;
      avatarName?: string;
    },
  ): Promise<any> {
    const formData = new FormData();
    formData.append("_method", "PUT");
    if (payload.name) formData.append("name", payload.name);
    if (payload.details !== undefined)
      formData.append("details", payload.details);
    if (payload.is_review !== undefined)
      formData.append("is_review", payload.is_review ? "1" : "0");
    if (payload.avatarUri) {
      formData.append("avatar", {
        uri: payload.avatarUri,
        name: payload.avatarName ?? "avatar.jpg",
        type: "image/jpeg",
      } as any);
    }
    const res = await api.post(`/teachers/groups/${groupId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data?.data ?? res.data;
  },

  async fetchMembers(groupId: number): Promise<ChatMember[]> {
    const { data } = await api.get(`${BASE}/groups/${groupId}/members`);
    return data?.data ?? [];
  },

  async uploadAttachment(
    groupId: number,
    fileUri: string,
    fileName: string,
    mimeType: string,
  ): Promise<ChatMessage> {
    const formData = new FormData();
    formData.append("files[]", {
      uri: fileUri,
      name: fileName,
      type: mimeType,
    } as any);
    const isImage = mimeType.startsWith("image/");
    formData.append("type", isImage ? "images" : "file");
    const { data } = await api.post(
      `${BASE}/groups/${groupId}/upload`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return data?.data ?? data;
  },
};
