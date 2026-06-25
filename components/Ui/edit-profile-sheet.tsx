import { Colors } from "@/constants/colors";
import { AppDispatch } from "@/store";
import { updateProfileData, updateProfileImage } from "@/store/teacher";
import * as DocumentPicker from "expo-document-picker";
import { Camera, Save, X } from "lucide-react-native";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.92;

export type EditProfileData = {
  name: string;
  nameEn: string;
  email: string;
  country: string;
  bio: string;
  workType: string;
  profileImage: string | null;
};

type Props = {
  visible: boolean;
  data: EditProfileData;
  onClose: () => void;
};

type Field = {
  key: keyof Omit<EditProfileData, "profileImage">;
  label: string;
  multiline?: boolean;
  keyboardType?: "default" | "email-address";
};

const FIELDS: Field[] = [
  { key: "name", label: "الاسم باللغة العربية" },
  { key: "nameEn", label: "الاسم باللغة الانجليزية" },
  { key: "email", label: "البريد الالكتروني", keyboardType: "email-address" },
  { key: "country", label: "البلد" },
  { key: "workType", label: "نوع العمل" },
  { key: "bio", label: "نبذة تعريفية", multiline: true },
];

export function EditProfileSheet({ visible, data, onClose }: Props) {
  "use no memo";

  const dispatch = useDispatch<AppDispatch>();
  const { bottom } = useSafeAreaInsets();
  const translateY = useMemo(() => new Animated.Value(SHEET_HEIGHT), []);
  const original = useRef<Omit<EditProfileData, "profileImage">>(data);

  const [form, setForm] = useState<Omit<EditProfileData, "profileImage">>({
    name: data.name,
    nameEn: data.nameEn,
    email: data.email,
    country: data.country,
    bio: data.bio,
    workType: data.workType,
  });
  const [localImage, setLocalImage] = useState<string | null>(
    data.profileImage,
  );
  const [imageName, setImageName] = useState<string>("avatar.jpg");
  const [imageChanged, setImageChanged] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!visible) return;
    const snapshot = {
      name: data.name,
      nameEn: data.nameEn,
      email: data.email,
      country: data.country,
      bio: data.bio,
      workType: data.workType,
    };
    original.current = snapshot;
    Promise.resolve().then(() => {
      setForm(snapshot);
      setLocalImage(data.profileImage);
      setImageChanged(false);
    });
  }, [visible, data]);

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible ? 0 : SHEET_HEIGHT,
      duration: visible ? 300 : 240,
      useNativeDriver: true,
    }).start();
  }, [visible, translateY]);

  const pickImage = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "image/*",
      copyToCacheDirectory: true,
    });
    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];
      setLocalImage(asset.uri);
      setImageName(asset.name ?? "avatar.jpg");
      setImageChanged(true);
    }
  };

  const handleSave = async () => {
    const dirty = (Object.keys(form) as (keyof typeof form)[]).reduce(
      (acc, key) => {
        if (form[key] !== original.current[key]) acc[key] = form[key];
        return acc;
      },
      {} as Partial<typeof form>,
    );

    setSaving(true);
    try {
      if (Object.keys(dirty).length > 0) {
        await dispatch(updateProfileData(dirty)).unwrap();
      }
      if (imageChanged && localImage) {
        await dispatch(
          updateProfileImage({ imageUri: localImage, imageName }),
        ).unwrap();
      }
      onClose();
    } catch {
      // errors are surfaced via alertGateway in the api interceptor
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

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <X size={18} color={Colors.textSecondary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>تعديل الملف الشخصي</Text>
            <View style={{ width: 36 }} />
          </View>

          <View style={styles.dashedDivider} />

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.content,
              { paddingBottom: bottom + 24 },
            ]}
            keyboardShouldPersistTaps="handled"
          >
            {/* Avatar picker */}
            <TouchableOpacity
              style={styles.avatarWrap}
              onPress={pickImage}
              activeOpacity={0.8}
            >
              {localImage ? (
                <Image source={{ uri: localImage }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder} />
              )}
              <View style={styles.cameraBtn}>
                <Camera size={16} color="#fff" />
              </View>
            </TouchableOpacity>

            {/* Form fields */}
            {FIELDS.map((field) => (
              <View key={field.key} style={styles.fieldWrap}>
                <Text style={styles.fieldLabel}>{field.label}</Text>
                <TextInput
                  style={[
                    styles.input,
                    field.multiline && styles.inputMultiline,
                  ]}
                  value={form[field.key]}
                  onChangeText={(text) =>
                    setForm((prev) => ({ ...prev, [field.key]: text }))
                  }
                  textAlign="right"
                  keyboardType={field.keyboardType ?? "default"}
                  multiline={field.multiline}
                  numberOfLines={field.multiline ? 4 : 1}
                  autoCapitalize="none"
                  placeholderTextColor={Colors.textSecondary}
                />
              </View>
            ))}

            {/* Save button */}
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
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "flex-end" },
  backdrop: {
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 16,
    height: SHEET_HEIGHT,
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
    marginBottom: 20,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    alignItems: "stretch",
  },
  avatarWrap: {
    alignSelf: "center",
    marginBottom: 24,
    position: "relative",
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
  },
  cameraBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  fieldWrap: { marginBottom: 16 },
  fieldLabel: {
    fontFamily: "Alex_600",
    fontSize: 13,
    color: Colors.textPrimary,
    textAlign: "right",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontFamily: "Alex_400",
    fontSize: 14,
    color: Colors.textPrimary,
    backgroundColor: Colors.background,
  },
  inputMultiline: {
    height: 100,
    textAlignVertical: "top",
    paddingTop: 10,
  },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: Colors.primary,
    borderRadius: 50,
    paddingVertical: 11,
    marginTop: 8,
  },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: {
    fontFamily: "Alex_700",
    fontSize: 12,
    color: "#fff",
  },
});
