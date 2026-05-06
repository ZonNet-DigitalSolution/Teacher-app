import { Colors } from "@/constants/colors";
import React, { memo } from "react";
import { StyleSheet, Text, View } from "react-native";

const LEGEND_ITEMS = [
  { color: Colors.success, bg: Colors.successBg, label: "متاح" },
  { color: Colors.info, bg: "#B1E2FE", label: "محجوز" },
  { color: Colors.textTertiary, bg: "#E0DFDB", label: "غير محدد" },
];

export const Legend = memo(function Legend() {
  return (
    <View style={styles.card}>
      <View style={styles.items}>
        {LEGEND_ITEMS.map((item) => (
          <View key={item.label} style={styles.item}>
            <View
              style={[
                styles.swatch,
                { backgroundColor: item.bg, borderColor: item.color },
              ]}
            />
            <Text style={[styles.text, { color: item.color }]}>
              {item.label}
            </Text>
          </View>
        ))}
      </View>
      <Text style={styles.hint}>اضغط على الوقت للتفعيل أو الإلغاء</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 14,
    backgroundColor: "#F5F5F4",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 6,
  },
  items: {
    flexDirection: "row-reverse",
    gap: 16,
    alignItems: "center",
  },
  item: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 6,
  },
  swatch: {
    width: 12,
    height: 12,
    borderRadius: 2,
    // borderWidth: 1.5,
  },
  text: {
    fontSize: 12,
    fontFamily: "Alex_600",
  },
  hint: {
    fontSize: 11,
    fontFamily: "Alex_400",
    color: "#676767",
    textAlign: "right",
  },
});
