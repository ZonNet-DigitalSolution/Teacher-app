import { Colors } from "@/constants/colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface ScreenHeaderProps {
  title: string;
  icon: React.ComponentType<{ size: number; color: string }>;
  leftAction?: React.ReactNode;
}

export function ScreenHeader({
  title,
  icon: Icon,
  leftAction,
}: ScreenHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.iconBox}>
        <Icon size={22} color={Colors.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {leftAction ?? <View style={styles.placeholder} />}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    color: Colors.textPrimary,
    fontFamily: "Alex_600",
    textAlign: "right",
    writingDirection: "rtl",
  },
  placeholder: {
    width: 40,
  },
});
