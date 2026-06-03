import { Colors } from "@/constants/colors";
import { RootState } from "@/store";
import { notificationsService } from "@/services/notificationsService";
import { useRouter } from "expo-router";
import { User } from "lucide-react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";

type Props = { name: string };

export function HomeHeader({ name }: Props) {
  const router = useRouter();
  const userImage = useSelector(
    (state: RootState) =>
      state.teacher.profileImage || state.auth.user?.profileImage,
  );

  const [unreadCount, setUnreadCount] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchUnread = useCallback(async () => {
    try {
      const count = await notificationsService.getUnreadCount();
      setUnreadCount(count);
    } catch {
      // silent — bell count is non-critical
    }
  }, []);

  useEffect(() => {
    fetchUnread();
    intervalRef.current = setInterval(fetchUnread, 30_000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchUnread]);

  return (
    <View style={styles.header}>
      <View style={styles.icons}>
        <TouchableOpacity
          style={styles.bellWrap}
          onPress={() => router.push("/notifications")}
          activeOpacity={0.8}
        >
          <Image
            source={require("@/assets/images/bell.png")}
            style={styles.bell}
            resizeMode="contain"
          />
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {unreadCount > 99 ? "99+" : unreadCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.userRow}>
        <View style={styles.userText}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.welcome}>مرحباً بعودتك !</Text>
        </View>
        <View style={styles.avatar}>
          {userImage ? (
            <Image
              source={{ uri: userImage }}
              style={styles.avatarImage}
              resizeMode="cover"
            />
          ) : (
            <User size={24} color={Colors.primary} />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  userText: {
    alignItems: "flex-end",
  },
  name: {
    fontFamily: "Alex_700",
    fontSize: 17,
    color: "#111",
  },
  welcome: {
    fontFamily: "Alex_400",
    fontSize: 13,
    color: "#888",
    textAlign: "right",
    marginTop: 1,
  },
  icons: {
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
  },
  bell: {
    width: 30,
    height: 30,
  },
  bellWrap: {
    padding: 5,
    backgroundColor: "#FEF3EF",
    borderRadius: 50,
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "#ef4444",
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: "#fff",
  },
  badgeText: {
    color: "#fff",
    fontSize: 9,
    fontFamily: "Alex_700",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.primary,
    overflow: "hidden",
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});
