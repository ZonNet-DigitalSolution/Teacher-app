import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { EndIcon } from "./RoomIcons";

export function EndModal({
  visible,
  onClose,
  onConfirm,
}: {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={em.overlay}>
        <View style={em.sheet}>
          <View style={em.iconCircle}>
            <EndIcon color="#E84040" />
          </View>
          <Text style={em.title}>إنهاء الجلسة</Text>
          <Text style={em.subtitle}>هل أنت متأكد من رغبتك في إنهاء الجلسة؟</Text>
          <TouchableOpacity style={em.confirm} onPress={onConfirm} activeOpacity={0.85}>
            <Text style={em.confirmTxt}>إنهاء الجلسة</Text>
          </TouchableOpacity>
          <TouchableOpacity style={em.cancel} onPress={onClose} activeOpacity={0.85}>
            <Text style={em.cancelTxt}>إلغاء</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const em = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", alignItems: "center", justifyContent: "center" },
  sheet: { backgroundColor: "#fff", borderRadius: 20, padding: 24, width: "80%", alignItems: "center", gap: 8 },
  iconCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: "#FEE2E2", alignItems: "center", justifyContent: "center", marginBottom: 4 },
  title: { fontFamily: "Alex_700", fontSize: 17, color: "#1B3A4B" },
  subtitle: { fontFamily: "Alex_400", fontSize: 13, color: "#888", textAlign: "center" },
  confirm: { width: "100%", backgroundColor: "#E84040", borderRadius: 12, paddingVertical: 13, alignItems: "center", marginTop: 8 },
  confirmTxt: { fontFamily: "Alex_700", fontSize: 14, color: "#fff" },
  cancel: { width: "100%", borderWidth: 1, borderColor: "#E0E0E0", borderRadius: 12, paddingVertical: 13, alignItems: "center" },
  cancelTxt: { fontFamily: "Alex_700", fontSize: 14, color: "#888" },
});
