import { Colors } from "@/constants/colors";
import { getPackageStyle } from "@/utils/package-factory";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowRight,
  Mic,
  MoreVertical,
  Paperclip,
  Smile,
} from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ── Types ─────────────────────────────────────────────────────────────────────
type MsgType = "teacher" | "student" | "own" | "date";

interface Message {
  id: string;
  type: MsgType;
  sender?: string;
  time?: string;
  text: string;
}

// ── Mock data ─────────────────────────────────────────────────────────────────
const MEMBER_COLORS = ["#F29A52", "#4FC3C3", "#7B9FE0", "#E06B8B"];

const MESSAGES: Message[] = [
  { id: "d1", type: "date", text: "اليوم , 22 يناير" },
  {
    id: "1",
    type: "teacher",
    sender: "استاذ احمد حسن",
    time: "08:10 صباحا",
    text: "ازيكوا ياولاد عاملين ايه في الحصه والدروس يارب تكونوا كويسين",
  },
  {
    id: "2",
    type: "student",
    sender: "نوران احمد",
    time: "08:10 صباحا",
    text: "تمام يا مستر",
  },
  {
    id: "3",
    type: "own",
    time: "08:12 AM",
    text: "الحمد لله يا مستر كله تمام والواجب كمان تمام شكرا",
  },
  {
    id: "4",
    type: "teacher",
    sender: "استاذ احمد حسن",
    time: "08:10 صباحا",
    text: "ازيكوا ياولاد عاملين ايه في الحصه والدروس يارب تكونوا كويسين",
  },
  {
    id: "5",
    type: "student",
    sender: "نوران احمد",
    time: "08:10 صباحا",
    text: "تمام يا مستر كويسين والحصه تمام",
  },
  {
    id: "6",
    type: "student",
    sender: "نوران احمد",
    time: "08:10 صباحا",
    text: "تمام يا مستر كويسين والحصه تمام",
  },
];

