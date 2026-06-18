import { RejectReasonSheet } from "@/components/PrivateDashboard/RejectReasonSheet";
import { RequestCard } from "@/components/PrivateDashboard/RequestCard";
import { NavHeader } from "@/components/Ui/NavHeader";
import { Colors } from "@/constants/colors";
import { useAppDispatch, useAppSelector } from "@/hooks/store-hooks";
import { clearPrivateBadge } from "@/store/navigation/navigationSlice";
import {
  acceptSessionRequest,
  fetchSessionRequests,
  rejectSessionRequest,
  type SessionRequest,
} from "@/store/private";
import { useRouter } from "expo-router";
import { BookOpen } from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function SessionRequestsScreen() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const requests = useAppSelector((s) => s.private.requests);
  const requestsLoading = useAppSelector((s) => s.private.requestsLoading);
  const [rejectTargetId, setRejectTargetId] = useState<number | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchSessionRequests());
    dispatch(clearPrivateBadge());
  }, [dispatch]);

  const handleAccept = useCallback(
    async (sessionId: number) => {
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
      const id = rejectTargetId;
      setRejectTargetId(null);
      setActionLoading(id);
      try {
        await dispatch(rejectSessionRequest({ sessionId: id, reason })).unwrap();
      } finally {
        setActionLoading(null);
      }
    },
    [dispatch, rejectTargetId],
  );

  const renderItem = useCallback(
    ({ item }: { item: SessionRequest }) => (
      <RequestCard
        item={item}
        onAccept={(id) => handleAccept(Number(id))}
        onReject={(id) => setRejectTargetId(Number(id))}
        loading={actionLoading === item.id}
      />
    ),
    [handleAccept, actionLoading],
  );

  if (requestsLoading && requests.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <NavHeader
        title="طلبات الحصص الفردية"
        onBack={() => router.back()}
      />

      <FlatList
        data={requests}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={requestsLoading}
            onRefresh={() => dispatch(fetchSessionRequests())}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <BookOpen size={48} color={Colors.textTertiary} />
            <Text style={styles.emptyText}>لا توجد طلبات معلقة</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {rejectTargetId !== null && (
        <RejectReasonSheet
          onConfirm={handleRejectConfirm}
          onClose={() => setRejectTargetId(null)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFCF0",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFCF0",
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
    gap: 14,
  },
  emptyText: {
    fontSize: 15,
    fontFamily: "Alex_400",
    color: Colors.textTertiary,
  },
});
