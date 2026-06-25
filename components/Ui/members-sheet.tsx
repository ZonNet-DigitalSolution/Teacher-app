import { Colors } from "@/constants/colors";
import type { ChatMember } from "@/store/community/communityService";
import { X } from "lucide-react-native";
import { useEffect, useMemo } from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ROLE_COLORS: Record<string, string> = { teacher: Colors.primary };

type Props = {
  visible: boolean;
  members: ChatMember[];
  loading: boolean;
  onClose: () => void;
};

export function MembersSheet({ visible, members, loading, onClose }: Props) {
  "use no memo";

  const { bottom } = useSafeAreaInsets();
  const translateY = useMemo(() => new Animated.Value(500), []);

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible ? 0 : 500,
      duration: visible ? 300 : 240,
      useNativeDriver: true,
    }).start();
  }, [visible, translateY]);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose} />
      <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
        <View style={styles.handle} />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <X size={18} color={Colors.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>أعضاء المجموعة</Text>
          <View style={{ width: 36 }} />
        </View>

        <View style={styles.dashedDivider} />

        {loading ? (
          <ActivityIndicator style={{ marginTop: 40 }} color={Colors.primary} />
        ) : (
          <FlatList
            data={members}
            keyExtractor={(m) => String(m.id)}
            contentContainerStyle={{ paddingBottom: 32 + bottom, paddingHorizontal: 16 }}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={styles.memberSep} />}
            ListEmptyComponent={
              <Text style={styles.membersEmpty}>لا يوجد أعضاء</Text>
            }
            renderItem={({ item }) => {
              const avatarBg = ROLE_COLORS[item.type ?? ""] ?? Colors.primaryLight;
              return (
                <View style={styles.memberRow}>
                  <View style={styles.memberInfo}>
                    {item.role ? (
                      <View style={styles.memberRoleBadge}>
                        <Text style={styles.memberRoleText}>{item.role}</Text>
                      </View>
                    ) : null}
                    <Text style={styles.memberName}>{item.name}</Text>
                  </View>
                  <View style={[styles.memberAvatar, { backgroundColor: avatarBg }]}>
                    <Text style={styles.memberAvatarText}>
                      {item.name?.[0] ?? "؟"}
                    </Text>
                  </View>
                </View>
              );
            }}
          />
        )}
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  sheet: {
    position: "absolute",
    bottom: 0, left: 0, right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 16,
    maxHeight: "70%",
    paddingTop: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E0E0E0",
    alignSelf: "center",
    marginBottom: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  headerTitle: { fontSize: 16, fontFamily: "Alex_700", color: "#165072" },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    alignItems: "center",
    justifyContent: "center",
  },
  dashedDivider: {
    borderBottomWidth: 1.5,
    borderColor: "#165072",
    borderStyle: "dashed",
    marginHorizontal: 16,
    marginBottom: 8,
  },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingVertical: 12,
    gap: 12,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  memberAvatarText: { fontFamily: "Alex_700", fontSize: 15, color: "#fff" },
  memberInfo: { flex: 1, alignItems: "flex-end", gap: 3 },
  memberName: {
    fontFamily: "Alex_600",
    fontSize: 14,
    color: Colors.textPrimary,
    textAlign: "right",
  },
  memberRoleBadge: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  memberRoleText: { fontFamily: "Alex_500", fontSize: 11, color: Colors.primary },
  memberSep: { height: 1, backgroundColor: Colors.borderLight },
  membersEmpty: {
    fontFamily: "Alex_400",
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: 40,
  },
});
