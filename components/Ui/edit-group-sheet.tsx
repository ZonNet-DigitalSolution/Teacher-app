import { Colors } from "@/constants/colors";
import { communityService } from "@/store/community/communityService";
import * as DocumentPicker from "expo-document-picker";
import { Camera, Save, Users } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { height: SCREEN_H } = Dimensions.get("window");
const SHEET_H = SCREEN_H * 0.88;

type Props = {
  visible: boolean;
  groupId: number;
  groupName: string;
  onClose: () => void;
  onSuccess?: () => void;
};

export function EditGroupSheet({
  visible,
  groupId,
  groupName,
  onClose,
  onSuccess,
}: Props) {
  const translateY = useRef(new Animated.Value(SHEET_H)).current;

  const [name, setName] = useState(groupName);
  const [details, setDetails] = useState("");
  const [isReview, setIsReview] = useState(false);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [avatarName, setAvatarName] = useState("avatar.jpg");
  const [saving, setSaving] = useState(false);

  // Reset form when sheet opens
  useEffect(() => {
    if (visible) {
      setName(groupName);
      setDetails("");
      setIsReview(false);
      setAvatarUri(null);
    }
  }, [visible, groupName]);

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible ? 0 : SHEET_H,
      duration: visible ? 300 : 240,
      useNativeDriver: true,
    }).start();
  }, [visible, translateY]);

  const pickAvatar = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "image/*",
      copyToCacheDirectory: true,
    });
    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];
      setAvatarUri(asset.uri);
      setAvatarName(asset.name ?? "avatar.jpg");
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("تنبيه", "اسم المجموعة مطلوب");
      return;
    }

    setSaving(true);
    try {
      const res = await communityService.updateGroup(groupId, {
        name: name.trim(),
        details,
        is_review: isReview,
        ...(avatarUri ? { avatarUri, avatarName } : {}),
      });
      onSuccess?.();
      onClose();
    } catch {
      // errors surfaced via alertGateway
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Pressable style={styles.backdrop} onPress={onClose} />

        <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
          <View style={styles.handle} />

          {/* ── Header ── */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.cancelText}>إلغاء</Text>
            </TouchableOpacity>
            <Text style={styles.title}>تعديل المجموعة</Text>
            <View style={{ width: 44 }} />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
          >
            {/* ── Avatar ── */}
            <TouchableOpacity
              style={styles.avatarWrap}
              onPress={pickAvatar}
              activeOpacity={0.8}
            >
              {avatarUri ? (
                <Image source={{ uri: avatarUri }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Users size={32} color={Colors.primary} />
                </View>
              )}
              <View style={styles.cameraBtn}>
                <Camera size={15} color="#fff" />
              </View>
            </TouchableOpacity>
            <Text style={styles.avatarHint}>صورة المجموعة (اختياري)</Text>

            {/* ── Name ── */}
            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>
                اسم المجموعة <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="أدخل اسم المجموعة"
                placeholderTextColor={Colors.textPlaceholder}
                textAlign="right"
                autoCapitalize="none"
              />
            </View>

            {/* ── Details ── */}
            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>التفاصيل</Text>
              <TextInput
                style={[styles.input, styles.inputMultiline]}
                value={details}
                onChangeText={setDetails}
                placeholder="أدخل تفاصيل المجموعة"
                placeholderTextColor={Colors.textPlaceholder}
                textAlign="right"
                textAlignVertical="top"
                multiline
                numberOfLines={4}
                autoCapitalize="none"
              />
            </View>

            {/* ── Is Review toggle ── */}
            <View style={styles.toggleRow}>
              <Switch
                value={isReview}
                onValueChange={setIsReview}
                trackColor={{ false: Colors.borderLight, true: Colors.primary }}
                thumbColor="#fff"
              />
              <View style={styles.toggleInfo}>
                <Text style={styles.toggleLabel}>مجموعة مراجعة</Text>
                <Text style={styles.toggleHint}>
                  تفعيل هذا الخيار يجعل المجموعة مخصصة للمراجعة
                </Text>
              </View>
            </View>

            {/* ── Save button ── */}
            <TouchableOpacity
              style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
              onPress={handleSave}
              disabled={saving}
              activeOpacity={0.85}
            >
              {saving ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Text style={styles.saveBtnText}>حفظ التغييرات</Text>
                  <Save size={18} color="#fff" />
                </>
              )}
            </TouchableOpacity>

            <View style={{ height: 24 }} />
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "flex-end" },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: SHEET_H,
    paddingTop: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E0E0E0",
    alignSelf: "center",
    marginBottom: 4,
  },

  // ── Header ────────────────────────────────────────────
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  title: {
    fontFamily: "Alex_700",
    fontSize: 16,
    color: Colors.textPrimary,
  },
  cancelText: {
    fontFamily: "Alex_500",
    fontSize: 14,
    color: Colors.textSecondary,
  },

  // ── Content ───────────────────────────────────────────
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: "stretch",
  },

  // ── Avatar ────────────────────────────────────────────
  avatarWrap: {
    alignSelf: "center",
    position: "relative",
    marginBottom: 6,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  avatarPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  cameraBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  avatarHint: {
    fontFamily: "Alex_400",
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 20,
  },

  // ── Fields ────────────────────────────────────────────
  fieldBlock: { marginBottom: 16 },
  fieldLabel: {
    fontFamily: "Alex_600",
    fontSize: 13,
    color: Colors.textPrimary,
    textAlign: "right",
    marginBottom: 6,
  },
  required: { color: Colors.error },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontFamily: "Alex_400",
    fontSize: 14,
    color: Colors.textPrimary,
    backgroundColor: Colors.background,
  },
  inputMultiline: {
    height: 100,
    paddingTop: 11,
  },

  // ── Toggle row ────────────────────────────────────────
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 12,
    padding: 14,
    marginBottom: 24,
  },
  toggleInfo: { flex: 1, alignItems: "flex-end", gap: 2 },
  toggleLabel: {
    fontFamily: "Alex_600",
    fontSize: 14,
    color: Colors.textPrimary,
    textAlign: "right",
  },
  toggleHint: {
    fontFamily: "Alex_400",
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: "right",
  },

  // ── Save button ───────────────────────────────────────
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 15,
  },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: {
    fontFamily: "Alex_700",
    fontSize: 12,
    color: "#fff",
  },
});
