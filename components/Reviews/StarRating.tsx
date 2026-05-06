import { Colors } from "@/constants/colors";
import { Star } from "lucide-react-native";
import React, { memo } from "react";
import { StyleSheet, Text, View } from "react-native";

interface StarRatingProps {
  rating: number;
}

export const StarRating = memo(function StarRating({ rating }: StarRatingProps) {
  return (
    <View style={styles.row}>
      <Star size={18} color={Colors.primary} fill={Colors.primary} />
      <Text style={styles.text}>{rating}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  text: {
    fontFamily: "Alex_700",
    fontSize: 16,
    color: Colors.textPrimary,
  },
});
