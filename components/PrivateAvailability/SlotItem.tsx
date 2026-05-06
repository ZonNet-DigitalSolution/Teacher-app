import { Colors } from "@/constants/colors";
import React, { memo } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { SlotStatus } from "./Types";

interface SlotItemProps {
  time: string;
  status: SlotStatus;
  width: number;
  onPress: () => void;
}

export const SlotItem = memo(function SlotItem({
  time,
  status,
  width,
  onPress,
}: SlotItemProps) {
  const isBooked = status === "booked";
  const isAvailable = status === "available";

  return (
    <TouchableOpacity
      style={[
        styles.slot,
        { width },
        isAvailable && styles.slotAvailable,
        isBooked && styles.slotBooked,
      ]}
      onPress={onPress}
      activeOpacity={isBooked ? 1 : 0.7}
    >
      <Text
        style={[
          styles.time,
          isAvailable && styles.timeAvailable,
          isBooked && styles.timeBooked,
        ]}
      >
        {time}
      </Text>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  slot: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#EFEFEF",
  },
  slotAvailable: {
    backgroundColor: "#BAE6FD",
  },
  slotBooked: {
    backgroundColor: "#BBF7D0",
  },
  time: {
    fontSize: 14,
    fontFamily: "Alex_700",
    color: Colors.textSecondary,
  },
  timeAvailable: { color: "#0369A1" },
  timeBooked: { color: Colors.success },
});
