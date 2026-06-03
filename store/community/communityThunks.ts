import { normalizeError } from "@/services/api";
import { communityService } from "@/store/community/communityService";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  appendMessage,
  decrementUnread,
  setGroups,
  setGroupsError,
  setGroupsLoading,
  setMessages,
  setMessagesError,
  setMessagesLoading,
  setSending,
} from "./communitySlice";

export const fetchGroups = createAsyncThunk(
  "community/fetchGroups",
  async (_, { dispatch }) => {
    try {
      dispatch(setGroupsLoading(true));
      dispatch(setGroupsError(null));
      const groups = await communityService.fetchGroups();
      dispatch(setGroups(groups));
      return groups;
    } catch (err) {
      dispatch(setGroupsError(normalizeError(err)));
    } finally {
      dispatch(setGroupsLoading(false));
    }
  },
);

export const fetchMessages = createAsyncThunk(
  "community/fetchMessages",
  async (
    { groupId, beforeId }: { groupId: number; beforeId?: number },
    { dispatch },
  ) => {
    try {
      dispatch(setMessagesLoading(true));
      dispatch(setMessagesError(null));
      const { messages, hasMore } = await communityService.fetchMessages(
        groupId,
        beforeId,
      );
      dispatch(
        setMessages({ groupId, messages, hasMore, prepend: !!beforeId }),
      );
      return { messages, hasMore };
    } catch (err) {
      dispatch(setMessagesError(normalizeError(err)));
    } finally {
      dispatch(setMessagesLoading(false));
    }
  },
);

export const sendMessage = createAsyncThunk(
  "community/sendMessage",
  async (
    {
      groupId,
      content,
      replyToId,
    }: { groupId: number; content: string; replyToId?: number },
    { dispatch },
  ) => {
    try {
      dispatch(setSending(true));
      const message = await communityService.sendMessage(
        groupId,
        content,
        "text",
        replyToId,
      );
      dispatch(appendMessage({ groupId, message }));
      return message;
    } catch (err) {
      throw err;
    } finally {
      dispatch(setSending(false));
    }
  },
);

export const uploadAttachment = createAsyncThunk(
  "community/uploadAttachment",
  async (
    {
      groupId,
      fileUri,
      fileName,
      mimeType,
    }: { groupId: number; fileUri: string; fileName: string; mimeType: string },
    { dispatch },
  ) => {
    try {
      dispatch(setSending(true));
      const message = await communityService.uploadAttachment(
        groupId,
        fileUri,
        fileName,
        mimeType,
      );
      dispatch(appendMessage({ groupId, message }));
      return message;
    } catch (err) {
      throw err;
    } finally {
      dispatch(setSending(false));
    }
  },
);

export const markGroupAsRead = createAsyncThunk(
  "community/markAsRead",
  async (groupId: number, { dispatch }) => {
    try {
      await communityService.markAsRead(groupId);
      dispatch(decrementUnread(groupId));
    } catch {
      // non-critical — ignore silently
    }
  },
);
