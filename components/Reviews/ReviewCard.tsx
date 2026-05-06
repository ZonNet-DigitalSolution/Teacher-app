import { Colors } from "@/constants/colors";
import { Review } from "@/types/review.types";
import React, { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Path, Svg } from "react-native-svg";
import { StarRating } from "./StarRating";

export type { Review };

function QuoteIcon() {
  return (
    <Svg width={40} height={30} viewBox="0 0 40 30" fill="none">
      <Path
        d="M17.7332 3.3411V16.3334C17.7332 24.9106 12.7898 27.9699 6.08328 29.6852C5.061 29.9464 4.00344 29.4038 3.63006 28.4172C3.18948 27.2551 3.87492 25.9959 5.07654 25.6788C9.95526 24.3919 11.5143 21.223 10.7537 16.3334H3.34152C2.45529 16.3334 1.60537 15.9813 0.978709 15.3547C0.352052 14.728 0 13.8781 0 12.9919V3.3411C0.000111382 2.45495 0.352213 1.60513 0.978857 0.97856C1.6055 0.351994 2.45537 -6.99986e-09 3.34152 0H14.3917C15.2779 -6.99986e-09 16.1277 0.351994 16.7544 0.97856C17.381 1.60513 17.7331 2.45495 17.7332 3.3411ZM39.9 3.3411V16.3334C39.9 24.9106 34.9562 27.9699 28.2496 29.6852C27.2278 29.9464 26.1702 29.4038 25.7968 28.4172C25.3562 27.2551 26.0417 25.9959 27.2433 25.6788C32.122 24.3919 33.6811 21.223 32.9204 16.3334H25.5079C24.6217 16.3333 23.7719 15.9812 23.1453 15.3545C22.5188 14.7279 22.1668 13.878 22.1668 12.9919V3.3411C22.1669 2.45502 22.5189 1.60526 23.1455 0.978708C23.772 0.352154 24.6218 0.000111366 25.5079 0H36.5585C37.4446 -6.99986e-09 38.2945 0.351994 38.9211 0.97856C39.5478 1.60513 39.8999 2.45495 39.9 3.3411Z"
        fill="#E89B32"
      />
    </Svg>
  );
}

function formatDate(raw?: string | null): string {
  if (!raw) return "";
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  return d.toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

interface ReviewCardProps {
  item: Review;
}

export const ReviewCard = memo(function ReviewCard({ item }: ReviewCardProps) {
  const displayDate = item.date || formatDate(item.created_at);
  const studentName = item.student?.name;
  const grade = item.class_name || item.student?.grade;

  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <StarRating rating={item.rating} />
        <QuoteIcon />
      </View>

      {item.comment ? (
        <Text style={styles.reviewText}>{item.comment}</Text>
      ) : (
        <Text style={styles.emptyText}>لا يوجد تعليق</Text>
      )}

      <View style={styles.footer}>
        <Text style={styles.dateText}>{displayDate}</Text>
        <View style={styles.metaRight}>
          {grade ? (
            <View style={styles.gradeBadge}>
              <Text style={styles.gradeBadgeText}>{grade}</Text>
            </View>
          ) : null}
          {studentName ? (
            <Text style={styles.studentName}>{studentName}</Text>
          ) : null}
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    marginBottom: 14,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  reviewText: {
    fontFamily: "Alex_400",
    fontSize: 14,
    color: Colors.textPrimary,
    textAlign: "right",
    lineHeight: 26,
    marginBottom: 12,
  },
  emptyText: {
    fontFamily: "Alex_400",
    fontSize: 13,
    color: Colors.textTertiary,
    textAlign: "right",
    fontStyle: "italic",
    marginBottom: 12,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateText: {
    fontFamily: "Alex_400",
    fontSize: 12,
    color: Colors.textTertiary,
  },
  metaRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  studentName: {
    fontFamily: "Alex_600",
    fontSize: 13,
    color: Colors.textPrimary,
  },
  gradeBadge: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  gradeBadgeText: {
    fontFamily: "Alex_500",
    fontSize: 11,
    color: Colors.primary,
  },
});
