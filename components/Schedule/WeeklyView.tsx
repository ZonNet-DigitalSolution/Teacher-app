import { Day, Lesson } from "@/types/schedule.types";
import React, { memo, useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { DayCard } from "./DayCard";

type Props = {
  days: Day[];
  lessons: Lesson[];
};

export const WeeklyView = memo(function WeeklyView({ days, lessons }: Props) {
  // Pre-group lessons by date so each DayCard doesn't iterate the full list
  const lessonsByDate = useMemo(() => {
    const map: Record<string, Lesson[]> = {};
    for (const lesson of lessons) {
      if (!map[lesson.date]) map[lesson.date] = [];
      map[lesson.date].push(lesson);
    }
    return map;
  }, [lessons]);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {days.map((day) => (
        <DayCard
          key={day.date}
          day={day}
          lessons={lessonsByDate[day.date] ?? []}
        />
      ))}
      <View style={styles.listFooter} />
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 12 },
  listFooter: { height: 90 },
});
