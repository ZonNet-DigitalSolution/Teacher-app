import { Colors } from "@/constants/colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { StatItem } from "./Types";

export function StatCard({ item, width }: { item: StatItem; width: number }) {
  const Icon = item.icon;
  return (
    <View style={[styles.statCard, { width }]}>
      <View style={[styles.statArc, { borderColor: item.color + "70" }]} />
      <View style={[styles.statIconBox, { backgroundColor: item.color + "18" }]}>
        <Icon size={22} color={item.color} />
      </View>
      <Text style={styles.statValue}>
        {item.value}
        {item.unit ? (
          <Text style={[styles.statUnit, { color: item.color }]}>
            {" "}
            {item.unit}
          </Text>
        ) : null}
      </Text>
      <Text style={styles.statLabel}>{item.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  statCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderStyle: "dashed",
    padding: 14,
    gap: 8,
    overflow: "hidden",
  },
  statArc: {
    position: "absolute",
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 10,
    top: -30,
    left: -30,
  },
  statIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
  },
  statValue: {
    fontSize: 22,
    fontFamily: "Alex_700",
    color: Colors.textPrimary,
  },
  statUnit: {
    fontSize: 12,
    fontFamily: "Alex_600",
  },
  statLabel: {
    fontSize: 12,
    fontFamily: "Alex_400",
    color: Colors.textSecondary,
  },
});
