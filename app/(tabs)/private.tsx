import { ScreenHeader } from "@/components/Ui/screen-header";
import { Colors } from "@/constants/colors";
import { useAppDispatch, useAppSelector } from "@/hooks/store-hooks";
import { PrivateDashboard } from "@/screens/PrivateDashboard";
import {
  acceptPrivateBooking,
  fetchPrivateBookings,
  rejectPrivateBooking,
  type PrivateSessionBooking,
  type PrivateTabId,
} from "@/store/private";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Inbox,
  Radio,
  User,
  UserRound,
  XCircle,
} from "lucide-react-native";
import React, { useCallback } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type BookingCardTone = "success" | "error";

const PRIVATE_TABS: {
  id: PrivateTabId;
  label: string;
  icon: React.ComponentType<{ size: number; color: string; strokeWidth?: number }>;
}[] = [
  { id: "new", label: "طلبات جديدة", icon: Radio },
  { id: "accepted", label: "الطلبات المقبولة", icon: CheckCircle2 },
  { id: "cancelled", label: "الملغية", icon: XCircle },
];

const TONE_STYLES: Record<BookingCardTone, { bg: string; color: string; border: string }> = {
  success: { bg: "#ECFDF3", color: Colors.success, border: "#BBF7D0" },
  error: { bg: Colors.errorBg, color: Colors.error, border: Colors.errorBorder },
};

const EMPTY_TEXT: Record<PrivateTabId, { title: string; hint: string }> = {
  new: {
    title: "لا توجد طلبات حصص فردية حالياً",
    hint: "ستظهر هنا طلبات الحصص الفردية الجديدة عند وصولها",
  },
  accepted: {
    title: "لا توجد طلبات مقبولة حالياً",
    hint: "ستظهر هنا الطلبات التي تم قبولها",
  },
  cancelled: {
    title: "لا توجد طلبات ملغية حالياً",
    hint: "ستظهر هنا الطلبات التي تم إلغاؤها أو رفضها",
  },
};

function isPrivateTab(value: string | undefined): value is PrivateTabId {
  return value === "new" || value === "accepted" || value === "cancelled";
}

function PrivateBookingList({
  tabId,
  items,
  isLoading,
  isRefreshing,
  onRefresh,
}: {
  tabId: Exclude<PrivateTabId, "new">;
  items: PrivateSessionBooking[];
  isLoading: boolean;
  isRefreshing: boolean;
  onRefresh: () => void;
}) {
  if (isLoading && items.length === 0) {
    return (
      <View style={styles.loadingState}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.listScroll}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          tintColor={Colors.primary}
          colors={[Colors.primary]}
        />
      }
    >
      {items.length > 0 ? (
        items.map((item) => <PrivateBookingCard key={item.id} item={item} tone={tabId === "accepted" ? "success" : "error"} />)
      ) : (
        <PrivateEmptyState tabId={tabId} />
      )}
      <View style={styles.listFooter} />
    </ScrollView>
  );
}

function PrivateBookingCard({
  item,
  tone,
}: {
  item: PrivateSessionBooking;
  tone: BookingCardTone;
}) {
  const toneStyle = TONE_STYLES[tone];
  const subtitle =
    tone === "success" ? "تم قبول الطلب وينتظر متابعة الحصة" : "تم إلغاء الطلب";

  return (
    <View style={[styles.bookingCard, { borderColor: toneStyle.border }]}>
      <View style={styles.bookingCardTop}>
        <View style={[styles.bookingIcon, { backgroundColor: toneStyle.bg }]}>
          <BookOpen size={19} color={toneStyle.color} strokeWidth={2.2} />
        </View>
        <View style={styles.bookingTitleBlock}>
          <Text style={styles.bookingTitle}>حصة {item.subject}</Text>
          <Text style={styles.bookingSubtitle}>{subtitle}</Text>
        </View>
        <View style={[styles.bookingStatusBadge, { backgroundColor: toneStyle.bg }]}>
          <Text style={[styles.bookingStatusText, { color: toneStyle.color }]}>
            {item.statusLabel}
          </Text>
        </View>
      </View>

      <View style={styles.bookingDivider} />

      <View style={styles.bookingDetailsGrid}>
        <InfoPill icon={UserRound} label={item.studentName} />
        <InfoPill icon={BookOpen} label={item.subject} />
        <InfoPill icon={CalendarDays} label={item.date} />
        <InfoPill icon={Clock3} label={item.time} />
      </View>

      <View style={[styles.metaStrip, { backgroundColor: toneStyle.bg }]}>
        <Text style={[styles.metaText, { color: toneStyle.color }]}>{item.duration}</Text>
      </View>
    </View>
  );
}

function PrivateEmptyState({ tabId }: { tabId: PrivateTabId }) {
  const copy = EMPTY_TEXT[tabId];

  return (
    <View style={styles.emptyState}>
      <Inbox size={44} color={Colors.borderLight} strokeWidth={1.8} />
      <Text style={styles.emptyTitle}>{copy.title}</Text>
      <Text style={styles.emptyHint}>{copy.hint}</Text>
    </View>
  );
}

function InfoPill({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ size: number; color: string; strokeWidth?: number }>;
  label: string;
}) {
  return (
    <View style={styles.infoPill}>
      <Icon size={14} color={Colors.textSecondary} strokeWidth={2} />
      <Text style={styles.infoPillText}>{label}</Text>
    </View>
  );
}

