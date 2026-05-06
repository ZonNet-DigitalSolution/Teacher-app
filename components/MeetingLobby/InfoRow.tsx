import React, { memo } from "react";
import { StyleSheet, Text, View } from "react-native";

export interface InfoRowData {
  icon: React.ReactNode;
  label: string;
  value: string;
}

interface InfoRowProps extends InfoRowData {
  showDivider?: boolean;
}

export const InfoRow = memo(function InfoRow({
  icon,
  label,
  value,
  showDivider,
}: InfoRowProps) {
  return (
    <View>
      <View style={styles.row}>
        <Text style={styles.value}>{value}</Text>
        <View style={styles.labelWrap}>
          <Text style={styles.label}>{label}</Text>
          {icon}
        </View>
      </View>
      {showDivider && <View style={styles.divider} />}
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
  },
  labelWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  label: {
    fontFamily: "Alex_400",
    fontSize: 14,
    color: "#888",
  },
  value: {
    fontFamily: "Alex_700",
    fontSize: 14,
    color: "#1B3A4B",
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
  },
});
