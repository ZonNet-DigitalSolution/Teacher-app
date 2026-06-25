import { AddHallSheet } from "@/components/Ui/add-hall-sheet";
import { Hall } from "@/types/hall.types";
import { HallCard } from "@/components/Hall/HallCard";
import { NavHeader } from "@/components/Ui/NavHeader";
import { API_ENDPOINTS } from "@/constants/endpoints";
import { Colors } from "@/constants/colors";
import { api, normalizeError } from "@/services/api";
import { useRouter } from "expo-router";
import { Plus, Video } from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function HallScreen() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Hall[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Hall | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [connectLoading, setConnectLoading] = useState(false);

  // ─── API calls ─────────────────────────────────────────────────────────────

  const fetchRooms = useCallback(async () => {
    try {
      setError(null);
      const { data } = await api.get<{ data: any[] }>(API_ENDPOINTS.HALL.LIST);
      const list = data.data ?? (data as any);
      setRooms(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(normalizeError(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const handleAdd = useCallback(
    async (type: string, link: string) => {
      try {
        await api.post(API_ENDPOINTS.HALL.CREATE, { type, link });
        fetchRooms();
      } catch (err) {
        Alert.alert("خطأ", normalizeError(err));
      }
    },
    [fetchRooms],
  );

  const handleUpdate = useCallback(
    async (id: number, type: string, link: string) => {
      try {
        await api.post(API_ENDPOINTS.HALL.UPDATE + id, {
          type,
          link,
          _method: "PUT",
        });
        fetchRooms();
      } catch (err) {
        Alert.alert("خطأ", normalizeError(err));
      }
    },
    [fetchRooms],
  );

  const handleDelete = useCallback(
    async (id: number) => {
      try {
        await api.delete(API_ENDPOINTS.HALL.DELETE + id);
        setRooms((prev) => prev.filter((r) => r.id !== id));
      } catch (err) {
        Alert.alert("خطأ", normalizeError(err));
      }
    },
    [],
  );

  const handleToggle = useCallback(
    async (id: number) => {
      try {
        setTogglingId(id);
        const target = rooms.find((r) => r.id === id);

        if (target?.status === "inactive") {
          // Deactivate all active rooms first, then activate target
          const activeRooms = rooms.filter((r) => r.status === "active");
          for (const active of activeRooms) {
            await api.get(API_ENDPOINTS.HALL.TOGGLE + active.id + "/toggle");
          }
        }

        await api.get(API_ENDPOINTS.HALL.TOGGLE + id + "/toggle");
        fetchRooms();
      } catch (err) {
        Alert.alert("خطأ", normalizeError(err));
      } finally {
        setTogglingId(null);
      }
    },
    [rooms, fetchRooms],
  );

  const handleConnectLogin = useCallback(async () => {
    try {
      setConnectLoading(true);
      const { data } = await api.get<{ success: boolean; data?: { url: string }; message?: string }>(
        API_ENDPOINTS.HALL.CONNECT_LOGIN,
      );
      if (data.success && data.data?.url) {
        Linking.openURL(data.data.url).catch(() =>
          Alert.alert("خطأ", "تعذر فتح الرابط"),
        );
        fetchRooms();
      } else {
        Alert.alert("خطأ", data.message ?? "حدث خطأ في تسجيل الدخول");
      }
    } catch (err) {
      Alert.alert("خطأ", normalizeError(err));
    } finally {
      setConnectLoading(false);
    }
  }, [fetchRooms]);

  const openAdd = useCallback(() => {
    setEditingRoom(null);
    setSheetVisible(true);
  }, []);

  const openEdit = useCallback((item: Hall) => {
    setEditingRoom(item);
    setSheetVisible(true);
  }, []);

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.screen}>
      <NavHeader title="قاعة الجلسات" onBack={() => router.back()} />

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={fetchRooms}>
            <Text style={styles.retryText}>إعادة المحاولة</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={rooms}
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.listHeader}>
              <View style={styles.sectionTitleRow}>
                <Text style={styles.sectionTitle}>قاعة الجلسات</Text>
                <Text style={styles.sectionSub}>
                  يمكن تفعيل قاعة واحدة فقط في كل مرة
                </Text>
              </View>
              <TouchableOpacity
                style={styles.addBtn}
                activeOpacity={0.8}
                onPress={openAdd}
              >
                <Plus size={18} color={Colors.primary} />
                <Text style={styles.addBtnText}>إضافة قاعة</Text>
              </TouchableOpacity>
            </View>
          }
          renderItem={({ item }) => (
            <HallCard
              item={item}
              onActivate={handleToggle}
              onDelete={handleDelete}
              onEdit={openEdit}
              onConnectLogin={item.type === "connect" ? handleConnectLogin : undefined}
              connectLoading={connectLoading}
            />
          )}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Video size={48} color={Colors.textTertiary} />
              <Text style={styles.emptyTitle}>لا توجد قاعات متاحة</Text>
              <Text style={styles.emptySub}>
                اضغط على "إضافة قاعة" لبدء إضافة قاعات الجلسات
              </Text>
              <TouchableOpacity style={styles.emptyAddBtn} onPress={openAdd} activeOpacity={0.8}>
                <Plus size={16} color="#fff" />
                <Text style={styles.emptyAddBtnText}>إضافة قاعة جديدة</Text>
              </TouchableOpacity>
            </View>
          }
          ListFooterComponent={<View style={{ height: 40 }} />}
        />
      )}

      <AddHallSheet
        visible={sheetVisible}
        editItem={editingRoom}
        onClose={() => setSheetVisible(false)}
        onAdd={handleAdd}
        onUpdate={handleUpdate}
      />
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
  list: { paddingHorizontal: 16, paddingTop: 8 },
  listHeader: {
    flexDirection: "row-reverse",
    marginBottom: 16,
    gap: 12,
    alignItems: "flex-start",
  },
  sectionTitleRow: { flex: 1, alignItems: "flex-end", paddingVertical: 8 },
  sectionTitle: {
    fontFamily: "Alex_700",
    fontSize: 20,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  sectionSub: {
    fontFamily: "Alex_400",
    fontSize: 13,
    color: Colors.textSecondary,
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: Colors.primaryLight,
    marginTop: 8,
  },
  addBtnText: { fontFamily: "Alex_700", fontSize: 13, color: Colors.primary },
  empty: {
    alignItems: "center",
    paddingVertical: 60,
    gap: 10,
    paddingHorizontal: 32,
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
  emptyAddBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
    backgroundColor: Colors.primary,
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  emptyAddBtnText: { fontFamily: "Alex_700", fontSize: 14, color: "#fff" },
});
