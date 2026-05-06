import { Colors } from "@/constants/colors";
import { API_ENDPOINTS } from "@/constants/endpoints";
import { api, normalizeError } from "@/services/api";
import { Group, Student } from "@/types/group.types";
import { CheckCircle, Save, Search, X } from "lucide-react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.85;

const GRADE_OPTIONS = ["ممتاز", "جيد جدا", "جيد", "مقبول", "ضعيف"];

// ─── Student row ──────────────────────────────────────────────────────────────

interface StudentReview {
  grade: string;
  comment: string;
}

function StudentItem({
  student,
  review,
  onChange,
}: {
  student: Student;
  review: StudentReview;
  onChange: (r: StudentReview) => void;
}) {
  const [gradeOpen, setGradeOpen] = useState(false);

  return (
    <View style={styles.studentItem}>
      <View style={styles.studentRow}>
        {/* Grade picker */}
        <View>
          <TouchableOpacity
            style={styles.gradeBtn}
            onPress={() => setGradeOpen((v) => !v)}
            activeOpacity={0.8}
          >
            <Text style={styles.gradeBtnText}>{review.grade}</Text>
          </TouchableOpacity>
          {gradeOpen && (
            <View style={styles.gradeDropdown}>
              {GRADE_OPTIONS.map((g) => (
                <TouchableOpacity
                  key={g}
                  style={styles.gradeOption}
                  onPress={() => {
                    onChange({ ...review, grade: g });
                    setGradeOpen(false);
                  }}
                >
                  <Text style={styles.gradeOptionText}>{g}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Name */}
        <Text style={styles.studentName}>{student.student_name}</Text>

        {/* Avatar */}
        <View style={styles.avatar}>
          <Text style={styles.avatarEmoji}>🧑‍🎓</Text>
        </View>
      </View>

      {/* Comment input */}
      <TextInput
        style={styles.noteInput}
        value={review.comment}
        onChangeText={(v) => onChange({ ...review, comment: v })}
        placeholder="ملاحظة (اختياري)"
        textAlign="right"
        placeholderTextColor={Colors.textPlaceholder}
      />

      <View style={styles.itemDivider} />
    </View>
  );
}

// ─── Sheet ────────────────────────────────────────────────────────────────────

type Props = {
  visible: boolean;
  group: Group | null;
  onClose: () => void;
};

export function StudentListSheet({ visible, group, onClose }: Props) {
  const translateY = useRef(new Animated.Value(SHEET_HEIGHT)).current;
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [reviews, setReviews] = useState<Record<number, StudentReview>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible ? 0 : SHEET_HEIGHT,
      duration: visible ? 300 : 240,
      useNativeDriver: true,
    }).start();
    if (!visible) {
      setSearch("");
      setStudents([]);
      setReviews({});
      setError(null);
      setSaved(false);
    }
  }, [visible]);

  const fetchStudents = useCallback(async () => {
    if (!group) return;
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get<{ data: any[] }>(
        `${API_ENDPOINTS.GROUPS.STUDENTS}${group.id}/students`,
      );
      const list = data.data ?? (data as any);
      const arr: Student[] = Array.isArray(list) ? list : [];
      setStudents(arr);
      const initial: Record<number, StudentReview> = {};
      arr.forEach((s) => {
        initial[s.id] = { grade: GRADE_OPTIONS[0], comment: "" };
      });
      setReviews(initial);
    } catch (err) {
      setError(normalizeError(err));
    } finally {
      setLoading(false);
    }
  }, [group]);

  useEffect(() => {
    if (visible && group) fetchStudents();
  }, [visible, group, fetchStudents]);

  async function handleSave() {
    if (!group || students.length === 0) return;
    try {
      setSaving(true);
      setError(null);
      const reviewPayload = students.map((s) => ({
        student_id: s.id,
        rating: reviews[s.id]?.grade ?? GRADE_OPTIONS[0],
        comment: reviews[s.id]?.comment ?? "",
      }));
      await api.post(`${API_ENDPOINTS.GROUPS.REVIEW}${group.id}`, {
        reviews: reviewPayload,
      });
      setSaved(true);
      setTimeout(onClose, 1200);
    } catch (err) {
      setError(normalizeError(err));
    } finally {
      setSaving(false);
    }
  }

  const filtered = search
    ? students.filter((s) => s.student_name.includes(search))
    : students;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <X size={18} color={Colors.textSecondary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              {group?.name ?? "قائمة الطلاب"}
            </Text>
            <View style={{ width: 36 }} />
          </View>

          <View style={styles.dashedDivider} />

          {/* Search */}
          <View style={styles.filterRow}>
            <View style={styles.searchBox}>
              <Search size={15} color={Colors.textPlaceholder} />
              <TextInput
                style={styles.searchInput}
                value={search}
                onChangeText={setSearch}
                placeholder="ابحث عن الطلاب...."
                placeholderTextColor={Colors.textPlaceholder}
                textAlign="right"
              />
            </View>
          </View>

          {/* Content */}
          {loading ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color={Colors.primary} />
            </View>
          ) : error ? (
            <View style={styles.center}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity onPress={fetchStudents} style={styles.retryBtn}>
                <Text style={styles.retryText}>إعادة المحاولة</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={filtered}
              keyExtractor={(s) => String(s.id)}
              renderItem={({ item }) => (
                <StudentItem
                  student={item}
                  review={reviews[item.id] ?? { grade: GRADE_OPTIONS[0], comment: "" }}
                  onChange={(r) =>
                    setReviews((prev) => ({ ...prev, [item.id]: r }))
                  }
                />
              )}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              ListEmptyComponent={
                <Text style={styles.emptyText}>لا يوجد طلاب في هذه المجموعة</Text>
              }
            />
          )}

          {/* Footer */}
          {group?.is_review && (
            <View style={styles.footer}>
              {saved ? (
                <View style={styles.savedRow}>
                  <CheckCircle size={18} color={Colors.success} />
                  <Text style={styles.savedText}>تم حفظ التقييمات</Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={[styles.saveBtn, saving && styles.saveBtnDim]}
                  activeOpacity={0.85}
                  onPress={handleSave}
                  disabled={saving || students.length === 0}
                >
                  {saving ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Save size={16} color="#fff" />
                  )}
                  <Text style={styles.saveBtnText}>حفظ التقييمات</Text>
                </TouchableOpacity>
              )}
              {error ? (
                <Text style={styles.errorText}>{error}</Text>
              ) : null}
            </View>
          )}
        </Animated.View>
      </View>
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
    marginVertical: 25,
  },
  filterRow: {
    flexDirection: "row-reverse",
    gap: 10,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Alex_400",
    color: Colors.textPrimary,
    padding: 0,
  },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 10 },
  errorText: {
    fontSize: 13,
    fontFamily: "Alex_400",
    color: Colors.error,
    textAlign: "center",
    paddingHorizontal: 24,
  },
  retryBtn: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.primary,
  },
  retryText: { fontSize: 13, fontFamily: "Alex_600", color: "#fff" },
  listContent: {
    paddingHorizontal: 16,
    marginHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 16,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: "Alex_400",
    color: Colors.textTertiary,
    textAlign: "center",
    paddingVertical: 24,
  },
  studentItem: { paddingVertical: 10 },
  studentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarEmoji: { fontSize: 22 },
  studentName: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Alex_600",
    color: Colors.textPrimary,
    textAlign: "right",
    marginHorizontal: 10,
  },
  gradeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#7D9DB5",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  gradeBtnText: { fontSize: 12, fontFamily: "Alex_600", color: "#08233F" },
  gradeDropdown: {
    position: "absolute",
    top: 40,
    left: 0,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    zIndex: 99,
    minWidth: 100,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  gradeOption: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  gradeOptionText: {
    fontSize: 13,
    fontFamily: "Alex_400",
    color: Colors.textPrimary,
    textAlign: "right",
  },
  noteInput: {
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    fontFamily: "Alex_400",
    color: Colors.textSecondary,
  },
  itemDivider: { height: 1, backgroundColor: Colors.borderLight, marginTop: 12 },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    gap: 8,
  },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: 50,
    paddingVertical: 14,
  },
  saveBtnDim: { backgroundColor: Colors.textTertiary },
  saveBtnText: { fontSize: 15, fontFamily: "Alex_700", color: "#fff" },
  savedRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
  },
  savedText: { fontSize: 15, fontFamily: "Alex_700", color: Colors.success },
});
