import { Colors } from "@/constants/colors";
import { Maximize2, Pencil, Play, Settings2, X } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
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
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.88;

type AccountData = {
  nameAr: string;
  nameEn: string;
  teacherId: string;
  phone: string;
  email: string;
  country: string;
  joinDate: string;
  workType: string;
  bio: string;
};

type Props = {
  visible: boolean;
  data: AccountData;
  onClose: () => void;
  onEdit: () => void;
};

function buildInfoRows(d: AccountData) {
  return [
    { label: "الاسم باللغة العربية:", value: d.nameAr },
    { label: "الاسم باللغة الانجليزية:", value: d.nameEn },
    { label: "رقم المعلم التعريفي:", value: d.teacherId },
    { label: "رقم الجوال:", value: d.phone },
    { label: "البريد الالكتروني:", value: d.email || "غير متوفر" },
    { label: "البلد:", value: d.country },
    { label: "تاريخ الانضمام:", value: d.joinDate },
    { label: "نوع العمل:", value: d.workType },
  ];
}

export function AccountSheet({ visible, data, onClose, onEdit }: Props) {
  "use no memo";

  const { bottom } = useSafeAreaInsets();
  const [bioExpanded, setBioExpanded] = useState(false);
  const translateY = useMemo(() => new Animated.Value(SHEET_HEIGHT), []);

  const infoRows = useMemo(() => buildInfoRows(data), [data]);

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible ? 0 : SHEET_HEIGHT,
      duration: visible ? 300 : 240,
      useNativeDriver: true,
    }).start();
  }, [visible, translateY]);

  const bioText = data.bio;
  const bioShort = bioText.length > 120 ? bioText.slice(0, 120) : bioText;
  const isTruncatable = bioText.length > 120;

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
            <Text style={styles.headerTitle}>الملف الشخصي</Text>
            <View style={{ width: 36 }} />
          </View>

          <View style={styles.dashedDivider} />

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.content, { paddingBottom: bottom + 16 }]}
          >
            {/* ── نبذة تعريفية ── */}
            <Text style={styles.sectionTitle}>نبذة تعريفية</Text>
            <Text style={styles.bioText}>
              {bioExpanded || !isTruncatable ? bioText : bioShort}
              {isTruncatable && !bioExpanded && (
                <Text
                  onPress={() => setBioExpanded(true)}
                  style={styles.moreLink}
                >
                  {"  "}عرض المزيد....
                </Text>
              )}
            </Text>

            {/* ── الفيديو التعريفي ── */}
            <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
              الفيديو التعريفي
            </Text>
            <View style={styles.videoBox}>
              {/* Play button */}
              <View style={styles.playBtn}>
                <Play size={28} color="#fff" fill="#fff" />
              </View>
              {/* Duration + controls */}
              <View style={styles.videoControls}>
                <Text style={styles.videoDuration}>50:07</Text>
                <View style={styles.videoIcons}>
                  <Maximize2 size={18} color="#fff" />
                  <Settings2 size={18} color="#fff" />
                </View>
              </View>
            </View>

            {/* ── Info rows ── */}
            <View style={styles.infoTable}>
              {infoRows.map((row, i) => (
                <View
                  key={i}
                  style={[styles.infoRow, i !== 0 && styles.infoRowBorder]}
                >
                  <Text style={styles.infoValue}>{row.value}</Text>
                  <Text style={styles.infoLabel}>{row.label}</Text>
                </View>
              ))}
            </View>

            {/* ── Edit button ── */}
            <TouchableOpacity
              style={styles.editBtn}
              onPress={onEdit}
              activeOpacity={0.85}
            >
              <Text style={styles.editBtnText}>تعديل</Text>
              <Pencil size={18} color="#fff" />
            </TouchableOpacity>

          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
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
  },

  /* Sections */
  sectionTitle: {
    fontFamily: "Alex_600",
    fontSize: 17,
    color: Colors.textPrimary,
    textAlign: "right",
    marginBottom: 10,
  },

  /* Bio */
  bioText: {
    fontFamily: "Alex_300",
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "right",
    lineHeight: 24,
  },
  moreLink: {
    fontFamily: "Alex_600",
    color: Colors.primary,
  },

  /* Video */
  videoBox: {
    height: 200,
    borderRadius: 16,
    backgroundColor: "#1a1a2e",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  playBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  videoControls: {
    position: "absolute",
    bottom: 12,
    left: 12,
    right: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  videoDuration: {
    fontFamily: "Alex_700",
    fontSize: 13,
    color: "#fff",
  },
  videoIcons: {
    flexDirection: "row",
    gap: 12,
  },

  /* Info table */
  infoTable: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 13,
    paddingHorizontal: 16,
  },
  infoRowBorder: {
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  infoLabel: {
    fontFamily: "Alex_600",
    fontSize: 13,
    color: Colors.textPrimary,
    textAlign: "right",
  },
  infoValue: {
    fontFamily: "Alex_400",
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: "left",
    flex: 1,
    paddingLeft: 8,
  },

  /* Edit button */
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 15,
  },
  editBtnText: {
    fontFamily: "Alex_700",
    fontSize: 12,
    color: "#fff",
  },
});
