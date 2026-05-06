import React, { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { InfoRow, InfoRowData } from "./InfoRow";

interface SessionInfoCardProps {
  subject: string;
  rows: InfoRowData[];
}

export const SessionInfoCard = memo(function SessionInfoCard({
  subject,
  rows,
}: SessionInfoCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.subjectPill}>
        <Text style={styles.subjectText}>{subject}</Text>
      </View>
      {rows.map((row, i) => (
        <InfoRow
          key={row.label}
          icon={row.icon}
          label={row.label}
          value={row.value}
          showDivider={i < rows.length - 1}
        />
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    zIndex: 1,
    paddingTop: 44,
    paddingBottom: 20,
    paddingHorizontal: 24,
  },
  subjectPill: {
    backgroundColor: "#FEF3E2",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  subjectText: {
    fontFamily: "Alex_700",
    fontSize: 16,
    color: "#1B3A4B",
  },
});
