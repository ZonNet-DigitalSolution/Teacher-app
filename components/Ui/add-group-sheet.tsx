import { Colors } from "@/constants/colors";
import { API_ENDPOINTS } from "@/constants/endpoints";
import { api, normalizeError } from "@/services/api";
import { Package } from "@/types/group.types";
import { CheckCircle, ChevronDown, Plus, X } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
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
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.85;

const TIMES = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
];

type Props = {
  visible: boolean;
  onClose: () => void;
  onCreated: () => void;
};

export function AddGroupSheet({ visible, onClose, onCreated }: Props) {
  "use no memo";

  const { bottom } = useSafeAreaInsets();
  const translateY = useMemo(() => new Animated.Value(SHEET_HEIGHT), []);

  const [groupName, setGroupName] = useState("");
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [packageOpen, setPackageOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);

  const [packages, setPackages] = useState<Package[]>([]);
  const [pkgLoading, setPkgLoading] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible ? 0 : SHEET_HEIGHT,
      duration: visible ? 300 : 240,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished && !visible) {
        setGroupName("");
        setSelectedPackage(null);
        setSelectedTimes([]);
        setPackageOpen(false);
        setTimeOpen(false);
        setError(null);
        setSuccess(false);
      }
    });
  }, [visible, translateY]);

  useEffect(() => {
    if (!visible || packages.length > 0) return;
    let cancelled = false;
    async function load() {
      await Promise.resolve();
      if (cancelled) return;
      setPkgLoading(true);
      try {
        const { data } = await api.get<{ data: any[] }>(
          API_ENDPOINTS.PACKAGES.LIST,
        );
        if (!cancelled) {
          const list = data.data ?? (data as any);
          setPackages(Array.isArray(list) ? list : []);
        }
      } catch {
      } finally {
        if (!cancelled) setPkgLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [visible, packages.length]);

  function toggleTime(t: string) {
    setSelectedTimes((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
    );
  }

  async function handleSubmit() {
    if (!groupName.trim() || !selectedPackage) return;
    try {
      setSubmitting(true);
      setError(null);
      await api.post(API_ENDPOINTS.GROUPS.CREATE, {
        name: groupName.trim(),
        package_id: String(selectedPackage.id),
        times: selectedTimes,
        is_special: false,
      });
      setSuccess(true);
      setTimeout(() => {
        onCreated();
        onClose();
      }, 1200);
    } catch (err) {
      setError(normalizeError(err));
    } finally {
      setSubmitting(false);
    }
  }

  const isValid = groupName.trim().length > 0 && selectedPackage !== null;

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
            <Text style={styles.headerTitle}>إضافة مجموعة جديدة</Text>
            <View style={{ width: 36 }} />
          </View>

          <View style={styles.dashedDivider} />

          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Group name */}
            <Text style={styles.label}>اسم المجموعة</Text>
            <TextInput
              style={styles.input}
              value={groupName}
              onChangeText={setGroupName}
              placeholder="ادخل اسم المجموعة"
              placeholderTextColor={Colors.textPlaceholder}
              textAlign="right"
            />

            {/* Package picker */}
            <Text style={styles.label}>الباقة</Text>
            <TouchableOpacity
              style={styles.pickerBtn}
              activeOpacity={0.8}
              onPress={() => {
                setPackageOpen((v) => !v);
                setTimeOpen(false);
              }}
            >
              {pkgLoading ? (
                <ActivityIndicator size="small" color={Colors.primary} />
              ) : (
                <ChevronDown size={18} color={Colors.textSecondary} />
              )}
              <Text
                style={[
                  styles.pickerText,
                  !selectedPackage && styles.placeholder,
                ]}
              >
                {selectedPackage?.name ?? "اختر الباقة"}
              </Text>
            </TouchableOpacity>
            {packageOpen && (
              <View style={styles.dropdown}>
                {packages.map((p) => (
                  <TouchableOpacity
                    key={p.id}
                    style={styles.dropdownOption}
                    onPress={() => {
                      setSelectedPackage(p);
                      setPackageOpen(false);
                    }}
                  >
                    <Text style={styles.dropdownOptionText}>{p.name}</Text>
                  </TouchableOpacity>
                ))}
                {packages.length === 0 && (
                  <View style={styles.dropdownOption}>
                    <Text
                      style={[
                        styles.dropdownOptionText,
                        { color: Colors.textTertiary },
                      ]}
                    >
                      لا توجد باقات
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* Time picker */}
            <Text style={styles.label}>الوقت</Text>
            <Text style={styles.hint}>
              ) من الأوقات التي تختارها، سيوافق المشرف على وقتٍ واحد فقط (
            </Text>
            <TouchableOpacity
              style={styles.pickerBtn}
              activeOpacity={0.8}
              onPress={() => {
                setTimeOpen((v) => !v);
                setPackageOpen(false);
              }}
            >
              <ChevronDown size={18} color={Colors.textSecondary} />
              {selectedTimes.length === 0 ? (
                <Text style={[styles.pickerText, styles.placeholder]}>
                  اختر الاوقات
                </Text>
              ) : (
                <View style={styles.timeChips}>
                  {selectedTimes.map((t) => (
                    <View key={t} style={styles.timeChip}>
                      <Text style={styles.timeChipText}>{t}</Text>
                    </View>
                  ))}
                </View>
              )}
            </TouchableOpacity>
            {timeOpen && (
              <View style={styles.dropdown}>
                {TIMES.map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[
                      styles.dropdownOption,
                      selectedTimes.includes(t) &&
                        styles.dropdownOptionSelected,
                    ]}
                    onPress={() => toggleTime(t)}
                  >
                    <Text
                      style={[
                        styles.dropdownOptionText,
                        selectedTimes.includes(t) && { color: Colors.primary },
                      ]}
                    >
                      {t}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {error ? (
              <Text style={styles.errorMsg}>{error}</Text>
            ) : success ? (
              <View style={styles.successRow}>
                <CheckCircle size={18} color={Colors.success} />
                <Text style={styles.successMsg}>
                  تم إنشاء المجموعة، وسيتم إبلاغك بموعدها بعد أن يحدده المشرف
                </Text>
              </View>
            ) : null}
          </ScrollView>

          {/* Footer */}
          <View style={[styles.footer, { paddingBottom: bottom + 16 }]}>
            <TouchableOpacity
              style={[
                styles.submitBtn,
                (!isValid || submitting) && styles.submitBtnDim,
              ]}
              activeOpacity={0.85}
              onPress={handleSubmit}
              disabled={!isValid || submitting}
            >
              {submitting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Plus size={16} color="#fff" />
              )}
              <Text style={styles.submitBtnText}>اضافة مجموعة</Text>
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
  content: { paddingHorizontal: 16, gap: 8, paddingBottom: 16 },
  label: {
    fontSize: 16,
    fontFamily: "Alex_700",
    color: Colors.textPrimary,
    textAlign: "right",
    marginBottom: 4,
    marginTop: 8,
  },
  hint: {
    fontSize: 12,
    fontFamily: "Alex_400",
    color: Colors.textSecondary,
    textAlign: "right",
    marginBottom: 6,
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
  },
  pickerBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    minHeight: 52,
  },
  pickerText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Alex_500",
    color: Colors.textPrimary,
    textAlign: "right",
  },
  placeholder: { color: Colors.textPlaceholder },
  dropdown: {
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff",
    marginTop: -4,
  },
  dropdownOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  dropdownOptionSelected: { backgroundColor: Colors.primaryLight },
  dropdownOptionText: {
    fontSize: 14,
    fontFamily: "Alex_400",
    color: Colors.textPrimary,
    textAlign: "right",
  },
  timeChips: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 6,
    flex: 1,
  },
  timeChip: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  timeChipText: { fontSize: 12, fontFamily: "Alex_600", color: Colors.primary },
  errorMsg: {
    fontSize: 13,
    fontFamily: "Alex_400",
    color: Colors.error,
    textAlign: "center",
    marginTop: 8,
  },
  successRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginTop: 12,
  },
  successMsg: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Alex_600",
    color: Colors.success,
    textAlign: "right",
    lineHeight: 24,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: 50,
    paddingVertical: 14,
  },
  submitBtnDim: { backgroundColor: Colors.textTertiary },
  submitBtnText: { fontSize: 12, fontFamily: "Alex_700", color: "#fff" },
});
