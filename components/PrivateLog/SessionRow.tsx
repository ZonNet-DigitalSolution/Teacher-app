import TargetIcon from "@/assets/svg/Target.svg";
import { Colors } from "@/constants/colors";
import { StyleSheet, Text, View } from "react-native";
import { StatusBadge } from "./StatusBadge";
import { LogSession } from "./Types";

export function SessionRow({ item }: { item: LogSession }) {
  return (
    <View style={styles.card}>
      {/* Top: avatar + name/duration + status badge */}
      <View style={styles.topRow}>
        <StatusBadge status={item.status} />

        <View style={styles.studentBlock}>
          <Text style={styles.name} numberOfLines={1}>
            {item.student}
          </Text>
          <Text style={styles.duration}>{item.price}</Text>
        </View>

        <View style={styles.avatar}>
          <Text style={styles.avatarLetter}>{item.student[0]}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Bottom: subject + icon */}
      <View style={styles.bottomRow}>
        <Text style={styles.subject} numberOfLines={1}>
          {item.subject}
        </Text>
        <TargetIcon width={22} height={22} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 12,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#1B4F72",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarLetter: {
    fontSize: 16,
    fontFamily: "Alex_700",
    color: "#fff",
  },
  studentBlock: {
    flex: 1,
    alignItems: "flex-end",
    gap: 3,
  },
  name: {
    fontSize: 16,
    fontFamily: "Alex_700",
    color: Colors.textPrimary,
    textAlign: "right",
  },
  duration: {
    fontSize: 13,
    fontFamily: "Alex_500",
    color: Colors.primary,
    textAlign: "right",
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: 10,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8,
  },
  subject: {
    fontSize: 14,
    fontFamily: "Alex_600",
    color: Colors.textPrimary,
    textAlign: "right",
    flex: 1,
  },
});
