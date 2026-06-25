import { EditGroupSheet } from "@/components/Ui/edit-group-sheet";
import { Colors } from "@/constants/colors";
import { AppDispatch, RootState } from "@/store";
import {
  fetchMessages,
  markGroupAsRead,
  sendMessage,
  uploadAttachment,
} from "@/store/community";
import type {
  ChatMember,
  ChatMessage,
} from "@/store/community/communityService";
import { communityService } from "@/store/community/communityService";
import { getPackageStyle } from "@/utils/package-factory";
import * as DocumentPicker from "expo-document-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowRight,
  CalendarDays,
  Edit2,
  MoreVertical,
  Paperclip,
  Send,
  Smile,
  Users,
  X,
} from "lucide-react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

const MEMBER_COLORS = ["#F29A52", "#4FC3C3", "#7B9FE0", "#E06B8B"];

const EMOJIS = [
  "😀",
  "😂",
  "😍",
  "😎",
  "🥰",
  "😊",
  "🤔",
  "😅",
  "😭",
  "😤",
  "👍",
  "👎",
  "❤️",
  "🔥",
  "🎉",
  "✅",
  "💯",
  "🙏",
  "👏",
  "🤝",
  "😴",
  "🤣",
  "😇",
  "🥳",
  "😜",
  "🤩",
  "😡",
  "😢",
  "😱",
  "🤯",
  "✨",
  "💪",
  "🎯",
  "📚",
  "⭐",
  "💡",
  "📝",
  "🕐",
  "📌",
  "🚀",
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatMsgTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("ar-EG", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateLabel(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diff = Math.floor(
    (now.setHours(0, 0, 0, 0) - d.setHours(0, 0, 0, 0)) / 86400000,
  );
  if (diff === 0) return "اليوم";
  if (diff === 1) return "امس";
  return new Date(iso).toLocaleDateString("ar-EG", {
    day: "numeric",
    month: "long",
  });
}

// ── Message item ──────────────────────────────────────────────────────────────
type DisplayMsg =
  | { kind: "date"; id: string; label: string }
  | { kind: "msg"; id: string; msg: ChatMessage; isOwn: boolean };

const MessageItem = React.memo(function MessageItem({
  item,
}: {
  item: DisplayMsg;
}) {
  if (item.kind === "date") {
    return (
      <View style={styles.dateChipWrap}>
        <View style={styles.dateChip}>
          <Text style={styles.dateChipText}>{item.label}</Text>
        </View>
      </View>
    );
  }
  const { msg, isOwn } = item;

  if (isOwn) {
    return (
      <View style={styles.ownWrap}>
        <Text style={styles.ownText}>{msg.content}</Text>
        <Text style={styles.ownMeta}>{formatMsgTime(msg.created_at)} ✓✓</Text>
      </View>
    );
  }

  const isTeacherRole = msg.sender.type === "teacher";
  const bubbleStyle = isTeacherRole
    ? styles.teacherBubble
    : styles.studentBubble;
  const avatarColor =
    MEMBER_COLORS[Math.abs(msg.sender.id) % MEMBER_COLORS.length];
  const initial = msg.sender.name?.[0] ?? "؟";
  return (
    <View style={styles.msgRow}>
      <View style={[styles.msgAvatar, { backgroundColor: avatarColor }]}>
        <Text style={styles.msgAvatarText}>{initial}</Text>
      </View>

      <View style={styles.msgContent}>
        <View style={styles.msgMeta}>
          <Text style={styles.msgSender}>{msg.sender.name}</Text>
          <Text style={styles.msgTime}>{formatMsgTime(msg.created_at)}</Text>
        </View>
        <View style={[styles.bubble, bubbleStyle]}>
          <Text style={styles.bubbleText}>{msg.content}</Text>
        </View>
      </View>
    </View>
  );
});

const ROLE_COLORS: Record<string, string> = { teacher: Colors.primary };

// ── Members Sheet ─────────────────────────────────────────────────────────────

function MembersSheet({
  visible,
  members,
  loading,
  onClose,
}: {
  visible: boolean;
  members: ChatMember[];
  loading: boolean;
  onClose: () => void;
}) {
  const { bottom } = useSafeAreaInsets();
  const translateY = useMemo(() => new Animated.Value(500), []);

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible ? 0 : 500,
      duration: visible ? 300 : 240,
      useNativeDriver: true,
    }).start();
  }, [visible, translateY]);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <Pressable style={styles.sheetOverlay} onPress={onClose} />
      <Animated.View
        style={[styles.membersSheet, { transform: [{ translateY }] }]}
      >
        <View style={styles.membersHandle} />
        <View style={styles.membersHeader}>
          <TouchableOpacity
            onPress={onClose}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <X size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.membersTitle}>أعضاء المجموعة</Text>
          <View style={{ width: 28 }} />
        </View>

        {loading ? (
          <ActivityIndicator style={{ marginTop: 40 }} color={Colors.primary} />
        ) : (
          <FlatList
            data={members}
            keyExtractor={(m) => String(m.id)}
            contentContainerStyle={{
              paddingBottom: 32 + bottom,
              paddingHorizontal: 16,
            }}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={styles.memberSep} />}
            ListEmptyComponent={
              <Text style={styles.membersEmpty}>لا يوجد أعضاء</Text>
            }
            renderItem={({ item }) => {
              const avatarBg =
                ROLE_COLORS[item.type ?? ""] ?? Colors.primaryLight;
              return (
                <View style={styles.memberRow}>
                  <View style={styles.memberInfo}>
                    {item.role ? (
                      <View style={styles.memberRoleBadge}>
                        <Text style={styles.memberRoleText}>{item.role}</Text>
                      </View>
                    ) : null}
                    <Text style={styles.memberName}>{item.name}</Text>
                  </View>
                  <View
                    style={[styles.memberAvatar, { backgroundColor: avatarBg }]}
                  >
                    <Text style={styles.memberAvatarText}>
                      {item.name?.[0] ?? "؟"}
                    </Text>
                  </View>
                </View>
              );
            }}
          />
        )}
      </Animated.View>
    </Modal>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────
