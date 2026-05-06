import { NavHeader } from "@/components/Ui/NavHeader";
import { Colors } from "@/constants/colors";
import { API_ENDPOINTS } from "@/constants/endpoints";
import { api, normalizeError } from "@/services/api";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import {
  AlertTriangle,
  BookMarked,
  ExternalLink,
  PlayCircle,
  Search,
  X,
} from "lucide-react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Guide {
  id: number;
  title: string;
  video: string;
  type?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isValidUrl(url: string) {
  return (
    url &&
    (url.startsWith("http://") || url.startsWith("https://")) &&
    !url.includes("500b.jpg") &&
    !url.includes("bunnyinfra.net/500b.jpg") &&
    !url.includes("edgezone-ae.bunnyinfra.net")
  );
}

// ─── Selected guide card ──────────────────────────────────────────────────────

function GuideViewer({ guide }: { guide: Guide }) {
  const [opening, setOpening] = useState(false);
  const valid = isValidUrl(guide.video);

  async function handleWatch() {
    if (!valid) return;
    try {
      setOpening(true);
      await WebBrowser.openBrowserAsync(guide.video, {
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
      });
    } finally {
      setOpening(false);
    }
  }

  return (
    <View style={styles.viewer}>
      {/* Play area */}
      <TouchableOpacity
        style={styles.playArea}
        activeOpacity={0.85}
        onPress={handleWatch}
        disabled={!valid || opening}
      >
        <View style={styles.playCircle}>
          {opening ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <PlayCircle size={48} color="#fff" />
          )}
        </View>
        {!valid && (
          <View style={styles.invalidOverlay}>
            <AlertTriangle size={20} color="#fff" />
            <Text style={styles.invalidText}>رابط غير صالح</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Footer */}
      <View style={styles.viewerFooter}>
        <TouchableOpacity
          style={[styles.watchBtn, (!valid || opening) && styles.watchBtnDim]}
          activeOpacity={0.85}
          onPress={handleWatch}
          disabled={!valid || opening}
        >
          {opening ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <ExternalLink size={16} color="#fff" />
          )}
          <Text style={styles.watchBtnText}>مشاهدة الفيديو</Text>
        </TouchableOpacity>
        <Text style={styles.viewerTitle} numberOfLines={2}>
          {guide.title}
        </Text>
      </View>
    </View>
  );
}

// ─── Guide list item ──────────────────────────────────────────────────────────

