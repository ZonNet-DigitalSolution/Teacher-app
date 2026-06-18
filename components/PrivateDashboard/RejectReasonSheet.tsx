import { Colors } from "@/constants/colors";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  onConfirm: (reason: string) => void;
  onClose: () => void;
}

export function RejectReasonSheet({ onConfirm, onClose }: Props) {
  const [reason, setReason] = useState("");
  const canSubmit = reason.trim().length > 0;

  return (
    <Modal
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.sheetWrapper}
      >
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <Text style={styles.title}>سبب الرفض</Text>

          <TextInput
            multiline
            value={reason}
            onChangeText={setReason}
            placeholder="أدخل سبب الرفض..."
            placeholderTextColor={Colors.textTertiary}
            style={styles.input}
            textAlign="right"
            autoFocus
          />

          <TouchableOpacity
            style={[styles.confirmBtn, !canSubmit && styles.confirmBtnDisabled]}
            onPress={() => canSubmit && onConfirm(reason.trim())}
            activeOpacity={0.8}
          >
            <Text style={styles.confirmBtnText}>تأكيد الرفض</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
            <Text style={styles.cancelBtnText}>إلغاء</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheetWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    gap: 16,
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.borderLight,
    alignSelf: "center",
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontFamily: "Alex_700",
    color: Colors.textPrimary,
    textAlign: "right",
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 12,
    padding: 14,
    minHeight: 100,
    fontSize: 14,
    fontFamily: "Alex_400",
    color: Colors.textPrimary,
    textAlignVertical: "top",
  },
  confirmBtn: {
    backgroundColor: "#ef4444",
    borderRadius: 50,
    paddingVertical: 14,
    alignItems: "center",
  },
  confirmBtnDisabled: {
    opacity: 0.4,
  },
  confirmBtnText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "Alex_700",
  },
  cancelBtn: {
    alignItems: "center",
    paddingVertical: 8,
  },
  cancelBtnText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontFamily: "Alex_500",
  },
});
