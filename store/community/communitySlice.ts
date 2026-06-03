import type {
  ChatGroup,
  ChatMessage,
} from "@/store/community/communityService";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CommunityState {
  groups: ChatGroup[];
  groupsLoading: boolean;
  groupsError: string | null;

  messagesByGroup: Record<number, ChatMessage[]>;
  hasMoreByGroup: Record<number, boolean>;
  messagesLoading: boolean;
  messagesError: string | null;

  sending: boolean;
}

const initialState: CommunityState = {
  groups: [],
  groupsLoading: false,
  groupsError: null,

  messagesByGroup: {},
  hasMoreByGroup: {},
  messagesLoading: false,
  messagesError: null,

  sending: false,
};

const communitySlice = createSlice({
  name: "community",
  initialState,
  reducers: {
    setGroups(state, action: PayloadAction<ChatGroup[]>) {
      state.groups = action.payload;
    },
    setGroupsLoading(state, action: PayloadAction<boolean>) {
      state.groupsLoading = action.payload;
    },
    setGroupsError(state, action: PayloadAction<string | null>) {
      state.groupsError = action.payload;
    },

    setMessages(
      state,
      action: PayloadAction<{
        groupId: number;
        messages: ChatMessage[];
        hasMore: boolean;
        prepend?: boolean;
      }>,
    ) {
      const { groupId, messages, hasMore, prepend } = action.payload;
      if (prepend) {
        state.messagesByGroup[groupId] = [
          ...messages,
          ...(state.messagesByGroup[groupId] ?? []),
        ];
      } else {
        state.messagesByGroup[groupId] = messages;
      }
      state.hasMoreByGroup[groupId] = hasMore;
    },
    appendMessage(
      state,
      action: PayloadAction<{ groupId: number; message: ChatMessage }>,
    ) {
      const { groupId, message } = action.payload;
      if (!state.messagesByGroup[groupId]) {
        state.messagesByGroup[groupId] = [];
      }
      state.messagesByGroup[groupId].push(message);
    },
    setMessagesLoading(state, action: PayloadAction<boolean>) {
      state.messagesLoading = action.payload;
    },
    setMessagesError(state, action: PayloadAction<string | null>) {
      state.messagesError = action.payload;
    },
    setSending(state, action: PayloadAction<boolean>) {
      state.sending = action.payload;
    },
    decrementUnread(state, action: PayloadAction<number>) {
      const group = state.groups.find((g) => g.id === action.payload);
      if (group) group.unread_count = 0;
    },
  },
});

export const {
  setGroups,
  setGroupsLoading,
  setGroupsError,
  setMessages,
  appendMessage,
  setMessagesLoading,
  setMessagesError,
  setSending,
  decrementUnread,
} = communitySlice.actions;

export default communitySlice.reducer;
