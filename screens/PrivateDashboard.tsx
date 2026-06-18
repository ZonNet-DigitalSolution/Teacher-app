import { RejectReasonSheet } from "@/components/PrivateDashboard/RejectReasonSheet";
import { RequestCard } from "@/components/PrivateDashboard/RequestCard";
import { SectionHeader } from "@/components/PrivateDashboard/SectionHeader";
import { UpcomingCard } from "@/components/PrivateDashboard/UpcomingCard";
import { Colors } from "@/constants/colors";
import { useAppDispatch, useAppSelector } from "@/hooks/store-hooks";
import {
  acceptSessionRequest,
  fetchSessionRequests,
  fetchUpcomingSessions,
  rejectSessionRequest,
} from "@/store/private";
import { useRouter } from "expo-router";
import { BookOpen } from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

// ─── Main Component ───────────────────────────────────────────────────────────

export function PrivateDashboard() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const requests = useAppSelector((s) => s.private.requests);
  const requestsLoading = useAppSelector((s) => s.private.requestsLoading);
  const upcoming = useAppSelector((s) => s.private.upcoming);
  const upcomingLoading = useAppSelector((s) => s.private.upcomingLoading);
  const [rejectTargetId, setRejectTargetId] = useState<number | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchSessionRequests());
    dispatch(fetchUpcomingSessions());
  }, [dispatch]);

  const handleAccept = useCallback(
    async (id: string) => {
      const sessionId = Number(id);
      setActionLoading(sessionId);
      try {
        await dispatch(acceptSessionRequest({ sessionId })).unwrap();
      } finally {
        setActionLoading(null);
      }
    },
    [dispatch],
  );

  const handleRejectConfirm = useCallback(
    async (reason: string) => {
      if (rejectTargetId === null) return;
      const sessionId = rejectTargetId;
      setRejectTargetId(null);
      setActionLoading(sessionId);
      try {
        await dispatch(rejectSessionRequest({ sessionId, reason })).unwrap();
      } finally {
        setActionLoading(null);
      }
    },
    [dispatch, rejectTargetId],
  );

  const isRefreshing = requestsLoading || upcomingLoading;

  const onRefresh = useCallback(() => {
    dispatch(fetchSessionRequests());
    dispatch(fetchUpcomingSessions());
  }, [dispatch]);

  return (
    <>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
      >
        {/* Pending Requests */}
        {requests.length > 0 && (
          <View style={styles.section}>
            <SectionHeader title="طلبات معلقة" badge={requests.length} />
            {requests.map((r) => (
              <RequestCard
                key={r.id}
                item={r}
                onAccept={handleAccept}
                onReject={(id) => setRejectTargetId(Number(id))}
                loading={actionLoading === r.id}
              />
            ))}
          </View>
        )}

        {/* Upcoming Sessions */}
        <View style={styles.section}>
          <SectionHeader title="الجلسات القادمة" />
          {upcoming.length > 0 ? (
            upcoming.map((s) => (
              <UpcomingCard
                key={s.id}
                item={{
                  id: String(s.id),
                  student: s.student.name,
                  subject: s.subject,
                  date: s.date,
                  time: s.time,
                  isToday: s.date === new Date().toISOString().split("T")[0],
                }}
              />
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

      {rejectTargetId !== null && (
        <RejectReasonSheet
          onConfirm={handleRejectConfirm}
          onClose={() => setRejectTargetId(null)}
        />
      )}
    </>
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
