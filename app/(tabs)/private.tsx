import { LogSession } from "@/components/PrivateLog/Types";
import { ScreenHeader } from "@/components/Ui/screen-header";
import { Colors } from "@/constants/colors";
import { useAppDispatch, useAppSelector } from "@/hooks/store-hooks";
import { PrivateDashboard } from "@/screens/PrivateDashboard";
import { PrivateLog } from "@/screens/PrivateLog";
import {
  acceptPrivateBooking,
  fetchPrivateBookings,
  rejectPrivateBooking,
  type PrivateSessionBooking,
} from "@/store/private";
import { useFocusEffect } from "expo-router";
import { User } from "lucide-react-native";
import { useCallback, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type TabId = "requests" | "log";

const TABS: { id: TabId; label: string }[] = [
  { id: "requests", label: "الطلبات" },
  { id: "log", label: "السجل" },
];

export default function PrivateScreen() {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<TabId>("requests");
  const { requests, isLoading, isRefreshing, actionLoadingId } = useAppSelector(
    (state) => state.private,
  );

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchPrivateBookings());
    }, [dispatch]),
  );

  const onRefresh = useCallback(() => {
    dispatch(fetchPrivateBookings({ refresh: true }));
  }, [dispatch]);

  const onAccept = useCallback(
    async (booking: PrivateSessionBooking) => {
      try {
        await dispatch(acceptPrivateBooking(booking)).unwrap();
        dispatch(fetchPrivateBookings({ refresh: true }));
      } catch {}
    },
    [dispatch],
  );

  const onReject = useCallback(
    async (booking: PrivateSessionBooking) => {
      try {
        await dispatch(rejectPrivateBooking(booking)).unwrap();
        dispatch(fetchPrivateBookings({ refresh: true }));
      } catch {}
    },
    [dispatch],
  );

  const newCount = requests.new.length;

  const logSessions = useMemo<LogSession[]>(
    () => [
      ...requests.accepted.map((b) => ({
        id: b.id,
        student: b.studentName,
        subject: b.subject,
        date: b.date,
        time: b.time,
        status: "approved" as const,
        price: b.duration,
      })),
      ...requests.cancelled.map((b) => ({
        id: b.id,
        student: b.studentName,
        subject: b.subject,
        date: b.date,
        time: b.time,
        status: "cancelled" as const,
        price: b.duration,
      })),
    ],
    [requests.accepted, requests.cancelled],
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScreenHeader title="الحصص الفردية" icon={User} />

      <View style={styles.tabsWrap}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const showBadge = tab.id === "requests" && newCount > 0;
          return (
            <Pressable
              key={tab.id}
              style={[styles.tabPill, isActive && styles.tabPillActive]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {tab.label}
              </Text>
              {showBadge && (
                <View style={[styles.badge, isActive && styles.badgeActive]}>
                  <Text
                    style={[
                      styles.badgeText,
                      isActive && styles.badgeTextActive,
                    ]}
                  >
                    {newCount > 9 ? "9+" : newCount}
                  </Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      {activeTab === "requests" && (
        <PrivateDashboard
          requests={requests.new}
          isLoading={isLoading}
          isRefreshing={isRefreshing}
          actionLoadingId={actionLoadingId}
          onAccept={onAccept}
          onReject={onReject}
          onRefresh={onRefresh}
        />
      )}
      {activeTab === "log" && <PrivateLog sessions={logSessions} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  tabsWrap: {
    width: "100%",
    flexDirection: "row-reverse",
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  tabPill: {
    flex: 1,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    textAlign: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    backgroundColor: Colors.surfaceAlt,
  },
  tabPillActive: {
    backgroundColor: "#D18C2D",
    borderColor: "#D18C2D",
  },
  tabText: {
    fontSize: 13,
    fontFamily: "Alex_600",
    color: Colors.textMuted,
    writingDirection: "rtl",
    textAlign: "center",
  },
  tabTextActive: {
    color: "#fff",
    fontFamily: "Alex_700",
  },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.borderLight,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeActive: { backgroundColor: "rgba(255,255,255,0.25)" },
  badgeText: {
    fontSize: 11,
    fontFamily: "Alex_700",
    color: Colors.textMuted,
  },
  badgeTextActive: { color: "#fff" },
});
