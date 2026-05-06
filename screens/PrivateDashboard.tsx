import { RequestCard } from "@/components/PrivateDashboard/RequestCard";
import { SectionHeader } from "@/components/PrivateDashboard/SectionHeader";
import {
  PendingRequest,
  StatItem,
  UpcomingSession,
} from "@/components/PrivateDashboard/Types";
import { UpcomingCard } from "@/components/PrivateDashboard/UpcomingCard";
import { Colors } from "@/constants/colors";
import { BookOpen, Clock, DollarSign, Users } from "lucide-react-native";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const STATS: StatItem[] = [
  {
    label: "الأرباح",
    value: "١,٢٥٠",
    unit: "ريال",
    color: Colors.success,
    icon: DollarSign,
  },
  { label: "الطلاب", value: "١٢", unit: "", color: Colors.info, icon: Users },
  {
    label: "قادمة",
    value: "٣",
    unit: "",
    color: Colors.purple,
    icon: BookOpen,
  },
  { label: "طلبات", value: "٢", unit: "", color: Colors.warning, icon: Clock },
];

const INITIAL_REQUESTS: PendingRequest[] = [
  {
    id: "1",
    student: "ريم العتيبي",
    subject: "الجبر",
    date: "السبت، ٨ مارس",
    time: "10:00",
    price: "٢٥٠ ",
  },
  {
    id: "2",
    student: "خالد السبيعي",
    subject: "حساب التفاضل",
    date: "الأحد، ٩ مارس",
    time: "14:00",
    price: "٢٥٠ ",
  },
];

const UPCOMING: UpcomingSession[] = [
  {
    id: "1",
    student: "سارة أحمد",
    subject: "الجبر المتقدم",
    date: "اليوم",
    time: "10:00 - 10:45",
    isToday: true,
  },
  {
    id: "2",
    student: "نورة سعد",
    subject: "الإحصاء التطبيقي",
    date: "غداً",
    time: "11:00 - 11:45",
    isToday: false,
  },
  {
    id: "3",
    student: "عمر خالد",
    subject: "حساب التفاضل",
    date: "الاثنين",
    time: "14:30 - 15:15",
    isToday: false,
  },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export function PrivateDashboard() {
  const { width: screenW } = useWindowDimensions();
  const cardWidth = Math.floor((screenW - 32 - 12) / 2);
  const [requests, setRequests] = useState(INITIAL_REQUESTS);

  function handleAccept(id: string) {
    setRequests((prev) => prev.filter((r) => r.id !== id));
  }

  function handleReject(id: string) {
    setRequests((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Stats 2-column grid */}
      {/* <View style={styles.statsGrid}>
        {STATS.map((s) => (
          <StatCard key={s.label} item={s} width={cardWidth} />
        ))}
      </View> */}

      {/* Pending Requests */}
      {requests.length > 0 && (
        <View style={styles.section}>
          <SectionHeader title="طلبات معلقة" badge={requests.length} />
          {requests.map((r) => (
            <RequestCard
              key={r.id}
              item={r}
              onAccept={handleAccept}
              onReject={handleReject}
            />
          ))}
        </View>
      )}

      {/* Upcoming Sessions */}
      <View style={styles.section}>
        <SectionHeader title="الجلسات القادمة" />
        {UPCOMING.length > 0 ? (
          UPCOMING.map((s) => <UpcomingCard key={s.id} item={s} />)
        ) : (
          <View style={styles.emptyState}>
            <BookOpen size={40} color={Colors.textTertiary} />
            <Text style={styles.emptyText}>لا توجد جلسات قادمة</Text>
          </View>
        )}
      </View>

      <View style={styles.footer} />
    </ScrollView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingTop: 16 },
  statsGrid: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 12,
    paddingBottom: 4,
  },
  section: { paddingHorizontal: 16, marginTop: 24, gap: 20 },
  emptyState: { alignItems: "center", paddingVertical: 40, gap: 12 },
  emptyText: {
    fontSize: 14,
    fontFamily: "Alex_400",
    color: Colors.textTertiary,
  },
  footer: { height: 100 },
});
