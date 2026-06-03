import { Colors } from "@/constants/colors";
import {
  notificationsService,
  type InboxNotification,
} from "@/services/notificationsService";
import { useRouter } from "expo-router";
import { ArrowLeft, BellRing, CheckCheck, Inbox } from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ── Helpers ───────────────────────────────────────────────────────────────────

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return "الآن";
  if (diff < 3600) return `منذ ${Math.floor(diff / 60)} دقيقة`;
  if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} ساعة`;
  if (diff < 604800) return `منذ ${Math.floor(diff / 86400)} يوم`;
  return new Date(iso).toLocaleDateString("ar-EG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ── Notification item ─────────────────────────────────────────────────────────

function NotificationItem({
  item,
  onRead,
}: {
  item: InboxNotification;
  onRead: (id: string) => void;
}) {
  const isUnread = !item.read_at;

  return (
    <TouchableOpacity
      style={[styles.item, isUnread && styles.itemUnread]}
      onPress={() => isUnread && onRead(item.id)}
      activeOpacity={0.75}
    >
      {/* Unread dot */}
      <View style={styles.dotCol}>
        {isUnread && <View style={styles.dot} />}
      </View>

      {/* Icon */}
      <View style={[styles.iconWrap, isUnread ? styles.iconWrapUnread : styles.iconWrapRead]}>
        <BellRing size={18} color={isUnread ? Colors.primary : Colors.textSecondary} />
      </View>

      {/* Content */}
      <View style={styles.itemContent}>
        <View style={styles.itemTop}>
          <Text style={styles.itemTime}>{timeAgo(item.created_at)}</Text>
          {isUnread && <View style={styles.unreadBadge}><Text style={styles.unreadBadgeText}>جديد</Text></View>}
        </View>
        <Text style={[styles.itemTitle, isUnread && styles.itemTitleUnread]} numberOfLines={1}>
          {item.data?.title ?? "إشعار"}
        </Text>
        <Text style={styles.itemBody} numberOfLines={2}>
          {item.data?.body ?? ""}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────

export default function NotificationsScreen() {
  const router = useRouter();

  const [notifications, setNotifications] = useState<InboxNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const hasUnread = notifications.some((n) => !n.read_at);

  const fetchPage = useCallback(async (p: number, replace: boolean) => {
    try {
      if (p === 1) setLoading(true);
      else setLoadingMore(true);

      const { notifications: items, lastPage: lp } =
        await notificationsService.getInbox(p);

      setNotifications((prev) => (replace ? items : [...prev, ...items]));
      setLastPage(lp);
      setPage(p);
    } catch {
      // alertGateway handles errors
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchPage(1, true);
  }, [fetchPage]);

  const handleMarkRead = useCallback(async (id: string) => {
    try {
      await notificationsService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, read_at: new Date().toISOString() } : n,
        ),
      );
    } catch {
      // handled by alertGateway
    }
  }, []);

  const handleMarkAllRead = useCallback(async () => {
    setMarkingAll(true);
    try {
      await notificationsService.markAllAsRead();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read_at: n.read_at ?? new Date().toISOString() })),
      );
    } catch {
      // handled by alertGateway
    } finally {
      setMarkingAll(false);
    }
  }, []);

  const handleLoadMore = useCallback(() => {
    if (!loadingMore && page < lastPage) {
      fetchPage(page + 1, false);
    }
  }, [loadingMore, page, lastPage, fetchPage]);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* ── Header ── */}
      <View style={styles.header}>
        {/* Mark all read */}
        {hasUnread ? (
          <TouchableOpacity
            style={styles.markAllBtn}
            onPress={handleMarkAllRead}
            disabled={markingAll}
          >
            {markingAll ? (
              <ActivityIndicator size="small" color={Colors.primary} />
            ) : (
              <CheckCheck size={18} color={Colors.primary} />
            )}
          </TouchableOpacity>
        ) : (
          <View style={{ width: 36 }} />
        )}

        <Text style={styles.headerTitle}>الإشعارات</Text>

        {/* Back */}
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* ── List ── */}
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(n) => n.id}
          renderItem={({ item }) => (
            <NotificationItem item={item} onRead={handleMarkRead} />
          )}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Inbox size={52} color={Colors.borderLight} />
              <Text style={styles.emptyTitle}>لا توجد إشعارات</Text>
              <Text style={styles.emptySubtitle}>ستظهر إشعاراتك الجديدة هنا</Text>
            </View>
          }
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator
                style={{ marginVertical: 16 }}
                color={Colors.primary}
              />
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  // ── Header ────────────────────────────────────────────
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  headerTitle: {
    fontFamily: "Alex_700",
    fontSize: 18,
    color: Colors.textPrimary,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  markAllBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },

  // ── List ──────────────────────────────────────────────
  listContent: { paddingVertical: 8 },
  sep: { height: 1, backgroundColor: Colors.borderLight, marginHorizontal: 16 },

  // ── Item ──────────────────────────────────────────────
  item: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: Colors.surface,
    gap: 10,
  },
  itemUnread: { backgroundColor: "#EFF6FF" },
  dotCol: { width: 8, alignItems: "center", paddingTop: 6 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  iconWrapUnread: { backgroundColor: Colors.primaryLight },
  iconWrapRead: { backgroundColor: Colors.surfaceAlt },
  itemContent: { flex: 1, gap: 3 },
  itemTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemTime: {
    fontFamily: "Alex_400",
    fontSize: 11,
    color: Colors.textSecondary,
  },
  unreadBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  unreadBadgeText: {
    fontFamily: "Alex_600",
    fontSize: 10,
    color: "#fff",
  },
  itemTitle: {
    fontFamily: "Alex_600",
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "right",
  },
  itemTitleUnread: { color: Colors.textPrimary, fontFamily: "Alex_700" },
  itemBody: {
    fontFamily: "Alex_400",
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: "right",
    lineHeight: 20,
  },

  // ── Empty ─────────────────────────────────────────────
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    gap: 12,
  },
  emptyTitle: {
    fontFamily: "Alex_600",
    fontSize: 16,
    color: Colors.textSecondary,
  },
  emptySubtitle: {
    fontFamily: "Alex_400",
    fontSize: 13,
    color: Colors.textSecondary,
  },
});
