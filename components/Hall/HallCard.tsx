import { Colors } from "@/constants/colors";
import { Hall, ROOM_LABELS } from "@/types/hall.types";
import {
  Check,
  Copy,
  LogIn,
  Pencil,
  Trash2,
  Video,
} from "lucide-react-native";
import React, { memo, useCallback } from "react";
import {
  Alert,
  Clipboard,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export type { Hall };

interface HallCardProps {
  item: Hall;
  onActivate: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (item: Hall) => void;
  onConnectLogin?: () => void;
  connectLoading?: boolean;
}

export const HallCard = memo(function HallCard({
  item,
  onActivate,
  onDelete,
  onEdit,
  onConnectLogin,
  connectLoading,
}: HallCardProps) {
  const isActive = item.status === "active";

  const copyUrl = useCallback(() => {
    Clipboard.setString(item.link);
    Alert.alert("تم النسخ", "تم نسخ رابط القاعة بنجاح");
  }, [item.link]);

  const handleJoin = useCallback(() => {
    if (!isActive) return;
    Linking.openURL(item.link).catch(() =>
      Alert.alert("خطأ", "تعذر فتح الرابط"),
    );
  }, [item.link, isActive]);

  const confirmDelete = useCallback(() => {
    Alert.alert("حذف القاعة", "هل أنت متأكد من حذف هذه القاعة؟", [
      { text: "إلغاء", style: "cancel" },
      { text: "حذف", style: "destructive", onPress: () => onDelete(item.id) },
    ]);
  }, [item.id, onDelete]);

  return (
    <View style={[styles.card, isActive && styles.cardActive]}>
      {/* Header */}
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>
          {ROOM_LABELS[item.type] ?? item.type}
        </Text>
        <Video size={18} color={isActive ? Colors.success : Colors.textSecondary} />
      </View>

      {/* Actions row */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={confirmDelete}
          activeOpacity={0.8}
        >
          <Text style={styles.deleteBtnText}>حذف</Text>
          <Trash2 size={15} color="#fff" />
        </TouchableOpacity>

        {isActive ? (
          <View style={styles.activeBtn}>
            <Text style={styles.activeBtnText}>الحالية</Text>
            <Check size={15} color="#fff" />
          </View>
        ) : (
          <TouchableOpacity
            style={styles.activateBtn}
            onPress={() => onActivate(item.id)}
            activeOpacity={0.8}
          >
            <Text style={styles.activateBtnText}>تفعيل</Text>
            <LogIn size={15} color={Colors.primary} />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.editBtn}
          activeOpacity={0.8}
          onPress={() => onEdit(item)}
        >
          <Text style={styles.editBtnText}>تعديل</Text>
          <Pencil size={15} color={Colors.primary} />
        </TouchableOpacity>

        {item.type === "connect" && onConnectLogin && (
          <TouchableOpacity
            style={styles.connectBtn}
            activeOpacity={0.8}
            onPress={onConnectLogin}
            disabled={connectLoading}
          >
            <Text style={styles.connectBtnText}>
              {connectLoading ? "جاري..." : "تسجيل دخول"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.divider} />

      {/* URL */}
      <View style={styles.urlSection}>
        <Text style={styles.urlLabel}>رابط القاعة:</Text>
        <View style={styles.urlRow}>
          <TouchableOpacity
            style={styles.copyBtn}
            onPress={copyUrl}
            activeOpacity={0.8}
          >
            <Copy size={16} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={styles.urlText} numberOfLines={1}>
            {item.link}
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.joinBtn, !isActive && styles.joinBtnDisabled]}
          activeOpacity={0.8}
          onPress={handleJoin}
          disabled={!isActive}
        >
          <Text style={[styles.joinBtnText, !isActive && styles.joinBtnTextDisabled]}>
            انضمام
          </Text>
        </TouchableOpacity>
        <View style={[styles.statusBadge, isActive ? styles.statusActive : styles.statusInactive]}>
          <Text style={[styles.statusText, isActive ? styles.statusActiveText : styles.statusInactiveText]}>
            {isActive ? "نشط" : "غير نشط"}
          </Text>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 14,
    overflow: "hidden",
  },
  cardActive: {
    borderColor: Colors.success,
    borderWidth: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  cardTitle: {
    fontFamily: "Alex_700",
    fontSize: 15,
    color: Colors.textPrimary,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    paddingBottom: 14,
    gap: 8,
    flexWrap: "wrap",
  },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  editBtnText: { fontFamily: "Alex_700", fontSize: 13, color: Colors.primary },
  activateBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  activateBtnText: { fontFamily: "Alex_700", fontSize: 13, color: Colors.primary },
  activeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: Colors.success,
  },
  activeBtnText: { fontFamily: "Alex_700", fontSize: 13, color: "#fff" },
  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: Colors.error,
  },
  deleteBtnText: { fontFamily: "Alex_700", fontSize: 13, color: "#fff" },
  connectBtn: {
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "#7c3aed",
  },
  connectBtnText: { fontFamily: "Alex_700", fontSize: 13, color: "#fff" },
  divider: { height: 1, backgroundColor: Colors.borderLight, marginHorizontal: 16 },
  urlSection: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
    alignItems: "flex-end",
    gap: 8,
  },
  urlLabel: { fontFamily: "Alex_700", fontSize: 13, color: Colors.textPrimary },
  urlRow: { flexDirection: "row", alignItems: "center", width: "100%", gap: 8 },
  copyBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  urlText: {
    flex: 1,
    fontFamily: "Alex_400",
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: "right",
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    backgroundColor: Colors.surfaceAlt,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  joinBtn: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: Colors.primaryLight,
  },
  joinBtnDisabled: {
    borderColor: Colors.borderLight,
    backgroundColor: Colors.surfaceAlt,
  },
  joinBtnText: { fontFamily: "Alex_700", fontSize: 13, color: Colors.primary },
  joinBtnTextDisabled: { color: Colors.textTertiary },
  statusBadge: { borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6 },
  statusInactive: { backgroundColor: Colors.surfaceAlt },
  statusActive: { backgroundColor: Colors.successBg },
  statusText: { fontFamily: "Alex_700", fontSize: 12 },
  statusInactiveText: { color: Colors.textSecondary },
  statusActiveText: { color: Colors.success },
});