function GuideItem({
  guide,
  selected,
  onPress,
}: {
  guide: Guide;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.guideItem, selected && styles.guideItemActive]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View
        style={[styles.guideIconWrap, selected && styles.guideIconWrapActive]}
      >
        <PlayCircle size={18} color={selected ? "#fff" : Colors.primary} />
      </View>
      <Text
        style={[styles.guideItemText, selected && styles.guideItemTextActive]}
        numberOfLines={2}
      >
        {guide.title}
      </Text>
    </TouchableOpacity>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function GuideScreen() {
  const router = useRouter();

  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Guide | null>(null);

  const fetchGuides = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get<{ data: any[] }>(
        API_ENDPOINTS.GUIDES.LIST,
      );
      const raw: any[] = data.data ?? (data as any);
      const list: Guide[] = (Array.isArray(raw) ? raw : [])
        .map((item) => ({
          id: item.id,
          title: item.title,
          video: item.link,
          type: item.type,
        }))
        .filter((g) => isValidUrl(g.video));
      setGuides(list);
      setSelected(list[0] ?? null);
    } catch (err) {
      setError(normalizeError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGuides();
  }, [fetchGuides]);

  const filtered = useMemo(() => {
    const q = search.trim();
    if (!q) return guides;
    return guides.filter((g) => g.title.includes(q));
  }, [guides, search]);

  const listRef = useRef<FlatList>(null);

  function handleSelect(guide: Guide) {
    setSelected(guide);
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  }

  // ── loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <SafeAreaView style={styles.screen}>
        <NavHeader title="دليل المعلم" onBack={() => router.back()} />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>جاري تحميل الأدلة...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ── error ─────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <SafeAreaView style={styles.screen}>
        <NavHeader title="دليل المعلم" onBack={() => router.back()} />
        <View style={styles.center}>
          <AlertTriangle size={40} color={Colors.error} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={fetchGuides}>
            <Text style={styles.retryText}>إعادة المحاولة</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <NavHeader title="دليل المعلم" onBack={() => router.back()} />

      <FlatList
        ref={listRef}
        data={filtered}
        keyExtractor={(g) => String(g.id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            {/* Hero */}
            <View style={styles.hero}>
              <View style={styles.heroIconWrap}>
                <BookMarked size={32} color={Colors.primary} />
              </View>
              <View style={styles.heroText}>
                <Text style={styles.heroTitle}>دليل المعلم</Text>
                <Text style={styles.heroSub}>
                  تعلم كيف تستخدم جميع مميزات المنصة بسهولة
                </Text>
              </View>
            </View>

            {/* Video viewer */}
            {selected ? (
              <GuideViewer guide={selected} />
            ) : guides.length > 0 ? null : (
              <View style={styles.emptyBox}>
                <BookMarked size={40} color={Colors.textTertiary} />
                <Text style={styles.emptyText}>لا توجد أدلة متاحة حالياً</Text>
              </View>
            )}

            {/* Search + count */}
            {guides.length > 0 && (
              <View style={styles.searchSection}>
                <View style={styles.searchRow}>
                  <View style={styles.searchBox}>
                    <Search size={15} color={Colors.textPlaceholder} />
                    <TextInput
                      style={styles.searchInput}
                      value={search}
                      onChangeText={setSearch}
                      placeholder="ابحث في الأدلة..."
                      placeholderTextColor={Colors.textPlaceholder}
                      textAlign="right"
                      returnKeyType="search"
                    />
                    {search.length > 0 && (
                      <TouchableOpacity onPress={() => setSearch("")}>
                        <X size={15} color={Colors.textTertiary} />
                      </TouchableOpacity>
                    )}
                  </View>
                  <Text style={styles.countText}>{filtered.length} دليل</Text>
                </View>
              </View>
            )}
          </>
        }
        renderItem={({ item }) => (
          <GuideItem
            guide={item}
            selected={selected?.id === item.id}
            onPress={() => handleSelect(item)}
          />
        )}
        ListEmptyComponent={
          search ? (
            <View style={styles.noResults}>
              <Text style={styles.noResultsText}>
                لا توجد نتائج لـ "{search}"
              </Text>
            </View>
          ) : null
        }
        ListFooterComponent={<View style={{ height: 40 }} />}
      />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },

  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  loadingText: {
    fontFamily: "Alex_400",
    fontSize: 14,
    color: Colors.textSecondary,
  },
  errorText: {
    fontFamily: "Alex_400",
    fontSize: 14,
    color: Colors.error,
    textAlign: "center",
    paddingHorizontal: 24,
  },
  retryBtn: {
    paddingHorizontal: 28,
    paddingVertical: 11,
    borderRadius: 50,
    backgroundColor: Colors.primary,
  },
  retryText: { fontFamily: "Alex_600", fontSize: 14, color: "#fff" },

  listContent: { paddingBottom: 20 },

  /* Hero */
  hero: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: Colors.primaryLight,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 16,
    borderRadius: 16,
  },
  heroIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  heroText: { flex: 1, alignItems: "flex-end" },
  heroTitle: {
    fontFamily: "Alex_700",
    fontSize: 17,
    color: Colors.textPrimary,
  },
  heroSub: {
    fontFamily: "Alex_400",
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: "right",
    marginTop: 3,
    lineHeight: 20,
  },

  /* Viewer */
  viewer: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  playArea: {
    height: 180,
    backgroundColor: "#1B3A4B",
    alignItems: "center",
    justifyContent: "center",
  },
  playCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(232,155,50,0.9)",
    alignItems: "center",
    justifyContent: "center",
  },
  invalidOverlay: {
    position: "absolute",
    bottom: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  invalidText: {
    fontFamily: "Alex_600",
    fontSize: 13,
    color: "#fff",
  },
  viewerFooter: {
    padding: 14,
    gap: 10,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  viewerTitle: {
    fontFamily: "Alex_700",
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  watchBtn: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: 50,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  watchBtnDim: { backgroundColor: Colors.textTertiary },
  watchBtnText: { fontFamily: "Alex_700", fontSize: 13, color: "#fff" },

  /* Search */
  searchSection: { paddingHorizontal: 16, marginBottom: 12 },
  searchRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 10,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: Colors.surfaceAlt,
  },
  searchInput: {
    flex: 1,
    fontFamily: "Alex_400",
    fontSize: 13,
    color: Colors.textPrimary,
    padding: 0,
  },
  countText: {
    fontFamily: "Alex_400",
    fontSize: 12,
    color: Colors.textTertiary,
    minWidth: 48,
    textAlign: "center",
  },

  /* Guide item */
  guideItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: "#fff",
  },
  guideItemActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  guideIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  guideIconWrapActive: {
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  guideItemText: {
    flex: 1,
    fontFamily: "Alex_500",
    fontSize: 13,
    color: Colors.textPrimary,
    textAlign: "right",
  },
  guideItemTextActive: {
    fontFamily: "Alex_700",
    color: "#fff",
  },

  /* Empty / no results */
  emptyBox: {
    alignItems: "center",
    paddingVertical: 48,
    gap: 12,
  },
  emptyText: {
    fontFamily: "Alex_400",
    fontSize: 14,
    color: Colors.textTertiary,
  },
  noResults: {
    alignItems: "center",
    paddingVertical: 32,
  },
  noResultsText: {
    fontFamily: "Alex_400",
    fontSize: 14,
    color: Colors.textTertiary,
  },
});
