import {
  ALL_SLOTS,
  DAYS,
  INITIAL_SCHEDULE,
} from "@/components/PrivateAvailability/Constants";
import { DayHeader } from "@/components/PrivateAvailability/DayHeader";
import { DayStrip } from "@/components/PrivateAvailability/DayStrip";
import { Legend } from "@/components/PrivateAvailability/Legend";
import { TimeGroup } from "@/components/PrivateAvailability/TimeGroup";
import { DayKey } from "@/components/PrivateAvailability/Types";
import React, { useCallback, useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

export function PrivateAvailability() {
  const [selectedDay, setSelectedDay] = useState<DayKey>("sun");
  const [schedule, setSchedule] = useState(INITIAL_SCHEDULE);

  const toggleSlot = useCallback(
    (time: string) => {
      setSchedule((prev) => {
        const day = prev[selectedDay] ?? {};
        const current = day[time];
        if (!current || current === "off") {
          return { ...prev, [selectedDay]: { ...day, [time]: "available" } };
        }
        if (current === "available") {
          const updated = { ...day };
          delete updated[time];
          return { ...prev, [selectedDay]: updated };
        }
        return prev;
      });
    },
    [selectedDay],
  );

  const activateAll = useCallback(() => {
    setSchedule((prev) => {
      const day = prev[selectedDay] ?? {};
      const updated = { ...day };
      ALL_SLOTS.forEach((t) => {
        if (!updated[t]) updated[t] = "available";
      });
      return { ...prev, [selectedDay]: updated };
    });
  }, [selectedDay]);

  const clearAll = useCallback(() => {
    setSchedule((prev) => {
      const day = prev[selectedDay] ?? {};
      const updated = Object.fromEntries(
        Object.entries(day).filter(([, v]) => v === "booked"),
      );
      return { ...prev, [selectedDay]: updated };
    });
  }, [selectedDay]);

  const daySchedule = useMemo(
    () => schedule[selectedDay] ?? {},
    [schedule, selectedDay],
  );
  const availableCount = useMemo(
    () => Object.values(daySchedule).filter((s) => s === "available").length,
    [daySchedule],
  );
  const bookedCount = useMemo(
    () => Object.values(daySchedule).filter((s) => s === "booked").length,
    [daySchedule],
  );
  const dayLabel = DAYS.find((d) => d.key === selectedDay)?.label ?? "";

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <DayStrip
        schedule={schedule}
        selectedDay={selectedDay}
        onSelect={setSelectedDay}
      />
      <Legend />

      <DayHeader
        dayLabel={dayLabel}
        available={availableCount}
        booked={bookedCount}
        total={ALL_SLOTS.length}
        onActivateAll={activateAll}
        onClearAll={clearAll}
      />

      <TimeGroup
        daySchedule={daySchedule}
        onToggle={toggleSlot}
      />

      <View style={styles.footer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingTop: 14 },
  groups: { paddingHorizontal: 16, gap: 20 },
  footer: { height: 100 },
});
