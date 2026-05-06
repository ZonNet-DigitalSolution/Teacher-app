import { Day, Lesson } from "@/types/schedule.types";
import React, { memo, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Path, Svg } from "react-native-svg";
import { WeeklyLessonCard } from "./WeeklyLessonCard";

const CHEVRON_PATH =
  "M1.00045 -3.19481e-05C1.26558 0.000201225 1.51976 0.105711 1.70712 0.2933L6.82179 5.40797C6.97656 5.56278 7.16031 5.68558 7.36255 5.76937C7.56478 5.85315 7.78155 5.89628 8.00045 5.89628C8.21936 5.89628 8.43612 5.85315 8.63836 5.76937C8.8406 5.68558 9.02435 5.56278 9.17912 5.40797L14.2871 0.299967C14.4757 0.117809 14.7283 0.017015 14.9905 0.0192933C15.2527 0.0215716 15.5035 0.12674 15.6889 0.312149C15.8743 0.497557 15.9795 0.74837 15.9818 1.01057C15.9841 1.27276 15.8833 1.52537 15.7011 1.71397L10.5971 6.82197C9.90895 7.50879 8.97639 7.89453 8.00412 7.89453C7.03185 7.89453 6.0993 7.50879 5.41112 6.82197L0.29312 1.7073C0.153176 1.56745 0.0578627 1.38922 0.01924 1.19518C-0.0193828 1.00114 0.000421325 0.800005 0.0761463 0.617223C0.151871 0.434441 0.280114 0.278229 0.444646 0.168354C0.609179 0.0584784 0.802606 -0.000121593 1.00045 -3.19481e-05Z";

type Props = {
  day: Day;
  lessons: Lesson[];
};

export const DayCard = memo(function DayCard({ day, lessons }: Props) {
  const [expanded, setExpanded] = useState(day.isToday);
  const anim = useRef(new Animated.Value(day.isToday ? 1 : 0)).current;

  const toggle = () => {
    const toValue = expanded ? 0 : 1;
    Animated.timing(anim, {
      toValue,
      duration: 220,
      useNativeDriver: true,
    }).start();
    setExpanded((v) => !v);
  };

  const arrowRotate = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <View style={[styles.card, day.isToday && styles.cardToday]}>
      <TouchableOpacity
        style={styles.header}
        onPress={toggle}
        activeOpacity={0.7}
      >
        <View style={styles.headerInfo}>
          {day.isToday && <View style={styles.todayDot} />}
          <Text style={[styles.dateText, day.isToday && styles.dateTextToday]}>
            {day.name}: {day.num} {day.month}
          </Text>
          {lessons.length > 0 && (
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{lessons.length}</Text>
            </View>
          )}
        </View>
        <Animated.View
          style={[styles.arrowCircle, { transform: [{ rotate: arrowRotate }] }]}
        >
          <Svg width={10} height={5} viewBox="0 0 16 8">
            <Path d={CHEVRON_PATH} fill="#fff" />
          </Svg>
        </Animated.View>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.body}>
          {lessons.length === 0 ? (
            <Text style={styles.emptyText}>لا توجد حصص هذا اليوم</Text>
          ) : (
            <View style={styles.timelineWrapper}>
              {lessons.map((lesson) => (
                <WeeklyLessonCard key={lesson.id} lesson={lesson} />
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#F8F8F6",
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#eee",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    overflow: "hidden",
  },
  cardToday: { borderColor: "#E89B32", borderWidth: 1.5 },
  header: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
  },
  headerInfo: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
  },
  dateText: {
    fontFamily: "Alex_700",
    fontSize: 14,
    color: "#7D7883",
    textAlign: "right",
  },
  dateTextToday: { color: "#E89B32" },
  countBadge: {
    backgroundColor: "#F8E0BF",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  countText: { fontFamily: "Alex_700", fontSize: 11, color: "#BA7C28" },
  todayDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E89B32",
  },
  body: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  emptyText: {
    fontFamily: "Alex_400",
    fontSize: 13,
    color: "#aaa",
    textAlign: "center",
    paddingVertical: 16,
  },
  arrowCircle: {
    width: 24,
    height: 24,
    borderRadius: 14,
    backgroundColor: "#E89B32",
    alignItems: "center",
    justifyContent: "center",
  },
  timelineWrapper: { paddingTop: 8 },
});
