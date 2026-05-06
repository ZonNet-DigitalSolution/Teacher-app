import { Day } from "@/types/schedule.types";
import React, { memo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  day: Day;
  isActive: boolean;
  onPress: () => void;
};

export const DayPill = memo(function DayPill({ day, isActive, onPress }: Props) {
  return (
    <TouchableOpacity
      style={[
        styles.pill,
        isActive && styles.pillActive,
        day.isToday && !isActive && styles.pillToday,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.name, isActive && styles.textActive]}>
        {day.name}
      </Text>
      <Text style={[styles.num, isActive && styles.textActive]}>{day.num}</Text>
      <Text style={[styles.month, isActive && styles.textActive]}>
        {day.month}
      </Text>
      {isActive && <View style={styles.dot} />}
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  pill: {
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 50,
    backgroundColor: "#E0DFDB",
    marginHorizontal: 4,
    minWidth: 64,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 10,
    elevation: 3,
  },
  pillActive: { backgroundColor: "#D18C2D" },
  pillToday: { borderColor: "#E89B32" },
  name: { fontFamily: "Alex_700", fontSize: 11, color: "#555" },
  num: { fontFamily: "Alex_700", fontSize: 18, color: "#222", marginTop: 1 },
  month: { fontFamily: "Alex_700", fontSize: 11, color: "#222", marginTop: 1 },
  textActive: { color: "#fff" },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#D18C2D",
    marginTop: 4,
  },
});