export default function PrivateScreen() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { tab } = useLocalSearchParams<{ tab?: string }>();
  const activeTab: PrivateTabId = isPrivateTab(tab) ? tab : "new";
  const { requests, isLoading, isRefreshing, actionLoadingId } = useAppSelector(
    (state) => state.private,
  );

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchPrivateBookings());
    }, [dispatch]),
  );

  const refreshBookings = useCallback(() => {
    dispatch(fetchPrivateBookings({ refresh: true }));
  }, [dispatch]);

  const handleAccept = useCallback(
    async (id: string) => {
      try {
        await dispatch(acceptPrivateBooking(id)).unwrap();
        dispatch(fetchPrivateBookings({ refresh: true }));
      } catch {
        // Global API alert is handled by services/api.ts.
      }
    },
    [dispatch],
  );

  const handleReject = useCallback(
    async (id: string) => {
      try {
        await dispatch(rejectPrivateBooking(id)).unwrap();
        dispatch(fetchPrivateBookings({ refresh: true }));
      } catch {
        // Global API alert is handled by services/api.ts.
      }
    },
    [dispatch],
  );

  const counts: Record<PrivateTabId, number> = {
    new: requests.new.length,
    accepted: requests.accepted.length,
    cancelled: requests.cancelled.length,
  };

  const backButton = (
    <TouchableOpacity onPress={() => router.replace("/(tabs)")} style={styles.backBtn}>
      <ChevronRight size={22} color={Colors.textPrimary} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScreenHeader title="الحصص الفردية" icon={User} rightAction={backButton} />
      <View style={styles.tabsWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContent}
        >
          {PRIVATE_TABS.map((tabItem) => {
            const isActive = activeTab === tabItem.id;
            const Icon = tabItem.icon;
            const count = counts[tabItem.id];

            return (
              <TouchableOpacity
                key={tabItem.id}
                style={[styles.tabPill, isActive && styles.tabPillActive]}
                onPress={() => router.setParams({ tab: tabItem.id })}
                activeOpacity={0.82}
              >
                <Icon
                  size={16}
                  color={isActive ? "#fff" : Colors.textMuted}
                  strokeWidth={2}
                />
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                  {tabItem.label}
                </Text>
                <View style={[styles.tabCountBadge, isActive && styles.tabCountBadgeActive]}>
                  <Text style={[styles.tabCountText, isActive && styles.tabCountTextActive]}>
                    {count}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
      {activeTab === "new" ? (
        <PrivateDashboard
          requests={requests.new}
          isLoading={isLoading}
          isRefreshing={isRefreshing}
          actionLoadingId={actionLoadingId}
          onAccept={handleAccept}
          onReject={handleReject}
          onRefresh={refreshBookings}
        />
      ) : (
        <PrivateBookingList
          tabId={activeTab}
          items={requests[activeTab]}
          isLoading={isLoading}
          isRefreshing={isRefreshing}
          onRefresh={refreshBookings}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  tabsWrap: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    paddingBottom: 12,
  },
  tabsContent: {
    flexDirection: "row-reverse",
    gap: 10,
    paddingHorizontal: 16,
  },
  tabPill: {
    minHeight: 42,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  tabPillActive: {
    backgroundColor: "#0F5B78",
  },
  tabText: {
    fontSize: 14,
    fontFamily: "Alex_600",
    color: Colors.textMuted,
    writingDirection: "rtl",
  },
  tabTextActive: {
    color: "#fff",
    fontFamily: "Alex_700",
  },
  tabCountBadge: {
    minWidth: 30,
    height: 24,
    borderRadius: 12,
    paddingHorizontal: 8,
    backgroundColor: "#0F5B78",
    alignItems: "center",
    justifyContent: "center",
  },
  tabCountBadgeActive: {
    backgroundColor: "#F3A42A",
    borderWidth: 1,
    borderColor: "#fff",
  },
  tabCountText: {
    fontSize: 13,
    fontFamily: "Alex_700",
    color: "#fff",
    lineHeight: 16,
  },
  tabCountTextActive: {
    color: "#fff",
  },
  loadingState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  listScroll: { flex: 1 },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 12,
  },
  bookingCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
  },
  bookingCardTop: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 10,
  },
  bookingIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  bookingTitleBlock: {
    flex: 1,
    alignItems: "flex-end",
  },
  bookingTitle: {
    fontSize: 15,
    fontFamily: "Alex_700",
    color: Colors.textPrimary,
    textAlign: "right",
    writingDirection: "rtl",
  },
  bookingSubtitle: {
    fontSize: 12,
    fontFamily: "Alex_400",
    color: Colors.textSecondary,
    textAlign: "right",
    writingDirection: "rtl",
    marginTop: 2,
  },
  bookingStatusBadge: {
    borderRadius: 50,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  bookingStatusText: {
    fontSize: 11,
    fontFamily: "Alex_700",
    writingDirection: "rtl",
  },
  bookingDivider: {
    height: 1,
    backgroundColor: Colors.borderInput,
    marginVertical: 12,
  },
  bookingDetailsGrid: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 8,
  },
  infoPill: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 5,
    minHeight: 32,
    borderRadius: 10,
    backgroundColor: Colors.surfaceAlt,
    paddingHorizontal: 10,
  },
  infoPillText: {
    fontSize: 12,
    fontFamily: "Alex_500",
    color: Colors.textMuted,
    writingDirection: "rtl",
  },
  metaStrip: {
    alignSelf: "flex-end",
    borderRadius: 10,
    marginTop: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  metaText: {
    fontSize: 12,
    fontFamily: "Alex_700",
    writingDirection: "rtl",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 52,
    paddingBottom: 40,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: "Alex_700",
    color: Colors.textMuted,
    textAlign: "center",
    writingDirection: "rtl",
  },
  emptyHint: {
    fontSize: 13,
    fontFamily: "Alex_400",
    color: Colors.textSecondary,
    textAlign: "center",
    writingDirection: "rtl",
  },
  listFooter: { height: 90 },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },
});
