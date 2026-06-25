import { Colors } from "@/constants/colors";
import { StyleSheet, Text, View } from "react-native";
import { RatingStars } from "./RatingStars";
import { StatusBadge } from "./StatusBadge";
import { LogSession } from "./Types";

export function SessionRow({ item }: { item: LogSession }) {
  return (
    <View style={styles.row}>
      {/* Left: status + rating */}
      <View style={styles.rowLeft}>
        <StatusBadge status={item.status} />
        {item.rating !== undefined && <RatingStars rating={item.rating} />}
      </View>

      {/* Center: subject + time/date */}
      <View style={styles.rowCenter}>
        <Text style={styles.rowSubject} numberOfLines={1}>
          {item.subject}
        </Text>
        <View style={styles.rowTimeRow}>
          <Text style={styles.rowDate}>{item.date}</Text>
          <Text style={styles.rowDot}>·</Text>
          <Text style={styles.rowTime}>{item.time}</Text>
        </View>
      </View>

      {/* Right: avatar + name + price */}
      <View style={styles.rowRight}>
        <View style={styles.rowAvatar}>
          <Text style={styles.rowAvatarText}>{item.student[0]}</Text>
        </View>
        <View style={styles.rowStudentInfo}>
          <Text style={styles.rowName} numberOfLines={1}>
            {item.student}
          </Text>
          <View style={styles.priceRow}>
            <Text style={styles.rowPrice}>{item.price}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    gap: 10,
  },
  rowLeft: {
    alignItems: "center",
    gap: 6,
    width: 62,
  },
  rowCenter: {
    flex: 1,
    alignItems: "flex-end",
    gap: 4,
  },
  rowRight: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
  },
  rowAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  rowAvatarText: {
    fontSize: 14,
    fontFamily: "Alex_700",
    color: Colors.primary,
  },
  rowStudentInfo: { alignItems: "flex-end", maxWidth: 80 },
  priceRow: { flexDirection: "row-reverse", alignItems: "center", gap: 3 },
  rowName: {
    fontSize: 14,
    fontFamily: "Alex_600",
    color: Colors.textPrimary,
  },
  rowPrice: {
    fontSize: 12,
    fontFamily: "Alex_600",
    color: Colors.success,
  },
  rowSubject: {
    fontSize: 13,
    fontFamily: "Alex_600",
    color: Colors.textPrimary,
    textAlign: "right",
  },
  rowTimeRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 4,
  },
  rowDate: {
    fontSize: 11,
    fontFamily: "Alex_400",
    color: Colors.textTertiary,
  },
  rowDot: {
    fontSize: 11,
    color: Colors.textTertiary,
  },
  rowTime: {
    fontSize: 11,
    fontFamily: "Alex_600",
    color: Colors.textMuted,
  },
});
