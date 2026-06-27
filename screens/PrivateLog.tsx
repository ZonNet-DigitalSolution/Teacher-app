import EmptyLogIcon from "@/assets/svg/EmptyLog.svg";
import { SessionRow } from "@/components/PrivateLog/SessionRow";
import {
  FILTER_TABS,
  LogSession,
  SessionStatus,
} from "@/components/PrivateLog/Types";
import { Colors } from "@/constants/colors";
import { Search, X } from "lucide-react-native";
import { useMemo, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export function PrivateLog({ sessions = [] }: { sessions?: LogSession[] }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<SessionStatus | "all">("all");

  const filtered = useMemo(() => {
    return sessions.filter((s) => {
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

      {/* Filter chips + count on same row */}
      <View style={styles.filterRow}>
        <Text style={styles.countText}>{filtered.length} جلسة</Text>
        <FlatList
          data={FILTER_TABS}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(t) => t.id}
          contentContainerStyle={styles.filterContent}
          style={styles.filterList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterChip,
                filter === item.id && styles.filterChipActive,
              ]}
              onPress={() => setFilter(item.id)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.filterChipText,
                  filter === item.id && styles.filterChipTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Sessions */}
      <FlatList
        data={filtered}
        keyExtractor={(s) => s.id}
        renderItem={({ item }) => <SessionRow item={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <EmptyLogIcon width={120} height={130} />
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
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 50,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Alex_400",
    color: Colors.textPrimary,
  },
  clearBtn: { padding: 2 },
  hidden: { opacity: 0 },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 16,
    marginBottom: 10,
  },
  countText: {
    fontSize: 12,
    fontFamily: "Alex_600",
    backgroundColor: "#FFFCDE",
    borderRadius: 50,
    paddingHorizontal: 16,
    paddingVertical: 4,
    color: "#E0B401",
    minWidth: 44,
  },
  filterList: { marginLeft: "auto" },
  filterContent: {
    flexDirection: "row-reverse",
    marginLeft: "auto",
    paddingHorizontal: 16,
    gap: 8,
    paddingVertical: 2,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipText: {
    fontSize: 12,
    fontFamily: "Alex_600",
    color: "#3B3B3C",
  },
  filterChipTextActive: { color: "white" },
  listContent: { paddingHorizontal: 16, gap: 10 },
  emptyState: { alignItems: "center", paddingVertical: 60, gap: 8 },
  emptyTitle: {
    fontSize: 15,
    fontFamily: "Alex_600",
    color: Colors.textSecondary,
  },
  emptyHint: {
    fontSize: 13,
    fontFamily: "Alex_400",
    color: Colors.textTertiary,
  },
  footer: { height: 100 },
});
