import CalendarIcon from "@/assets/svg/calendarIcon.svg";
import { UpcomingSession } from "@/components/PrivateDashboard/Types";
import { ClockIcon, UpcomingBadgeIcon } from "@/components/Schedule/icons";
import { Colors } from "@/constants/colors";
import { getPackageStyle } from "@/utils/package-factory";
import { useRouter } from "expo-router";
import React, { memo, useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
export const UpcomingCard = memo(function UpcomingCard({
  item,
}: {
  item: UpcomingSession;
}) {
  const router = useRouter();
  const badge = item.isToday
    ? { label: "اليوم", bg: "#F8E0BF", color: "#BA7C28" }
    : { label: item.date, bg: Colors.surfaceAlt, color: Colors.textSecondary };

  const { image: SubjectIcon, bgColor } = useMemo(
    () => getPackageStyle(item.subject),
    [item.subject],
  );

  return (
    <View style={[styles.card, item.isToday && styles.cardToday]}>
      {/* Top row */}
      <View style={styles.topRow}>
        <View style={[styles.iconCircle, { backgroundColor: bgColor }]}>
          <SubjectIcon width={28} height={28} />
        </View>
        <View style={styles.badgeArea}>
          <View style={[styles.badge, { backgroundColor: badge.bg }]}>
            <Text style={[styles.badgeText, { color: badge.color }]}>
              {badge.label}
            </Text>
            <UpcomingBadgeIcon />
          </View>
        </View>
      </View>

      {/* Body */}
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>
          {item.subject}
        </Text>
        <Text style={styles.studentText}>{item.student}</Text>
        <View style={styles.dateRow}>
          <Text style={styles.dateText}>{item.date}</Text>
          <CalendarIcon color={"#706F71"} width={15} height={15} />
        </View>
      </View>

      {/* Bottom row */}
      <View style={styles.bottomRow}>
        <View style={styles.timeChip}>
          <ClockIcon />
          <Text style={styles.timeText}>{item.time}</Text>
        </View>

        <TouchableOpacity
          style={[
            styles.btn,
            item.isToday ? styles.btnActive : styles.btnDisabled,
          ]}
          activeOpacity={0.75}
          disabled={!item.isToday}
          onPress={() =>
            router.push({
              pathname: "/meeting-lobby",
              params: {
                subject: item.subject,
                date: item.date,
                time: item.time,
                group: item.student,
                lessonId: item.id,
              },
            })
          }
        >
          <Text style={styles.btnText}>دخول الحصة</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fafafa",
    borderRadius: 16,
    flex: 1,
    width: "100%",
    marginBottom: 12,
    borderWidth: 0.8,
    borderColor: "#B3B2AF",
  },
  cardToday: { borderColor: "#E89B32", borderWidth: 1.5 },

  // ── Top row ──────────────────────────────────────────
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingTop: 8,
    gap: 8,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 50,
    borderColor: "#fff",
    borderWidth: 3,
    marginTop: -30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  badgeArea: { alignItems: "flex-end", flex: 1 },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    alignSelf: "flex-end",
  },
  badgeText: { fontFamily: "Alex_700", fontSize: 10 },

  // ── Body ─────────────────────────────────────────────
  body: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: "flex-start",
  },
  title: {
    fontFamily: "Alex_700",
    fontSize: 14,
    color: "#111",
    textAlign: "right",
    marginBottom: 2,
    width: "100%",
  },
  studentText: {
    fontFamily: "Alex_400",
    fontSize: 11,
    color: "#7D7883",
    textAlign: "right",
    marginBottom: 6,
    width: "100%",
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    width: "100%",
  },
  dateText: {
    fontFamily: "Alex_300",
    fontSize: 12,
    color: "#092332",
    textAlign: "right",
    lineHeight: 20,
    flex: 1,
  },

  // ── Bottom row ────────────────────────────────────────
  bottomRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    gap: 8,
  },
  timeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  timeText: { fontFamily: "Alex_400", fontSize: 11, color: "#555" },
  btn: { paddingHorizontal: 22, paddingVertical: 10, borderRadius: 24 },
  btnActive: { backgroundColor: "#E89B32" },
  btnDisabled: { backgroundColor: "#9E9E9E" },
  btnText: { fontFamily: "Alex_700", fontSize: 11, color: "#fff" },
});
