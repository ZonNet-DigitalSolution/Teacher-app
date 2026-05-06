import LessonBookIcon from "@/assets/svg/lesson-book.svg";
import { Lesson } from "@/types/schedule.types";
import { getPackageStyle } from "@/utils/package-factory";
import React, { memo, useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BellBadgeIcon, ClockIcon, DoubleChevronLeft } from "./icons";

type Props = { lesson: Lesson };

export const WeeklyLessonCard = memo(function WeeklyLessonCard({
  lesson,
}: Props) {
  const isLive = lesson.status === "live";
  const isDone = lesson.status === "done";

  const badge = useMemo(() => {
    if (isLive)
      return {
        label: "الحصة بدأت",
        bg: "#E3FAE6",
        iconBg: "#27C840",
        textColor: "#1a8c2e",
      };
    if (isDone)
      return {
        label: "الحصة انتهت",
        bg: "#CFEEFF",
        iconBg: "#5BBFCE",
        textColor: "#4193C3",
      };
    return {
      label: lesson.remaining ? `متبقي ${lesson.remaining}` : "قادمة",
      bg: "#FEF3E2",
      iconBg: "#E89B32",
      textColor: "#B87020",
    };
  }, [isLive, isDone, lesson.remaining]);

  const { image: SubjectIcon, bgColor } = useMemo(
    () => getPackageStyle(lesson.subject),
    [lesson.subject],
  );

  return (
    <View style={[styles.card, isLive && styles.cardLive]}>
      {/* Badge */}
      <View style={[styles.badge, { backgroundColor: badge.bg }]}>
        <Text style={[styles.badgeText, { color: badge.textColor }]}>
          {badge.label}
        </Text>
        <View
          style={[styles.badgeIconCircle, { backgroundColor: badge.iconBg }]}
        >
          {isLive ? <BellBadgeIcon /> : <ClockIcon />}
        </View>
      </View>

      {/* Subject + icon row */}
      <View style={styles.subjectRow}>
        {/* <View style={[styles.iconCircle, { backgroundColor: bgColor }]}>
          <SubjectIcon width={24} height={24} />
        </View> */}
        <Text style={styles.title} numberOfLines={2}>
          {lesson.subject}
        </Text>
      </View>

      <Text style={styles.grade}>{lesson.grade}</Text>

      {/* Lesson title */}
      <View style={styles.lessonRow}>
        <LessonBookIcon width={18} height={18} />
        <Text style={styles.lessonText} numberOfLines={2}>
          {lesson.lessonTitle}
        </Text>
      </View>

      <View style={styles.divider} />

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.actionBtn} activeOpacity={0.75}>
          <DoubleChevronLeft />
          <Text style={styles.actionText}>
            {isDone ? "مراجعة الدرس" : "دخول الحصة"}
          </Text>
        </TouchableOpacity>
        <View style={styles.timeRow}>
          <Text style={styles.timeText}>{lesson.time}</Text>
          <ClockIcon />
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  cardLive: { borderColor: "#E89B32", borderWidth: 1.5 },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: -30,
  },
  badgeIconCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: { fontFamily: "Alex_400", fontSize: 11 },
  subjectRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  title: {
    fontFamily: "Alex_700",
    fontSize: 14,
    color: "#092332",
    flex: 1,
    textAlign: "right",
    marginLeft: 8,
  },
  grade: {
    fontFamily: "Alex_400",
    fontSize: 12,
    color: "#7D7883",
    textAlign: "right",
    marginBottom: 8,
  },
  lessonRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  lessonText: {
    flex: 1,
    fontFamily: "Alex_300",
    fontSize: 12,
    color: "#092332",
    textAlign: "right",
    lineHeight: 20,
  },
  divider: { height: 1, backgroundColor: "#F0F0F0", marginBottom: 12 },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  timeRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  timeText: { fontFamily: "Alex_400", fontSize: 13, color: "#165072" },
  actionBtn: { flexDirection: "row", alignItems: "center", gap: 4 },
  actionText: { fontFamily: "Alex_700", fontSize: 13, color: "#E89B32" },
});
