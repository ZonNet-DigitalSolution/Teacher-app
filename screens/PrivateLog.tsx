import { SessionRow } from "@/components/PrivateLog/SessionRow";
import { FILTER_TABS, LogSession, SessionStatus } from "@/components/PrivateLog/Types";
import { Colors } from "@/constants/colors";
import { BookOpen, Search, X } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const LOG_DATA: LogSession[] = [
  { id: "1", student: "سارة أحمد", subject: "الجبر المتقدم", date: "٢٥ فبراير", time: "10:00 - 10:45", status: "completed", price: "٢٥٠", rating: 5 },
  { id: "2", student: "عمر خالد", subject: "حساب التفاضل", date: "٢٦ فبراير", time: "14:30 - 15:15", status: "completed", price: "٢٥٠", rating: 4 },
  { id: "3", student: "نورة سعد", subject: "الإحصاء التطبيقي", date: "٢٧ فبراير", time: "11:00 - 11:45", status: "cancelled", price: "٣٠٠" },
  { id: "4", student: "فهد العتيبي", subject: "الرياضيات الأساسية", date: "٢٨ فبراير", time: "09:00 - 09:45", status: "approved", price: "٢٠٠" },
  { id: "5", student: "منى الزهراني", subject: "الجبر", date: "١ مارس", time: "15:00 - 15:45", status: "pending", price: "٢٥٠" },
  { id: "6", student: "أحمد الغامدي", subject: "حساب التفاضل", date: "٢ مارس", time: "10:00 - 10:45", status: "completed", price: "٢٥٠", rating: 5 },
  { id: "7", student: "ريم العتيبي", subject: "الإحصاء", date: "٣ مارس", time: "13:00 - 13:45", status: "approved", price: "٢٠٠" },
  { id: "8", student: "خالد السبيعي", subject: "الجبر المتقدم", date: "٤ مارس", time: "16:00 - 16:45", status: "completed", price: "٢٥٠", rating: 3 },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export function PrivateLog() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<SessionStatus | "all">("all");

  const filtered = useMemo(() => {
    return LOG_DATA.filter((s) => {
      const matchStatus = filter === "all" || s.status === filter;
      const matchSearch =
        search.trim() === "" ||
        s.student.includes(search) ||
        s.subject.includes(search);
      return matchStatus && matchSearch;
    });
  }, [search, filter]);

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchRow}>
        <TouchableOpacity
          style={[styles.clearBtn, search.length === 0 && styles.hidden]}
          onPress={() => setSearch("")}
        >
          <X size={15} color={Colors.textTertiary} />
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder="ابحث باسم الطالب أو المادة..."
          placeholderTextColor={Colors.textPlaceholder}
          value={search}
          onChangeText={setSearch}
          textAlign="right"
        />
        <Search size={17} color={Colors.textTertiary} />
      </View>

      {/* Filter chips */}
      <FlatList
        data={FILTER_TABS}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(t) => t.id}
        contentContainerStyle={styles.filterContent}
        style={styles.filterList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.filterChip, filter === item.id && styles.filterChipActive]}
            onPress={() => setFilter(item.id)}
            activeOpacity={0.8}
          >
            <Text style={[styles.filterChipText, filter === item.id && styles.filterChipTextActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Results count */}
      <View style={styles.countRow}>
        <Text style={styles.countText}>{filtered.length} جلسة</Text>
      </View>

      {/* Sessions */}
      <FlatList
        data={filtered}
        keyExtractor={(s) => s.id}
        renderItem={({ item }) => <SessionRow item={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <BookOpen size={44} color={Colors.textTertiary} />
            <Text style={styles.emptyTitle}>لا توجد جلسات</Text>
            <Text style={styles.emptyHint}>جرّب تغيير معايير البحث</Text>
          </View>
        }
        ListFooterComponent={<View style={styles.footer} />}
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 10,
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 10,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 46,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  searchInput: { flex: 1, fontSize: 14, fontFamily: "Alex_400", color: Colors.textPrimary },
  clearBtn: { padding: 2 },
  hidden: { opacity: 0 },
  filterList: { flexGrow: 0, marginBottom: 4 },
  filterContent: { flexDirection: "row-reverse", paddingHorizontal: 16, gap: 8, paddingVertical: 4 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: Colors.surfaceAlt, borderWidth: 1, borderColor: Colors.borderLight },
  filterChipActive: { backgroundColor: Colors.primaryLight, borderColor: Colors.primary },
  filterChipText: { fontSize: 13, fontFamily: "Alex_400", color: Colors.textSecondary },
  filterChipTextActive: { fontFamily: "Alex_600", color: Colors.primary },
  countRow: { paddingHorizontal: 16, paddingBottom: 8, alignItems: "flex-end" },
  countText: { fontSize: 12, fontFamily: "Alex_400", color: Colors.textTertiary },
  listContent: { paddingHorizontal: 16 },
  separator: { height: 1, backgroundColor: Colors.borderLight, marginHorizontal: 4 },
  emptyState: { alignItems: "center", paddingVertical: 60, gap: 8 },
  emptyTitle: { fontSize: 15, fontFamily: "Alex_600", color: Colors.textSecondary },
  emptyHint: { fontSize: 13, fontFamily: "Alex_400", color: Colors.textTertiary },
  footer: { height: 100 },
});
