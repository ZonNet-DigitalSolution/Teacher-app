import { Colors } from "@/constants/colors";
import { ChevronRight } from "lucide-react-native";
import React, { memo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface NavHeaderProps {
  title: string;
  onBack: () => void;
}

export const NavHeader = memo(function NavHeader({ title, onBack }: NavHeaderProps) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity style={styles.backBtn} onPress={onBack}>
        <ChevronRight size={22} color={Colors.textPrimary} />
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 10,
    borderBottomColor: Colors.borderLight,
  },
  title: {
    fontFamily: "Alex_700",
    fontSize: 18,
    color: Colors.textPrimary,
    marginLeft: "auto",
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: Colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },
});
