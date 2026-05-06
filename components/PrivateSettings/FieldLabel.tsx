import { Colors } from "@/constants/colors";
import { Info } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export function FieldLabel({ label, hint }: { label: string; hint?: string }) {
  return (
    <View style={styles.fieldLabelRow}>
      {hint && <Info size={13} color={Colors.textTertiary} />}
      <Text style={styles.fieldLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fieldLabelRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 5,
    marginBottom: 7,
    marginTop: 14,
  },
  fieldLabel: {
    fontSize: 13,
    fontFamily: "Alex_600",
    color: Colors.textPrimary,
  },
});
