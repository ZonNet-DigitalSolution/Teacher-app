import { Colors } from "@/constants/colors";
import React, { memo } from "react";
import { StyleSheet, Text, View } from "react-native";

interface DayHeaderProps {
  dayLabel: string;
  available: number;
  booked: number;
  total: number;
  onActivateAll: () => void;
  onClearAll: () => void;
}

export const DayHeader = memo(function DayHeader({
  dayLabel,
  available,
  booked,
  total,
  onActivateAll,
  onClearAll,
}: DayHeaderProps) {
  const filled = available + booked;
  const fillPercent = total > 0 ? (filled / total) * 100 : 0;

  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <View style={styles.titleArea}>
          <Text style={styles.label}>{dayLabel}</Text>
        </View>

        <View style={styles.actions}>
          <View style={styles.badges}>
            {booked > 0 && (
              <View style={[styles.pill, { backgroundColor: Colors.infoBg }]}>
                <Text style={[styles.pillText, { color: Colors.info }]}>
                  {booked} محجوز
                </Text>
              </View>
            )}
            {available > 0 && (
              <View
                style={[styles.pill, { backgroundColor: Colors.successBg }]}
              >
                <Text style={[styles.pillText, { color: Colors.success }]}>
                  {available} متاح
                </Text>
              </View>
            )}
          </View>
          {/* <TouchableOpacity
            style={styles.clearBtn}
            onPress={onClearAll}
            activeOpacity={0.8}
          >
            <RefreshCw size={13} color={Colors.error} />
            <Text style={styles.clearBtnText}>مسح</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.activateBtn}
            onPress={onActivateAll}
            activeOpacity={0.8}
          >
            <Zap size={13} color={Colors.primary} />
            <Text style={styles.activateBtnText}>تفعيل الكل</Text>
          </TouchableOpacity> */}
        </View>
      </View>
      <Text
        style={{ fontFamily: "Alex_400", textAlign: "right", color: "#7D7883" }}
      >
        اختر الفتره لعرض المواعيد
      </Text>
      {/* 
      <View style={styles.progressTrack}>
        <View
          style={[styles.progressFill, { width: `${fillPercent}%` as any }]}
        >
          {booked > 0 && filled > 0 && (
            <View
              style={[
                styles.progressBooked,
                { width: `${(booked / filled) * 100}%` as any },
              ]}
            />
          )}
        </View>
      </View> */}

      {filled === 0 && (
        <Text style={styles.hint}>
          لا توجد أوقات محددة — اضغط على الأوقات أدناه لتفعيلها
        </Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 14,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.05,
    // shadowRadius: 8,
    // elevation: 2,
    // gap: 10,
  },
  top: {
    flexDirection: "row-reverse",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  titleArea: { alignItems: "flex-end", gap: 4 },
  label: { fontSize: 18, fontFamily: "Alex_700", color: Colors.textPrimary },
  badges: { flexDirection: "row-reverse", gap: 6 },
  pill: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20 },
  pillText: { fontSize: 12, fontFamily: "Alex_600" },
  actions: { flexDirection: "row-reverse", gap: 8, alignSelf: "center" },
  activateBtn: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: Colors.primaryLight,
    borderWidth: 1,
    borderColor: Colors.primary + "40",
  },
  activateBtnText: {
    fontSize: 12,
    fontFamily: "Alex_600",
    color: Colors.primary,
  },
  clearBtn: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: Colors.errorBg,
    borderWidth: 1,
    borderColor: Colors.error + "30",
  },
  clearBtnText: { fontSize: 12, fontFamily: "Alex_600", color: Colors.error },
  progressTrack: {
    height: 6,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 4,
    overflow: "hidden",
    alignItems: "flex-end",
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.success,
    borderRadius: 4,
    flexDirection: "row",
    overflow: "hidden",
  },
  progressBooked: { height: "100%", backgroundColor: Colors.info },
  hint: {
    fontSize: 12,
    fontFamily: "Alex_400",
    color: Colors.textTertiary,
    textAlign: "right",
  },
});
