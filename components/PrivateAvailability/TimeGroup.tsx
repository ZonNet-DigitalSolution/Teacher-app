import { Colors } from "@/constants/colors";
import React, { memo, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { TIME_GROUPS } from "./Constants";
import { SlotItem } from "./SlotItem";
import { DaySchedule, SlotStatus } from "./Types";

interface TimeGroupProps {
  daySchedule: DaySchedule;
  onToggle: (time: string) => void;
}

export const TimeGroup = memo(function TimeGroup({
  daySchedule,
  onToggle,
}: TimeGroupProps) {
  const [activeKey, setActiveKey] = useState(TIME_GROUPS[0].key);
  const { width: screenW } = useWindowDimensions();

  const activeGroup = TIME_GROUPS.find((g) => g.key === activeKey)!;
  const slotWidth = Math.floor((screenW - 32 - 16) / 3);

  return (
    <View style={styles.container}>
      {/* Group tab cards */}
      <View style={styles.tabs}>
        {[...TIME_GROUPS].map((group) => {
          const Icon = group.icon;
          const isActive = group.key === activeKey;
          return (
            <TouchableOpacity
              key={group.key}
              style={[
                styles.tab,
                isActive && { borderColor: Colors.primary, borderWidth: 2 },
              ]}
              onPress={() => setActiveKey(group.key)}
              activeOpacity={0.8}
            >
              <Icon width={36} height={36} />
              <Text style={[styles.tabLabel, { color: Colors.textPrimary }]}>
                {group.label}
              </Text>
              <Text style={styles.tabRange}>{group.timeRange}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Slot grid for active group */}
      <View style={styles.slotGrid}>
        {activeGroup.slots.map((time) => {
          const status: SlotStatus = daySchedule[time] ?? "off";
          return (
            <SlotItem
              key={time}
              time={time}
              status={status}
              width={slotWidth}
              onPress={() => status !== "booked" && onToggle(time)}
            />
          );
        })}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: { gap: 20, paddingHorizontal: 16 },
  tabs: {
    flexDirection: "row-reverse",
    gap: 8,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
    backgroundColor: Colors.surface,
    gap: 4,
  },
  tabLabel: {
    fontSize: 14,
    fontFamily: "Alex_700",
  },
  tabRange: {
    fontSize: 11,
    fontFamily: "Alex_400",
    color: Colors.textTertiary,
  },
  slotGrid: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 8,
  },
});
