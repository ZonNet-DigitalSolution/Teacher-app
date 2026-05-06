import { Colors } from "@/constants/colors";
import { Star } from "lucide-react-native";
import React from "react";
import { StyleSheet, View } from "react-native";

export function RatingStars({ rating }: { rating: number }) {
  return (
    <View style={styles.starsRow}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={11}
          color={i < rating ? Colors.primary : Colors.border}
          fill={i < rating ? Colors.primary : "transparent"}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  starsRow: {
    flexDirection: "row-reverse",
    gap: 1,
  },
});