export default function GroupChatScreen() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { groupId: groupIdParam, name } = useLocalSearchParams<{
    groupId: string;
    name: string;
  }>();
  const groupId = Number(groupIdParam);

  const myTeacherId = useSelector((state: RootState) => state.auth?.user?.id);
  const { messagesByGroup, messagesLoading, sending } = useSelector(
    (state: RootState) => state.community,
  );
  const rawMessages = useMemo(
    () => messagesByGroup[groupId] ?? [],
    [messagesByGroup, groupId],
  );

  const { bottom: safeBottom } = useSafeAreaInsets();
  const { image: SubjectIcon, bgColor } = getPackageStyle(name ?? "");
  const [input, setInput] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [editGroupSheetVisible, setEditGroupSheetVisible] = useState(false);
  const [membersSheetVisible, setMembersSheetVisible] = useState(false);
  const [members, setMembers] = useState<ChatMember[]>([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const menuAnim = useMemo(() => new Animated.Value(0), []);
  const listRef = useRef<FlatList>(null);
  const inputRef = useRef<TextInput>(null);

  const scrollToBottom = useCallback((animated = false) => {
    listRef.current?.scrollToEnd({ animated });
  }, []);

  useEffect(() => {
    if (groupId) {
      dispatch(fetchMessages({ groupId }));
      dispatch(markGroupAsRead(groupId));
    }
  }, [groupId, dispatch]);

  // Build display list: inject date dividers — memoized so typing/emoji state changes don't re-sort
  const listData = useMemo((): DisplayMsg[] => {
    const items: DisplayMsg[] = [];
    let lastDate = "";
    const sorted = [...rawMessages].sort((a, b) => a.id - b.id);
    for (const msg of sorted) {
      const dateKey = msg.created_at.slice(0, 10);
      if (dateKey !== lastDate) {
        lastDate = dateKey;
        items.push({
          kind: "date",
          id: `date-${dateKey}`,
          label: formatDateLabel(msg.created_at),
        });
      }
      items.push({
        kind: "msg",
        id: String(msg.id),
        msg,
        isOwn: msg.sender.id === myTeacherId,
      });
    }
    return items;
  }, [rawMessages, myTeacherId]);

  const renderMessage = useCallback(
    ({ item }: { item: DisplayMsg }) => <MessageItem item={item} />,
    [],
  );

  // Scroll only when a new message is appended — not on every re-render
  const prevMsgLen = useRef(0);
  useEffect(() => {
    if (listData.length > prevMsgLen.current) {
      scrollToBottom(true);
      prevMsgLen.current = listData.length;
    }
  }, [listData.length, scrollToBottom]);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || sending) return;
    setInput("");
    setShowEmojis(false);
    await dispatch(sendMessage({ groupId, content: text }));
    scrollToBottom(true);
  }, [input, sending, groupId, dispatch, scrollToBottom]);

  const handleEmojiPress = useCallback((emoji: string) => {
    setInput((prev) => prev + emoji);
    inputRef.current?.focus();
  }, []);

  const handleFilePick = useCallback(async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "*/*",
      copyToCacheDirectory: true,
    });
    if (result.canceled || !result.assets.length) return;
    const asset = result.assets[0];
    dispatch(
      uploadAttachment({
        groupId,
        fileUri: asset.uri,
        fileName: asset.name ?? "file",
        mimeType: asset.mimeType ?? "application/octet-stream",
      }),
    );
  }, [groupId, dispatch]);

  // ── Menu animation ────────────────────────────────────────────────────────
  useEffect(() => {
    Animated.timing(menuAnim, {
      toValue: menuVisible ? 1 : 0,
      duration: 140,
      useNativeDriver: true,
    }).start();
  }, [menuVisible, menuAnim]);

  const handleViewMembers = useCallback(async () => {
    setMenuVisible(false);
    setMembersSheetVisible(true);
    setMembersLoading(true);
    try {
      const data = await communityService.fetchMembers(groupId);
      setMembers(data);
    } catch {
      // handled by alertGateway
    } finally {
      setMembersLoading(false);
    }
  }, [groupId]);

  const handleEditGroup = useCallback(() => {
    setMenuVisible(false);
    setEditGroupSheetVisible(true);
  }, []);

  const menuActions = useMemo(
    () => [
      {
        key: "edit",
        label: "تعديل المجموعة",
        icon: Edit2,
        iconColor: Colors.primary,
        iconBg: Colors.primaryLight,
        onPress: handleEditGroup,
      },
      {
        key: "schedule",
        label: "عرض المواعيد",
        icon: CalendarDays,
        iconColor: "#7c3aed",
        iconBg: "#ede9fe",
        onPress: () => {},
      },
      {
        key: "members",
        label: "عرض الأعضاء",
        icon: Users,
        iconColor: Colors.success,
        iconBg: Colors.successBg,
        onPress: handleViewMembers,
      },
    ],
    [handleEditGroup, handleViewMembers],
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => setMenuVisible(true)}
        >
          <MoreVertical size={22} color={Colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerName} numberOfLines={1}>
            {name ?? "المجموعة"}
          </Text>
          <View style={styles.headerMembers}>
            {MEMBER_COLORS.map((color, i) => (
              <View
                key={i}
                style={[
                  styles.headerMemberDot,
                  { backgroundColor: color, marginRight: i === 0 ? 0 : -6 },
                ]}
              />
            ))}
          </View>
          <Text style={styles.headerLabel}>مجموعه الدرس</Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.shareBtn}
            onPress={() => router.back()}
          >
            <ArrowRight size={18} color={Colors.primary} />
          </TouchableOpacity>
          <View style={[styles.groupThumb, { backgroundColor: bgColor }]}>
            <SubjectIcon width={35} height={35} />
          </View>
        </View>
      </View>

      {/* ── Messages ── */}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        {messagesLoading && rawMessages.length === 0 ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator color={Colors.primary} />
          </View>
        ) : (
          <FlatList
            ref={listRef}
            data={listData}
            keyExtractor={(m) => m.id}
            renderItem={renderMessage}
            contentContainerStyle={styles.msgList}
            showsVerticalScrollIndicator={false}
            initialNumToRender={20}
            maxToRenderPerBatch={10}
            windowSize={10}
            removeClippedSubviews
            updateCellsBatchingPeriod={50}
            maintainVisibleContentPosition={{ minIndexForVisible: 0 }}
            onContentSizeChange={() =>
              listRef.current?.scrollToEnd({ animated: true })
            }
          />
        )}

        {/* ── Emoji picker panel ── */}
        {showEmojis && (
          <View style={styles.emojiPanel}>
            {EMOJIS.map((emoji) => (
              <TouchableOpacity
                key={emoji}
                style={styles.emojiItem}
                onPress={() => handleEmojiPress(emoji)}
                activeOpacity={0.7}
              >
                <Text style={styles.emojiChar}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* ── Input bar ── */}
        <View style={{ paddingBottom: safeBottom }}>
          <View style={styles.inputBar}>
            <TouchableOpacity
              style={[
                styles.sendBtn,
                (!input.trim() || sending) && styles.sendBtnDisabled,
              ]}
              onPress={handleSend}
              disabled={!input.trim() || sending}
            >
              {sending ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Send size={20} color="#fff" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.emojiBtn, showEmojis && styles.emojiBtnActive]}
              onPress={() => setShowEmojis((v) => !v)}
            >
              <Smile
                size={20}
                color={showEmojis ? Colors.primary : Colors.textSecondary}
              />
            </TouchableOpacity>

            <TextInput
              ref={inputRef}
              style={styles.textInput}
              value={input}
              onChangeText={setInput}
              placeholder="اكتب اي حاجه محتاجها"
              placeholderTextColor={Colors.textPlaceholder}
              textAlign="right"
              onSubmitEditing={handleSend}
              returnKeyType="send"
              onFocus={() => setShowEmojis(false)}
            />

            <TouchableOpacity onPress={handleFilePick} disabled={sending}>
              <Paperclip
                size={20}
                color={sending ? Colors.borderLight : Colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* ── Actions dropdown ── */}
      {menuVisible && (
        <Modal
          transparent
          visible
          animationType="none"
          onRequestClose={() => setMenuVisible(false)}
        >
          <Pressable
            style={styles.menuOverlay}
            onPress={() => setMenuVisible(false)}
          >
            <Animated.View
              style={[
                styles.menuDropdown,
                { opacity: menuAnim, transform: [{ scaleY: menuAnim }] },
              ]}
            >
              {menuActions.map((action, i) => {
                const Icon = action.icon;
                return (
                  <View key={action.key}>
                    {i > 0 && <View style={styles.menuSep} />}
                    <TouchableOpacity
                      style={styles.menuRow}
                      onPress={action.onPress}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.menuLabel}>{action.label}</Text>
                      <View
                        style={[
                          styles.menuIconWrap,
                          { backgroundColor: action.iconBg },
                        ]}
                      >
                        <Icon size={16} color={action.iconColor} />
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </Animated.View>
          </Pressable>
        </Modal>
      )}

      {/* ── Edit group sheet ── */}
      <EditGroupSheet
        visible={editGroupSheetVisible}
        groupId={groupId}
        groupName={name ?? ""}
        onClose={() => setEditGroupSheetVisible(false)}
      />

      {/* ── Members sheet ── */}
      <MembersSheet
        visible={membersSheetVisible}
        members={members}
        loading={membersLoading}
        onClose={() => setMembersSheetVisible(false)}
      />
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F0F0F0" },
  flex: { flex: 1 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    gap: 10,
  },
  headerBtn: { padding: 4 },
  headerCenter: { flex: 1, alignItems: "flex-end", gap: 4 },
  headerName: {
    fontSize: 13,
    fontFamily: "Alex_700",
    color: Colors.textPrimary,
    textAlign: "center",
  },
  headerMembers: { flexDirection: "row-reverse" },
  headerMemberDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: Colors.surface,
  },
  headerLabel: {
    fontSize: 11,
    fontFamily: "Alex_400",
    color: Colors.textSecondary,
  },
  headerRight: { flexDirection: "row-reverse", alignItems: "center", gap: 8 },
  groupThumb: {
    width: 60,
    height: 60,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    alignItems: "center",
    justifyContent: "center",
  },
  shareBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    borderColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
  },

  loadingWrap: { flex: 1, justifyContent: "center", alignItems: "center" },
  msgList: { padding: 16, gap: 16 },

  dateChipWrap: { alignItems: "center", marginVertical: 4 },
  dateChip: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  dateChipText: {
    fontSize: 12,
    fontFamily: "Alex_400",
    color: Colors.textSecondary,
  },

  msgRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  msgAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  msgAvatarText: { fontSize: 13, fontFamily: "Alex_700", color: "#fff" },
  msgContent: { flex: 1, alignItems: "flex-start", gap: 4 },
  msgMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  msgSender: {
    fontSize: 12,
    fontFamily: "Alex_700",
    color: Colors.textPrimary,
  },
  msgTime: {
    fontSize: 10,
    fontFamily: "Alex_400",
    color: Colors.textSecondary,
  },
  bubble: {
    maxWidth: "85%",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  teacherBubble: { backgroundColor: "#E2F5E2", borderTopLeftRadius: 4 },
  studentBubble: {
    backgroundColor: Colors.primaryLight,
    borderTopLeftRadius: 4,
  },
  bubbleText: {
    fontSize: 13,
    fontFamily: "Alex_400",
    color: Colors.textPrimary,
    textAlign: "right",
    lineHeight: 20,
  },

  ownWrap: { alignItems: "flex-end", gap: 4, paddingLeft: 4 },
  ownText: {
    fontSize: 13,
    fontFamily: "Alex_400",
    color: Colors.textPrimary,
    textAlign: "right",
    maxWidth: "90%",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderTopRightRadius: 0,
    lineHeight: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  ownMeta: {
    fontSize: 11,
    fontFamily: "Alex_400",
    color: Colors.textSecondary,
  },

  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginHorizontal: 12,
    marginVertical: 10,
    gap: 10,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnDisabled: { opacity: 0.5 },
  emojiBtn: { padding: 4, borderRadius: 8 },
  emojiBtnActive: { backgroundColor: Colors.primaryLight },
  textInput: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Alex_400",
    color: Colors.textPrimary,
    paddingVertical: 0,
  },

  emojiPanel: {
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 4,
  },
  emojiItem: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  emojiChar: { fontSize: 26 },

  // ── Actions dropdown ──────────────────────────────────
  menuOverlay: {
    flex: 1,
  },
  menuDropdown: {
    position: "absolute",
    top: 64,
    left: 12,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    minWidth: 210,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
    overflow: "hidden",
    transformOrigin: "top left",
  } as any,
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  menuLabel: {
    flex: 1,
    fontFamily: "Alex_500",
    fontSize: 14,
    color: Colors.textPrimary,
    textAlign: "right",
  },
  menuIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  menuSep: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginHorizontal: 16,
  },

  // ── Members sheet ─────────────────────────────────────
  sheetOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  membersSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "70%",
    paddingTop: 12,
  },
  membersHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E0E0E0",
    alignSelf: "center",
    marginBottom: 12,
  },
  membersHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  membersTitle: {
    fontFamily: "Alex_700",
    fontSize: 16,
    color: Colors.textPrimary,
  },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingVertical: 12,
    gap: 12,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  memberAvatarText: { fontFamily: "Alex_700", fontSize: 15, color: "#fff" },
  memberInfo: { flex: 1, alignItems: "flex-end", gap: 3 },
  memberName: {
    fontFamily: "Alex_600",
    fontSize: 14,
    color: Colors.textPrimary,
    textAlign: "right",
  },
  memberRoleBadge: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  memberRoleText: {
    fontFamily: "Alex_500",
    fontSize: 11,
    color: Colors.primary,
  },
  memberSep: { height: 1, backgroundColor: Colors.borderLight },
  membersEmpty: {
    fontFamily: "Alex_400",
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: 40,
  },
});
