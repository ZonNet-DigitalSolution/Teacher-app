import { RequestCard } from "@/components/PrivateDashboard/RequestCard";
import type { PrivateSessionBooking } from "@/components/PrivateDashboard/Types";
import { Colors } from "@/constants/colors";
import { Inbox } from "lucide-react-native";
import React from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type PrivateDashboardProps = {
  requests: PrivateSessionBooking[];
  isLoading: boolean;
  isRefreshing: boolean;
  actionLoadingId: string | null;
  onAccept: (booking: PrivateSessionBooking) => void | Promise<void>;
  onReject: (booking: PrivateSessionBooking) => void | Promise<void>;
  onRefresh: () => void;
};

export function PrivateDashboard({
  requests,
  isLoading,
  isRefreshing,
  actionLoadingId,
  onAccept,
  onReject,
  onRefresh,
}: PrivateDashboardProps) {
  if (isLoading && requests.length === 0) {
    return (
      <View style={styles.loadingState}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
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
      <View style={styles.section}>
        {requests.length > 0 ? (
          requests.map((request) => (
            <RequestCard
              key={request.id}
              item={request}
              isBusy={actionLoadingId === request.id}
              onAccept={onAccept}
              onReject={onReject}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Inbox size={44} color={Colors.borderLight} strokeWidth={1.8} />
            <Text style={styles.emptyText}>لا توجد طلبات حصص فردية حالياً</Text>
            <Text style={styles.emptyHint}>
              ستظهر هنا طلبات الحصص الفردية الجديدة عند وصولها
            </Text>
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
  section: { paddingHorizontal: 16, marginTop: 20 },
  loadingState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 52,
    paddingBottom: 40,
    gap: 10,
  },
  emptyText: {
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
  footer: { height: 100 },
});
