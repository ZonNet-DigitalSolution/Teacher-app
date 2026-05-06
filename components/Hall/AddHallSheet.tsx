import { Colors } from "@/constants/colors";
import { Hall, ROOM_TYPES } from "@/types/hall.types";
import { Check, ChevronDown, X } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
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

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.62;

type Props = {
  visible: boolean;
  editItem?: Hall | null;
  onClose: () => void;
  onAdd: (type: string, link: string) => void;
  onUpdate: (id: number, type: string, link: string) => void;
};

export function AddHallSheet({ visible, editItem, onClose, onAdd, onUpdate }: Props) {
  const translateY = useRef(new Animated.Value(SHEET_HEIGHT)).current;
  const [type, setType] = useState("");
  const [link, setLink] = useState("");
  const [typePickerOpen, setTypePickerOpen] = useState(false);

  const isEditing = !!editItem;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible ? 0 : SHEET_HEIGHT,
      duration: visible ? 300 : 240,
      useNativeDriver: true,
    }).start();

    if (visible && editItem) {
      setType(editItem.type);
      setLink(editItem.link);
    } else if (!visible) {
      setType("");
      setLink("");
      setTypePickerOpen(false);
    }
  }, [visible, editItem]);

  function handleSubmit() {
    if (!type.trim() || !link.trim()) return;
    if (isEditing && editItem) {
      onUpdate(editItem.id, type.trim(), link.trim());
    } else {
      onAdd(type.trim(), link.trim());
    }
    onClose();
  }

  const selectedLabel = ROOM_TYPES.find((r) => r.value === type)?.label ?? "";

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
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
            <Text style={styles.headerTitle}>
              {isEditing ? "تعديل القاعة" : "إضافة قاعة جديدة"}
            </Text>
            <View style={{ width: 36 }} />
          </View>

          <View style={styles.dashedDivider} />

          {/* Fields */}
          <ScrollView
            style={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Type picker */}
            <Text style={styles.label}>اسم القاعة</Text>
            <TouchableOpacity
              style={styles.pickerBtn}
              onPress={() => setTypePickerOpen((o) => !o)}
              activeOpacity={0.8}
            >
              <ChevronDown
                size={16}
                color={Colors.textSecondary}
                style={{ transform: [{ rotate: typePickerOpen ? "180deg" : "0deg" }] }}
              />
              <Text
                style={[styles.pickerBtnText, !type && styles.pickerPlaceholder]}
              >
                {selectedLabel || "اختر نوع القاعة"}
              </Text>
            </TouchableOpacity>

            {typePickerOpen && (
              <View style={styles.pickerDropdown}>
                {ROOM_TYPES.map((rt) => (
                  <TouchableOpacity
                    key={rt.value}
                    style={[
                      styles.pickerOption,
                      type === rt.value && styles.pickerOptionActive,
                    ]}
                    onPress={() => {
                      setType(rt.value);
                      setTypePickerOpen(false);
                    }}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.pickerOptionText,
                        type === rt.value && styles.pickerOptionTextActive,
                      ]}
                    >
                      {rt.label}
                    </Text>
                    {type === rt.value && (
                      <Check size={14} color={Colors.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <Text style={styles.label}>رابط القاعة</Text>
            <TextInput
              style={styles.input}
              value={link}
              onChangeText={setLink}
              placeholder="https://example.com/room-link"
              placeholderTextColor={Colors.textPlaceholder}
              textAlign="right"
              autoCapitalize="none"
              keyboardType="url"
            />

            <View style={{ height: 20 }} />
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.addBtn,
                (!type.trim() || !link.trim()) && styles.addBtnDisabled,
              ]}
              activeOpacity={0.85}
              onPress={handleSubmit}
              disabled={!type.trim() || !link.trim()}
            >
              <Text style={styles.addBtnText}>
                {isEditing ? "حفظ التعديلات" : "إضافة القاعة"}
              </Text>
            </TouchableOpacity>
          </View>
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
  content: { paddingHorizontal: 16, flex: 1 },
  label: {
    fontSize: 15,
    fontFamily: "Alex_700",
    color: Colors.textPrimary,
    textAlign: "right",
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 14,
    fontFamily: "Alex_400",
    color: Colors.textPrimary,
    textAlign: "right",
  },
  pickerBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: Colors.surfaceAlt,
  },
  pickerBtnText: { fontFamily: "Alex_400", fontSize: 14, color: Colors.textPrimary },
  pickerPlaceholder: { color: Colors.textPlaceholder },
  pickerDropdown: {
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 12,
    marginTop: 4,
    overflow: "hidden",
    backgroundColor: "#fff",
    marginBottom: 4,
  },
  pickerOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  pickerOptionActive: { backgroundColor: Colors.primaryLight },
  pickerOptionText: { fontFamily: "Alex_400", fontSize: 14, color: Colors.textPrimary },
  pickerOptionTextActive: { fontFamily: "Alex_600", color: Colors.primary },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  addBtn: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    borderRadius: 50,
    paddingVertical: 14,
  },
  addBtnDisabled: { backgroundColor: Colors.textTertiary },
  addBtnText: { fontSize: 15, fontFamily: "Alex_700", color: "#fff" },
});