// ── Message bubble ────────────────────────────────────────────────────────────
function MessageItem({ msg }: { msg: Message }) {
  if (msg.type === "date") {
    return (
      <View style={styles.dateChipWrap}>
        <View style={styles.dateChip}>
          <Text style={styles.dateChipText}>{msg.text}</Text>
        </View>
      </View>
    );
  }

  if (msg.type === "own") {
    return (
      <View style={styles.ownWrap}>
        <Text style={styles.ownText}>{msg.text}</Text>
        <Text style={styles.ownMeta}>{msg.time} ✓✓</Text>
      </View>
    );
  }

  const isTeacher = msg.type === "teacher";
  const bubbleStyle = isTeacher ? styles.teacherBubble : styles.studentBubble;
  const avatarColor = isTeacher ? "#4A6FA5" : MEMBER_COLORS[1];

  return (
    <View style={styles.msgRow}>
      {/* Avatar */}
      <View style={[styles.msgAvatar, { backgroundColor: avatarColor }]}>
        <Text style={styles.msgAvatarText}>
          {msg.sender ? msg.sender[0] : "؟"}
        </Text>
      </View>

      <View style={styles.msgContent}>
        {/* Sender + time */}
        <View style={styles.msgMeta}>
          <Text style={styles.msgSender}>{msg.sender}</Text>
          <Text style={styles.msgTime}>{msg.time}</Text>
        </View>
        {/* Bubble */}
        <View style={[styles.bubble, bubbleStyle]}>
          <Text style={styles.bubbleText}>{msg.text}</Text>
        </View>
      </View>
    </View>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────
export default function GroupChatScreen() {
  const router = useRouter();
  const { name, subject } = useLocalSearchParams<{
    name: string;
    subject: string;
  }>();
  const { image: SubjectIcon, bgColor } = getPackageStyle(subject ?? "");
  const [input, setInput] = useState("");
  const listRef = useRef<FlatList>(null);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* ── Header ── */}
      <View style={styles.header}>
        {/* Left: menu */}
        <TouchableOpacity style={styles.headerBtn}>
          <MoreVertical size={22} color={Colors.textPrimary} />
        </TouchableOpacity>

        {/* Center: name + members + label */}
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
                  {
                    backgroundColor: color,
                    marginRight: i === 0 ? 0 : -6,
                  },
                ]}
              />
            ))}
          </View>
          <Text style={styles.headerLabel}>مجموعه الدرس</Text>
        </View>

        {/* Right: group image + share */}
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

      {/* Current user indicator */}
      {/* <View style={styles.currentUser}>
        <View style={styles.currentUserAvatar}>
          <Text style={styles.currentUserAvatarText}>أ</Text>
        </View>
        <Text style={styles.currentUserName}>أ . احمد حسن</Text>
      </View> */}

      {/* ── Messages ── */}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={listRef}
          data={MESSAGES}
          keyExtractor={(m) => m.id}
          renderItem={({ item }) => <MessageItem msg={item} />}
          contentContainerStyle={styles.msgList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            listRef.current?.scrollToEnd({ animated: false })
          }
        />

        {/* ── Input bar ── */}
        <View style={styles.inputBar}>
          <TouchableOpacity style={styles.micBtn}>
            <Mic size={20} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.emojiBtn}>
            <Smile size={20} color={Colors.textSecondary} />
          </TouchableOpacity>

          <TextInput
            style={styles.textInput}
            value={input}
            onChangeText={setInput}
            placeholder="اكتب اي حاجه محتاجها"
            placeholderTextColor={Colors.textPlaceholder}
            textAlign="right"
          />

          <TouchableOpacity>
            <Paperclip size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F0F0F0" },
  flex: { flex: 1 },

  // ── Header ───────────────────────────────────────────
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
  headerMembers: {
    flexDirection: "row-reverse",
  },
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
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    alignItems: "center",
    justifyContent: "center",
  },
  groupThumbText: { fontSize: 22 },
  shareBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    borderColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
  },

  // ── Current user ──────────────────────────────────────
  currentUser: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  currentUserAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  currentUserAvatarText: {
    fontSize: 13,
    fontFamily: "Alex_700",
    color: "#fff",
  },
  currentUserName: {
    fontSize: 13,
    fontFamily: "Alex_600",
    color: Colors.textPrimary,
  },

  // ── Message list ──────────────────────────────────────
  msgList: { padding: 16, gap: 16 },

  // Date chip
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

  // Teacher / student bubble
  msgRow: {
    flexDirection: "row-reverse",
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
  msgContent: { flex: 1, alignItems: "flex-end", gap: 4 },
  msgMeta: {
    flexDirection: "row-reverse",
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
  teacherBubble: {
    backgroundColor: "#E2F5E2",
    borderTopRightRadius: 4,
  },
  studentBubble: {
    backgroundColor: Colors.primaryLight,
    borderTopRightRadius: 4,
  },
  bubbleText: {
    fontSize: 13,
    fontFamily: "Alex_400",
    color: Colors.textPrimary,
    textAlign: "right",
    lineHeight: 20,
  },

  // Own message
  ownWrap: {
    alignItems: "flex-start",

    gap: 4,
    paddingRight: 4,
  },
  ownText: {
    fontSize: 13,
    fontFamily: "Alex_400",
    color: Colors.textPrimary,
    textAlign: "right",
    maxWidth: "90%",
    backgroundColor: "#fff",
    borderRadius: 12,
    lineHeight: 20,
    borderTopLeftRadius: 0,
    // maxWidth: "85%",
    // borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  ownMeta: {
    fontSize: 11,
    fontFamily: "Alex_400",
    color: Colors.textSecondary,
  },

  // ── Input bar ─────────────────────────────────────────
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    // borderTopWidth: 1,
    borderRadius: 14,
    borderTopColor: Colors.borderLight,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginHorizontal: 12,
    marginVertical: 10,
    gap: 10,
  },
  micBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  emojiBtn: { padding: 4 },
  textInput: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Alex_400",
    color: Colors.textPrimary,
    paddingVertical: 0,
  },
});
