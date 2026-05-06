import { Lesson } from "@/types/schedule.types";
import React, { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { LessonCard } from "./LessonCard";

type Props = {
  session: Lesson;
  isLast: boolean;
};

export const TimelineEntry = memo(function TimelineEntry({
  session,
  isLast,
}: Props) {
  const isLive = session.status === "live";
  const accentColor = isLive ? "#FD6700" : "#C0BDB8";

  return (
    <View style={styles.entry}>
      <View style={styles.cardWrapper}>
        <LessonCard lesson={session} />
      </View>
      <View style={styles.timeColumn}>
        <Text style={styles.timeLabel}>{session.time}</Text>
        <View
          style={[
            styles.dot,
            { backgroundColor: accentColor, shadowColor: accentColor },
          ]}
        />
        {/* {!isLast && ( */}
        <View style={[styles.line, { backgroundColor: accentColor }]} />
        {/* )} */}
        <Text style={styles.endTimeLabel}>{session.endTime}</Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  entry: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 40,
    width: "100%",
  },
  cardWrapper: { flex: 1, paddingLeft: 8 },
  timeColumn: { width: 55, alignItems: "center", marginTop: -20 },
  timeLabel: {
    fontFamily: "Alex_700",
    fontSize: 11,
    color: "#000",
    textAlign: "center",
  },
  endTimeLabel: {
    fontFamily: "Alex_400",
    fontSize: 10,
    color: "#888",
    textAlign: "center",
    marginTop: 2,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 3,
  },
  line: {
    width: 3,
    flex: 1,
    minHeight: 20,
    marginBottom: 10,
    borderRadius: 1,
  },
});
