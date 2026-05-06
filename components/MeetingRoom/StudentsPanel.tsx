import AwardIcon from "@/assets/svg/award.svg";
import { Colors } from "@/constants/colors";
import { MicOff } from "lucide-react-native";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export const MOCK_STUDENTS = [
  { id: 1, name: "يوستينا صلاح", coins: 0 },
  { id: 2, name: "سارة صلاح", coins: 0 },
  { id: 3, name: "ساندي صلاح", coins: 0 },
];

const AVATAR_COLORS = ["#E8D5B0", "#C8D8E8", "#D8C8E8"];

const NON_SCROLL_H = 89; // header(50) + divider(1) + countText(38)

export function StudentsPanel({
  onClose,
  maxHeight,
}: {
  onClose: () => void;
  maxHeight: number;
}) {
  const scrollMaxH = maxHeight - NON_SCROLL_H;
  return (
    <View style={sp.panel}>
      {/* Header */}
      <View style={sp.header}>
        <TouchableOpacity onPress={onClose} style={sp.closeBtn}>
          <Text style={sp.closeX}>✕</Text>
        </TouchableOpacity>
        <Text style={sp.title}>الطلاب</Text>
      </View>

      <View style={sp.divider} />

      {/* Count */}
      <Text style={sp.countText}>
        يوجد {String(MOCK_STUDENTS.length).padStart(2, "0")} طلاب في الحصة
      </Text>

      {/* List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={sp.list}
        style={{ maxHeight: scrollMaxH }}
      >
        {MOCK_STUDENTS.map((student, i) => (
          <View key={student.id} style={sp.row}>
            {/* Mic off */}
            <MicOff size={20} color="#888" />

            {/* Name + coins */}
            <View style={sp.info}>
              <Text style={sp.name}>{student.name}</Text>
              <View style={sp.coinsRow}>
                <Text style={sp.coinsNum}>{student.coins}</Text>
                <AwardIcon width={16} height={16} />
              </View>
            </View>

            {/* Avatar */}
            <View
              style={[
                sp.avatar,
                { backgroundColor: AVATAR_COLORS[i % AVATAR_COLORS.length] },
              ]}
            >
              <Text style={sp.avatarText}>{student.name[0]}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const sp = StyleSheet.create({
  panel: { backgroundColor: "#fff" },

  // ── Header ───────────────────────────────────────────
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  closeBtn: { padding: 4 },
  closeX: { fontSize: 18, fontWeight: 800, color: "#111" },
  title: {
    fontFamily: "Alex_700",
    fontSize: 18,
    color: "#1B3A4B",
  },

  divider: { height: 1, backgroundColor: "#E8E8E8" },

  // ── Count ─────────────────────────────────────────────
  countText: {
    fontFamily: "Alex_400",
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "right",
    padding: 10,
    paddingHorizontal: 16,
  },

  // ── List ─────────────────────────────────────────────
  list: { paddingHorizontal: 16, gap: 4 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
  },

  // Avatar
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontFamily: "Alex_700",
    fontSize: 18,
    color: "#555",
  },

  // Info
  info: {
    flex: 1,
    alignItems: "flex-end",
    gap: 4,
  },
  name: {
    fontFamily: "Alex_700",
    fontSize: 14,
    color: "#1B3A4B",
    textAlign: "right",
  },
  coinsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  coinsNum: {
    fontFamily: "Alex_600",
    fontSize: 13,
    color: Colors.textSecondary,
  },
});
