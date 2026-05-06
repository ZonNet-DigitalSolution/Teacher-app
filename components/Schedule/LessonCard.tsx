import GroupIcon from "@/assets/svg/Group.svg";
import LessonBookIcon from "@/assets/svg/lesson-book.svg";
import { Lesson } from "@/types/schedule.types";
import { getPackageStyle } from "@/utils/package-factory";
import { useRouter } from "expo-router";
import { Pencil } from "lucide-react-native";
import React, { memo, useMemo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { EditLessonSheet } from "./EditLessonSheet";
import { BellBadgeIcon, DoneBadgeIcon, UpcomingBadgeIcon } from "./icons";

type Props = { lesson: Lesson };

export const LessonCard = memo(function LessonCard({ lesson }: Props) {
  const [sheetVisible, setSheetVisible] = useState(false);
  const router = useRouter();

  const isLive = lesson.status === "live";
  const isDone = lesson.status === "done";

  const badge = useMemo(() => {
    if (isLive) return { label: "الحصة بدأت", bg: "#DCFFE0", color: "#27C840" };
    if (isDone) return { label: "منتهية", bg: "#CFEEFF", color: "#4193C3" };
    return {
      label: lesson.remaining ? `متبقي ${lesson.remaining}` : "قادمة",
      bg: "#F8E0BF",
      color: "#BA7C28",
    };
  }, [isLive, isDone, lesson.remaining]);

  const { image: SubjectIcon, bgColor } = useMemo(
    () => getPackageStyle(lesson.subject),
    [lesson.subject],
  );

  const handleEnterLesson = () =>
    router.push({
      pathname: "/meeting-lobby",
      params: {
        subject: lesson.subject,
        date: lesson.date,
        time: lesson.time,
        group: lesson.group,
        lessonId: lesson.id,
      },
    });

  return (
    <>
      <View style={[styles.card, isLive && styles.cardLive]}>
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
              {isLive && <BellBadgeIcon />}
              {!isLive && !isDone && <UpcomingBadgeIcon />}
              {isDone && <DoneBadgeIcon />}
            </View>
          </View>
        </View>

        {/* Body */}
        <View style={styles.body}>
          <Text style={styles.title} numberOfLines={2}>
            {lesson.subject}
          </Text>
          <Text style={styles.gradeText}>{lesson.grade}</Text>
          <View style={styles.lessonRow}>
            <Text style={styles.lessonText} numberOfLines={2}>
              {lesson.lessonTitle || "لا يوجد عنوان"}
            </Text>
            <LessonBookIcon width={20} height={20} />
          </View>
        </View>

        {/* Bottom row */}
        <View style={styles.bottomRow}>
          <View style={styles.groupInfo}>
            <Text style={styles.groupText}>{lesson.group}</Text>
            <GroupIcon width={25} height={25} />
          </View>

          <TouchableOpacity
            style={styles.editIconBtn}
            activeOpacity={0.75}
            onPress={() => setSheetVisible(true)}
          >
            <Pencil size={16} color="#888" />
          </TouchableOpacity>

          {isDone ? (
            <TouchableOpacity
              style={styles.contentBtn}
              activeOpacity={0.75}
              onPress={() =>
                lesson.hasContent
                  ? router.push({
                      pathname: "/session-content",
                      params: { lessonId: lesson.id, subject: lesson.subject },
                    })
                  : router.push({
                      pathname: "/add-content",
                      params: { lessonId: lesson.id, subject: lesson.subject },
                    })
              }
            >
              <Text style={styles.contentBtnText}>
                {lesson.hasContent ? "عرض المحتوى" : "إضافة المحتوى"}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[
                styles.btn,
                isLive ? styles.btnActive : styles.btnDisabled,
              ]}
              activeOpacity={0.75}
              onPress={handleEnterLesson}
            >
              <Text style={styles.btnText}>دخول الحصة</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <EditLessonSheet
        visible={sheetVisible}
        lessonTitle={lesson.lessonTitle}
        onClose={() => setSheetVisible(false)}
        onSave={(_newTitle) => {
          // TODO: dispatch update to store / call API
          setSheetVisible(false);
        }}
      />
    </>
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
  cardLive: { borderColor: "#E89B32", borderWidth: 1.5 },
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
  gradeText: {
    fontFamily: "Alex_400",
    fontSize: 11,
    color: "#7D7883",
    textAlign: "right",
    marginBottom: 6,
    width: "100%",
  },
  lessonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    width: "100%",
  },
  lessonText: {
    fontFamily: "Alex_300",
    fontSize: 12,
    color: "#092332",
    textAlign: "right",
    lineHeight: 20,
    flex: 1,
  },
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
  groupInfo: { flexDirection: "row", alignItems: "center", gap: 6 },
  groupText: { fontFamily: "Alex_400", fontSize: 11, color: "#555" },
  btn: { paddingHorizontal: 22, paddingVertical: 10, borderRadius: 24 },
  btnActive: { backgroundColor: "#E89B32" },
  btnDisabled: { backgroundColor: "#9E9E9E" },
  btnText: { fontFamily: "Alex_700", fontSize: 11, color: "#fff" },
  editIconBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#C8C8C8",
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  contentBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#165072",
  },
  contentBtnText: { fontFamily: "Alex_700", fontSize: 11, color: "#fff" },
});
