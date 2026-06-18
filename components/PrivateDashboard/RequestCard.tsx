import CalendarIcon from "@/assets/svg/calendarIcon.svg";
import ClockIcon from "@/assets/svg/clockIcon.svg";
import RiyalIcon from "@/assets/svg/Riyal.svg";
import TargetIcon from "@/assets/svg/Target.svg";
import { Colors } from "@/constants/colors";
import { Timer } from "lucide-react-native";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import type { SessionRequest } from "@/store/private/privateTypes";

interface RequestCardProps {
  item: SessionRequest | { id: string; student: string; subject: string; date: string; time: string; price: string };
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  loading?: boolean;
}

// Normalise both the real API shape and the legacy mock shape
function normalise(item: RequestCardProps["item"]) {
  if (typeof item.student === "object") {
    // Real API shape (SessionRequest)
    const r = item as SessionRequest;
    return {
      id: String(r.id),
      studentName: r.student.name,
      subject: r.subject,
      date: r.requested_date,
      time: r.requested_time,
      price: String(r.price),
      message: r.message,
    };
  }
  // Legacy mock shape
  const m = item as { id: string; student: string; subject: string; date: string; time: string; price: string };
  return { id: m.id, studentName: m.student, subject: m.subject, date: m.date, time: m.time, price: m.price, message: undefined };
}

export function RequestCard({ item, onAccept, onReject, loading = false }: RequestCardProps) {
  const { id, studentName, subject, date, time, price, message } = normalise(item);

  return (
    <View style={styles.card}>
      {/* Top row: Avatar | Name + role | Status badge */}
      <View style={styles.topRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{studentName[0]}</Text>
        </View>
        <View style={styles.nameBlock}>
          <Text style={styles.studentName}>{studentName}</Text>
          <Text style={styles.studentRole}>طالب</Text>
        </View>

        <View style={styles.statusBadge}>
          <Timer size={13} color={Colors.primary} />
          <Text style={styles.statusText}>قيد الانتظار</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Details */}
      <View style={styles.details}>
        <View style={styles.infoRow}>
          <TargetIcon width={24} height={24} />
          <Text style={styles.subjectText}>{subject}</Text>
        </View>

        <View style={styles.infoRow}>
          <CalendarIcon color={"#706F71"} width={15} height={15} />
          <Text style={styles.infoText}>{date}</Text>
        </View>

        <View style={styles.infoRow}>
          <ClockIcon width={15} height={15} />
          <Text style={styles.infoText}>{time}</Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>السعر:</Text>
          <Text style={styles.priceValue}>{price}</Text>
          <RiyalIcon color={Colors.primary} width={20} height={20} />
        </View>

        {message ? (
          <Text style={styles.messageText}>{message}</Text>
        ) : null}
      </View>

      <View style={styles.divider} />

      {/* Actions */}
      {loading ? (
        <ActivityIndicator color={Colors.primary} style={{ paddingVertical: 8 }} />
      ) : (
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.rejectBtn}
            onPress={() => onReject(id)}
            activeOpacity={0.8}
          >
            <Text style={styles.rejectBtnText}>رفض</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.acceptBtn}
            onPress={() => onAccept(id)}
            activeOpacity={0.8}
          >
            <Text style={styles.acceptBtnText}>قبول الطلب</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderColor: Colors.borderLight,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
    borderWidth: 1,
  },

  // ── Top row ──────────────────────────────────────────
  topRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 24,
    backgroundColor: "#144B6B",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 18,
    fontFamily: "Alex_600",
    color: "#fff",
  },
  nameBlock: {
    flex: 1,
    alignItems: "flex-end",
    // gap: 2,
  },
  studentName: {
    fontSize: 14,
    fontFamily: "Alex_600",
    color: Colors.textPrimary,
  },
  studentRole: {
    fontSize: 12,
    fontFamily: "Alex_400",
    color: Colors.textSecondary,
  },
  statusBadge: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 5,
    backgroundColor: Colors.primaryLight,
    borderRadius: 50,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statusText: {
    fontSize: 11,
    fontFamily: "Alex_500",
    color: Colors.primary,
  },

  // ── Divider ───────────────────────────────────────────
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: 12,
  },

  // ── Details ───────────────────────────────────────────
  details: {
    gap: 5,
    alignItems: "flex-end",
  },
  infoRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 5,
  },
  subjectText: {
    fontSize: 14,
    fontFamily: "Alex_700",
    color: Colors.textPrimary,
  },
  infoText: {
    fontSize: 13,
    fontFamily: "Alex_400",
    color: Colors.textSecondary,
  },
  priceRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 6,
  },
  priceLabel: {
    fontSize: 14,
    fontFamily: "Alex_400",
    color: Colors.textSecondary,
  },
  priceValue: {
    fontSize: 15,
    fontFamily: "Alex_700",
    color: Colors.primary,
  },

  // ── Actions ───────────────────────────────────────────
  actions: {
    flexDirection: "row-reverse",
    gap: 10,
  },
  acceptBtn: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    borderRadius: 50,
    paddingVertical: 8,
  },
  acceptBtnText: {
    fontSize: 12,
    fontFamily: "Alex_600",
    color: "#fff",
  },
  rejectBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    paddingVertical: 8,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
  },
  rejectBtnText: {
    fontSize: 12,
    fontFamily: "Alex_600",
    color: Colors.textPrimary,
  },
  messageText: {
    fontSize: 12,
    fontFamily: "Alex_400",
    color: Colors.textSecondary,
    textAlign: "right",
    marginTop: 4,
    lineHeight: 18,
  },
});
