import { GradeFilter } from "@/components/Reviews/GradeFilter";
import { ReviewCard } from "@/components/Reviews/ReviewCard";
import { NavHeader } from "@/components/Ui/NavHeader";
import { Colors } from "@/constants/colors";
import { API_ENDPOINTS } from "@/constants/endpoints";
import { api, normalizeError } from "@/services/api";
import { Review } from "@/types/review.types";
import { useRouter } from "expo-router";
import { Star } from "lucide-react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function average(reviews: Review[]): string {
  if (!reviews.length) return "0.0";
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return (sum / reviews.length).toFixed(1);
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export function ReviewsScreen() {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGrade, setSelectedGrade] = useState("الكل");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const fetchReviews = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { data } = await api.get<{ data: any[] }>(
        API_ENDPOINTS.REVIEWS.FEEDBACK,
      );
      const list = data.data ?? (data as any);
      setReviews(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(normalizeError(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Build grade options from real data
  const grades = useMemo(() => {
    const seen = new Set<string>();
    reviews.forEach((r) => {
      const g = r.class_name || r.student?.grade;
      if (g) seen.add(g);
    });
    return ["الكل", ...Array.from(seen)];
  }, [reviews]);

  const filtered = useMemo(() => {
    if (selectedGrade === "الكل") return reviews;
    return reviews.filter(
      (r) =>
        r.class_name === selectedGrade || r.student?.grade === selectedGrade,
    );
  }, [reviews, selectedGrade]);

  const avg = useMemo(() => average(reviews), [reviews]);

  const handleSelectGrade = useCallback((grade: string) => {
    setSelectedGrade(grade);
    setDropdownOpen(false);
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      <NavHeader title="التقييمات" onBack={() => router.back()} />

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={fetchReviews}>
            <Text style={styles.retryText}>إعادة المحاولة</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <>
              {/* Summary card */}
              {/* {reviews.length > 0 && (
                <View style={styles.summaryCard}>
                  <View style={styles.summaryItem}>
                    <MessageSquare size={20} color={Colors.primary} />
                    <Text style={styles.summaryValue}>{reviews.length}</Text>
                    <Text style={styles.summaryLabel}>إجمالي التقييمات</Text>
                  </View>
                  <View style={styles.summaryDivider} />
                  <View style={styles.summaryItem}>
                    <Star size={20} color="#f59e0b" fill="#f59e0b" />
                    <Text style={styles.summaryValue}>{avg}</Text>
                    <Text style={styles.summaryLabel}>متوسط التقييم</Text>
                  </View>
                </View>
              )} */}

              {/* Filter toolbar */}
              <View style={styles.toolbar}>
                <GradeFilter
                  grades={grades}
                  selected={selectedGrade}
                  open={dropdownOpen}
                  onToggle={() => setDropdownOpen((v) => !v)}
                  onSelect={handleSelectGrade}
                />
                <Text style={styles.countText}>{filtered.length} تقييم</Text>
              </View>
            </>
          }
          renderItem={({ item }) => <ReviewCard item={item} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Star size={48} color={Colors.textTertiary} />
              <Text style={styles.emptyTitle}>لا توجد تقييمات</Text>
              <Text style={styles.emptySub}>
                {selectedGrade === "الكل"
                  ? "لم يُضف الطلاب أي تقييمات بعد"
                  : "لا توجد تقييمات لهذه المرحلة"}
              </Text>
            </View>
          }
          ListFooterComponent={<View style={{ height: 100 }} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  errorText: {
    fontSize: 14,
    fontFamily: "Alex_400",
    color: Colors.error,
    textAlign: "center",
    paddingHorizontal: 24,
  },
  retryBtn: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.primary,
  },
  retryText: { fontSize: 13, fontFamily: "Alex_600", color: "#fff" },
  list: { paddingHorizontal: 16, paddingTop: 16 },

  // Summary
  summaryCard: {
    flexDirection: "row",
    backgroundColor: Colors.primaryLight,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "space-around",
  },
  summaryItem: { alignItems: "center", gap: 4 },
  summaryValue: {
    fontFamily: "Alex_700",
    fontSize: 22,
    color: Colors.textPrimary,
  },
  summaryLabel: {
    fontFamily: "Alex_400",
    fontSize: 12,
    color: Colors.textSecondary,
  },
  summaryDivider: {
    width: 1,
    height: 48,
    backgroundColor: Colors.border,
  },

  // Toolbar
  toolbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 16,
    zIndex: 10,
  },
  countText: {
    fontFamily: "Alex_400",
    fontSize: 13,
    color: Colors.textTertiary,
  },

  // Empty
  empty: {
    alignItems: "center",
    paddingVertical: 60,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: "Alex_600",
    color: Colors.textSecondary,
  },
  emptySub: {
    fontSize: 13,
    fontFamily: "Alex_400",
    color: Colors.textTertiary,
    textAlign: "center",
  },
});
