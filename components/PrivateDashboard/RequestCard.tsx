import CalendarIcon from "@/assets/svg/calendarIcon.svg";
import ClockIcon from "@/assets/svg/clockIcon.svg";
import RiyalIcon from "@/assets/svg/Riyal.svg";
import TargetIcon from "@/assets/svg/Target.svg";
import { Colors } from "@/constants/colors";
import { Timer } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface RequestCardProps {
  item: {
    id: string;
    student: string;
    subject: string;
    date: string;
    time: string;
    price: string;
  };
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}

export function RequestCard({ item, onAccept, onReject }: RequestCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.student[0]}</Text>
        </View>
        <View style={styles.nameBlock}>
          <Text style={styles.studentName}>{item.student}</Text>
          <Text style={styles.studentRole}>طالب</Text>
        </View>
        <View style={styles.statusBadge}>
          <Timer size={13} color={Colors.primary} />
          <Text style={styles.statusText}>قيد الانتظار</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.details}>
        <View style={styles.infoRow}>
          <TargetIcon width={24} height={24} />
          <Text style={styles.subjectText}>{item.subject}</Text>
        </View>
        <View style={styles.infoRow}>
          <CalendarIcon color={"#706F71"} width={15} height={15} />
          <Text style={styles.infoText}>{item.date}</Text>
        </View>
        <View style={styles.infoRow}>
          <ClockIcon width={15} height={15} />
          <Text style={styles.infoText}>{item.time}</Text>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>السعر:</Text>
          <Text style={styles.priceValue}>{item.price}</Text>
          <RiyalIcon color={Colors.primary} width={20} height={20} />
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.actions}>
        <TouchableOpacity style={styles.rejectBtn} onPress={() => onReject(item.id)} activeOpacity={0.8}>
          <Text style={styles.rejectBtnText}>رفض</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.acceptBtn} onPress={() => onAccept(item.id)} activeOpacity={0.8}>
          <Text style={styles.acceptBtnText}>قبول الطلب</Text>
        </TouchableOpacity>
      </View>
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
  topRow: { flexDirection: "row-reverse", alignItems: "center", gap: 10 },
  avatar: {
    width: 46, height: 46, borderRadius: 24,
    backgroundColor: "#144B6B", alignItems: "center", justifyContent: "center",
  },
  avatarText: { fontSize: 18, fontFamily: "Alex_600", color: "#fff" },
  nameBlock: { flex: 1, alignItems: "flex-end" },
  studentName: { fontSize: 14, fontFamily: "Alex_600", color: Colors.textPrimary },
  studentRole: { fontSize: 12, fontFamily: "Alex_400", color: Colors.textSecondary },
  statusBadge: {
    flexDirection: "row-reverse", alignItems: "center", gap: 5,
    backgroundColor: Colors.primaryLight, borderRadius: 50,
    paddingHorizontal: 10, paddingVertical: 5,
  },
  statusText: { fontSize: 11, fontFamily: "Alex_500", color: Colors.primary },
  divider: { height: 1, backgroundColor: Colors.borderLight, marginVertical: 12 },
  details: { gap: 5, alignItems: "flex-end" },
  infoRow: { flexDirection: "row-reverse", alignItems: "center", gap: 5 },
  subjectText: { fontSize: 14, fontFamily: "Alex_700", color: Colors.textPrimary },
  infoText: { fontSize: 13, fontFamily: "Alex_400", color: Colors.textSecondary },
  priceRow: { flexDirection: "row-reverse", alignItems: "center", gap: 6 },
  priceLabel: { fontSize: 14, fontFamily: "Alex_400", color: Colors.textSecondary },
  priceValue: { fontSize: 15, fontFamily: "Alex_700", color: Colors.primary },
  actions: { flexDirection: "row-reverse", gap: 10 },
  acceptBtn: {
    flex: 2, alignItems: "center", justifyContent: "center",
    backgroundColor: Colors.primary, borderRadius: 50, paddingVertical: 8,
  },
  acceptBtnText: { fontSize: 12, fontFamily: "Alex_600", color: "#fff" },
  rejectBtn: {
    flex: 1, alignItems: "center", justifyContent: "center",
    borderRadius: 50, paddingVertical: 8, borderWidth: 1.5, borderColor: Colors.borderLight,
  },
  rejectBtnText: { fontSize: 12, fontFamily: "Alex_600", color: Colors.textPrimary },
});
