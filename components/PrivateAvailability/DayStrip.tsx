import { Colors } from "@/constants/colors";
import React, { memo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { DAYS } from "./Constants";
import { DayKey, Schedule } from "./Types";

interface DayStripProps {
  schedule: Schedule;
  selectedDay: DayKey;
  onSelect: (day: DayKey) => void;
}

export const DayStrip = memo(function DayStrip({
  schedule,
  selectedDay,
  onSelect,
}: DayStripProps) {
  return (
    <View style={styles.strip}>
      {DAYS.map((day) => {
        const dayData = schedule[day.key] ?? {};
        const vals = Object.values(dayData);
        const hasBooked = vals.some((s) => s === "booked");
        const availCount = vals.filter((s) => s === "available").length;
        const isActive = selectedDay === day.key;

        const barColor = hasBooked
          ? Colors.info
          : availCount > 0
            ? Colors.success
            : "transparent";

        return (
          <TouchableOpacity
            key={day.key}
            style={[styles.item, isActive && styles.itemActive]}
            onPress={() => onSelect(day.key)}
            activeOpacity={0.75}
          >
            <Text style={[styles.short, isActive && styles.shortActive]}>
              {day.short}
            </Text>
            {/* <View style={styles.dots}>
              {availCount > 0 && (
                <View style={[styles.dot, { backgroundColor: Colors.success }]} />
              )}
              {hasBooked && (
                <View style={[styles.dot, { backgroundColor: Colors.info }]} />
              )}
            </View> */}
            {/* <View style={[styles.bar, { backgroundColor: barColor }]} /> */}
          </TouchableOpacity>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  strip: {
    flexDirection: "row-reverse",
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderColor: "#ddd",
    borderWidth: 1,
    overflow: "hidden",
  },
  item: {
    flex: 1,
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 6,
    gap: 4,
    position: "relative",
  },
  itemActive: { backgroundColor: Colors.primaryLight },
  short: { fontSize: 11, fontFamily: "Alex_600", color: Colors.textSecondary },
  shortActive: { color: Colors.primary },
  dots: { flexDirection: "row", gap: 3, height: 6, alignItems: "center" },
  dot: { width: 5, height: 5, borderRadius: 3 },
  bar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    borderRadius: 2,
  },
});
