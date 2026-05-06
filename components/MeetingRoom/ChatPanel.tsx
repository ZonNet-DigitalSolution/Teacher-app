import { Paperclip, Send, Smile, X } from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  id: number;
  sender: string;
  role?: "teacher" | "student";
  text: string;
  time: string;
  isMe: boolean;
  avatar?: string | null;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_MESSAGES: Message[] = [
  {
    id: 1,
    sender: "استاذ حسن علي",
    role: "teacher",
    text: "ممكن نبعت لباقي زمايلنا يدخلوا الحصة",
    time: "10:45م",
    isMe: true,
    avatar: null,
  },
  {
    id: 2,
    sender: "يوستينا صلاح",
    role: "student",
    text: "تمام يمستر ان شاءالله",
    time: "10:45م",
    isMe: false,
    avatar: null,
  },
  {
    id: 3,
    sender: "يوستينا صلاح",
    role: "student",
    text: "تمام يمستر ان شاءالله",
    time: "10:45م",
    isMe: false,
    avatar: null,
  },
  {
    id: 4,
    sender: "يوستينا صلاح",
    role: "student",
    text: "تمام يمستر ان شاءالله",
    time: "10:45م",
    isMe: false,
    avatar: null,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitial(name: string) {
  return name.trim().charAt(0);
}

// ─── Message bubbles ──────────────────────────────────────────────────────────

function TeacherBubble({ msg }: { msg: Message }) {
  return (
    <View style={styles.teacherRow}>
      {/* Bubble */}
      <View style={styles.teacherBubble}>
        <View style={styles.teacherBubbleHeader}>
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>معلم</Text>
          </View>
          <Text style={styles.teacherName}>{msg.sender}</Text>
        </View>
        <Text style={styles.teacherText}>{msg.text}</Text>
        <Text style={styles.teacherTime}>{msg.time}</Text>
      </View>
      {/* Avatar */}
      <View style={styles.teacherAvatarWrap}>
        {msg.avatar ? (
          <Image source={{ uri: msg.avatar }} style={styles.avatarImg} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarInitial}>{getInitial(msg.sender)}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

function StudentBubble({ msg }: { msg: Message }) {
  return (
    <View style={styles.studentRow}>
      {/* Avatar */}
      <View style={styles.studentAvatarWrap}>
        {msg.avatar ? (
          <Image source={{ uri: msg.avatar }} style={styles.avatarImg} />
        ) : (
          <View style={styles.studentAvatarCircle}>
            <Text style={styles.studentAvatarInitial}>
              {getInitial(msg.sender)}
            </Text>
          </View>
        )}
      </View>

      {/* Bubble */}
      <View style={styles.studentBubble}>
        <Text style={styles.studentName}>{msg.sender}</Text>
        <Text style={styles.studentText}>{msg.text}</Text>
        <Text style={styles.studentTime}>{msg.time}</Text>
      </View>
    </View>
  );
}

// ─── Panel ────────────────────────────────────────────────────────────────────

export function ChatPanel({ onClose }: { onClose: () => void }) {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const listRef = useRef<FlatList>(null);

  function handleSend() {
    const trimmed = text.trim();
    if (!trimmed) return;
    const next: Message = {
      id: Date.now(),
      sender: "استاذ حسن علي",
      role: "teacher",
      text: trimmed,
      time: new Date().toLocaleTimeString("ar-EG", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isMe: true,
      avatar: null,
    };
    setMessages((prev) => [...prev, next]);
    setText("");
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 80);
  }

  return (
    <View style={styles.panel}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <X size={18} color="#444" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>الدردشة</Text>
      </View>

      <View style={styles.divider} />

      {/* Messages */}
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(m) => String(m.id)}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) =>
          item.isMe ? (
            <TeacherBubble msg={item} />
          ) : (
            <StudentBubble msg={item} />
          )
        }
      />

      {/* Input bar */}
      <View style={styles.inputBar}>
        {/* Send button */}
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
          <Send size={18} color="#fff" />
        </TouchableOpacity>

        {/* Attachment */}
        <TouchableOpacity style={styles.iconBtn}>
          <Paperclip size={20} color="#888" />
        </TouchableOpacity>

        {/* Text input */}
        <TextInput
          style={styles.input}
          placeholder="مراسلة"
          value={text}
          onChangeText={setText}
          onSubmitEditing={handleSend}
          textAlign="right"
          placeholderTextColor="#aaa"
          returnKeyType="send"
        />

        {/* Emoji */}
        <TouchableOpacity style={styles.iconBtn}>
          <Smile size={20} color="#888" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const TEACHER_BG = "#E89B32";
const STUDENT_BG = "#D9D9D9";

const styles = StyleSheet.create({
  panel: { flex: 1, backgroundColor: "#fff" },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  closeBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontFamily: "Alex_700",
    fontSize: 20,
    color: "#1B3A4B",
  },
  divider: { height: 1, backgroundColor: "#E8E8E8" },

  /* List */
  list: { padding: 16, gap: 16 },

  /* Teacher bubble (isMe = true, right-aligned) */
  teacherRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-start",
    gap: 10,
  },
  teacherAvatarWrap: {
    marginTop: 4,
  },
  avatarImg: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  avatarPlaceholder: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#c9a06a",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    fontSize: 16,
    fontFamily: "Alex_700",
    color: "#fff",
  },
  teacherBubble: {
    flex: 1,
    maxWidth: "80%",
    backgroundColor: TEACHER_BG,
    borderRadius: 14,
    borderTopRightRadius: 4,
    padding: 14,
    gap: 6,
  },
  teacherBubbleHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  teacherName: {
    fontFamily: "Alex_700",
    fontSize: 14,
    color: "#fff",
  },
  roleBadge: {
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  roleBadgeText: {
    fontFamily: "Alex_700",
    fontSize: 11,
    color: "#fff",
  },
  teacherText: {
    fontFamily: "Alex_400",
    fontSize: 14,
    color: "#fff",
    textAlign: "right",
    lineHeight: 22,
  },
  teacherTime: {
    fontFamily: "Alex_400",
    fontSize: 11,
    color: "rgba(255,255,255,0.75)",
    textAlign: "left",
  },

  /* Student bubble (isMe = false, left-aligned) */
  studentRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: 10,
  },
  studentAvatarWrap: {
    marginTop: 4,
  },
  studentAvatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: TEACHER_BG,
    alignItems: "center",
    justifyContent: "center",
  },
  studentAvatarInitial: {
    fontSize: 15,
    fontFamily: "Alex_700",
    color: "#fff",
  },
  studentBubble: {
    flex: 1,
    maxWidth: "80%",
    backgroundColor: STUDENT_BG,
    borderRadius: 14,
    borderTopLeftRadius: 4,
    padding: 14,
    gap: 6,
  },
  studentName: {
    fontFamily: "Alex_700",
    fontSize: 14,
    color: "#1B3A4B",
    textAlign: "right",
  },
  studentText: {
    fontFamily: "Alex_400",
    fontSize: 14,
    color: "#1B3A4B",
    textAlign: "right",
    lineHeight: 22,
  },
  studentTime: {
    fontFamily: "Alex_400",
    fontSize: 11,
    color: "#888",
    textAlign: "left",
  },

  /* Input bar */
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#EBEBEB",
    gap: 10,
    backgroundColor: "#fff",
  },
  sendBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: TEACHER_BG,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    flex: 1,
    fontFamily: "Alex_400",
    fontSize: 14,
    color: "#333",
    paddingVertical: 0,
  },
});
