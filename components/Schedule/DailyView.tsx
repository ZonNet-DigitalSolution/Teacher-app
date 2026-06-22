import { Colors } from "@/constants/colors";
import { Day, Lesson } from "@/types/schedule.types";
import { Image } from "expo-image";
import React, { memo } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { DayPill } from "./DayPill";
import { TimelineEntry } from "./TimelineEntry";

type Props = {
  days: Day[];
  activeIndex: number;
  sessions: Lesson[];
  onDayPress: (index: number) => void;
  isLoading?: boolean;
  error?: string | null;
};

export const DailyView = memo(function DailyView({
  days,
  activeIndex,
  sessions,
  onDayPress,
  isLoading,
  error,
}: Props) {
  return (
    <>
      {/* Day pills — always visible */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.daysContainer}
      >
        {days.map((day, i) => (
          <DayPill
            key={day.date}
            day={day}
            index={i}
            isActive={activeIndex === i}
            onDayPress={onDayPress}
          />
        ))}
      </ScrollView>

      <View style={styles.dashedDivider} />

      {/* Lessons area */}
      <View style={styles.timelineSection}>
        {isLoading ? (
          <ActivityIndicator
            size="large"
            color={Colors.primaryAuth}
            style={styles.loader}
          />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : sessions.length > 0 ? (
          <View style={styles.timelineWrapper}>
            {sessions.map((session, i) => (
              <TimelineEntry
                key={session.id}
                session={session}
                isLast={i === sessions.length - 1}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Image
              source={require("@/assets/images/no-sessions.png")}
              style={styles.emptyImage}
              contentFit="contain"
              cachePolicy="memory-disk"
            />
            <Text style={styles.emptyText}>لا توجد حصص اليوم</Text>
          </View>
        )}
      </View>
    </>
  );
});

const styles = StyleSheet.create({
  daysContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    backgroundColor: "#fff",
    flexDirection: "row-reverse",
  },
  dashedDivider: {
    borderBottomWidth: 2,
    borderColor: "#ddd",
    borderStyle: "dashed",
    marginHorizontal: 16,
    marginVertical: 10,
  },
  timelineSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  timelineWrapper: {
    position: "relative",
    paddingTop: 20,
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 50,
  },
  emptyImage: {
    width: "100%",
    height: 180,
  },
  emptyText: {
    marginTop: 12,
    fontFamily: "Alex_400",
    fontSize: 14,
    color: "#7F8081",
  },
  loader: { marginTop: 40 },
  errorText: {
    marginTop: 40,
    textAlign: "center",
    fontFamily: "Alex_400",
    fontSize: 14,
    color: "#EF4444",
  },
});
