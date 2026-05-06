import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SessionStatus, STATUS_CONFIG } from "./Types";

export function StatusBadge({ status }: { status: SessionStatus }) {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;
  return (
    <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
      <Icon size={11} color={cfg.color} />
      <Text style={[styles.badgeText, { color: cfg.color }]}>{cfg.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: "Alex_600",
  },
});
