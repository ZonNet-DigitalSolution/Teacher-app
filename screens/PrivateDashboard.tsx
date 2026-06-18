import { RequestCard } from "@/components/PrivateDashboard/RequestCard";
import { SectionHeader } from "@/components/PrivateDashboard/SectionHeader";
import { UpcomingCard } from "@/components/PrivateDashboard/UpcomingCard";
import { Colors } from "@/constants/colors";
import { BookOpen } from "lucide-react-native";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const MOCK_REQUESTS = [
  { id: "1", student: "أحمد محمد", subject: "رياضيات", date: "2025-06-20", time: "10:00", price: "150" },
  { id: "2", student: "سارة علي", subject: "فيزياء", date: "2025-06-21", time: "14:00", price: "200" },
];

const MOCK_UPCOMING = [
  { id: "1", student: "محمد أحمد", subject: "كيمياء", date: "2025-06-19", time: "09:00", isToday: true },
];

export function PrivateDashboard() {
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {MOCK_REQUESTS.length > 0 && (
        <View style={styles.section}>
          <SectionHeader title="طلبات معلقة" badge={MOCK_REQUESTS.length} />
          {MOCK_REQUESTS.map((r) => (
            <RequestCard
              key={r.id}
              item={r}
              onAccept={(id) => console.log("accept", id)}
              onReject={(id) => console.log("reject", id)}
            />
          ))}
        </View>
      )}

      <View style={styles.section}>
        <SectionHeader title="الجلسات القادمة" />
        {MOCK_UPCOMING.length > 0 ? (
          MOCK_UPCOMING.map((s) => (
            <UpcomingCard key={s.id} item={s} />
          ))
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

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingTop: 16 },
  section: { paddingHorizontal: 16, marginTop: 24, gap: 20 },
  emptyState: { alignItems: "center", paddingVertical: 40, gap: 12 },
  emptyText: { fontSize: 14, fontFamily: "Alex_400", color: Colors.textTertiary },
  footer: { height: 100 },
});
