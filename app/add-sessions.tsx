import { ScreenHeader } from "@/components/Ui/screen-header";
import { Colors } from "@/constants/colors";
import { AppDispatch, RootState } from "@/store";
import {
  createSessionThunk,
  fetchAddSessionsGroups,
  fetchSessionCount,
} from "@/store/sessions";
import type { DayTimeSelection, GroupItem } from "@/types/schedule.types";
import { useRouter } from "expo-router";
import { ArrowLeft, CalendarClock, Check, Clock } from "lucide-react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  FlatList,
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
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

// ── Constants ─────────────────────────────────────────────────────────────────

const DAYS = [
  { key: "sunday", label: "الأحد" },
  { key: "monday", label: "الإثنين" },
  { key: "tuesday", label: "الثلاثاء" },
  { key: "wednesday", label: "الأربعاء" },
  { key: "thursday", label: "الخميس" },
  { key: "friday", label: "الجمعة" },
  { key: "saturday", label: "السبت" },
];

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const MINUTES = Array.from({ length: 12 }, (_, i) =>
  String(i * 5).padStart(2, "0"),
);
const ITEM_H = 50;
const VISIBLE_ITEMS = 5;

const SELECTABLE_STATUSES = ["active", "completed", "processed", "closed"];

// ── Picker Sheet ──────────────────────────────────────────────────────────────

const { height: SCREEN_H } = Dimensions.get("window");

type PickerItem = { id: number; name: string };

function PickerSheet({
  visible,
  title,
  items,
  selectedId,
  onSelect,
  onClose,
}: {
  visible: boolean;
  title: string;
  items: PickerItem[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onClose: () => void;
}) {
  const translateY = useRef(new Animated.Value(SCREEN_H * 0.6)).current;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible ? 0 : SCREEN_H * 0.6,
      duration: visible ? 280 : 220,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
        <View style={styles.sheetHandle} />
        <Text style={styles.sheetTitle}>{title}</Text>
        <FlatList
          data={items}
          keyExtractor={(i) => String(i.id)}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.sheetItem}
              onPress={() => onSelect(item.id)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.sheetRadio,
                  item.id === selectedId && styles.sheetRadioActive,
                ]}
              >
                {item.id === selectedId && (
                  <Check size={12} color="#fff" strokeWidth={3} />
                )}
              </View>
              <Text style={styles.sheetItemText}>{item.name}</Text>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={styles.sheetSep} />}
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        />
      </Animated.View>
    </Modal>
  );
}

// ── Drum Column ───────────────────────────────────────────────────────────────

function DrumColumn({
  items,
  selected,
  onChange,
}: {
  items: string[];
  selected: string;
  onChange: (val: string) => void;
}) {
  const ref = useRef<FlatList>(null);
  const idx = Math.max(0, items.indexOf(selected));

  useEffect(() => {
    const timer = setTimeout(() => {
      ref.current?.scrollToIndex({ index: idx, animated: false, viewPosition: 0.5 });
    }, 80);
    return () => clearTimeout(timer);
  }, [idx]);

  return (
    <FlatList
      ref={ref}
      data={items}
      keyExtractor={(v) => v}
      snapToInterval={ITEM_H}
      decelerationRate="fast"
      showsVerticalScrollIndicator={false}
      style={{ height: ITEM_H * VISIBLE_ITEMS, width: 72 }}
      contentContainerStyle={{ paddingVertical: ITEM_H * 2 }}
      getItemLayout={(_, i) => ({ length: ITEM_H, offset: ITEM_H * i, index: i })}
      onMomentumScrollEnd={(e) => {
        const i = Math.round(e.nativeEvent.contentOffset.y / ITEM_H);
        onChange(items[Math.max(0, Math.min(i, items.length - 1))]);
      }}
      renderItem={({ item }) => (
        <View style={drumStyles.item}>
          <Text
            style={[drumStyles.label, item === selected && drumStyles.labelSelected]}
          >
            {item}
          </Text>
        </View>
      )}
    />
  );
}

// ── Time Picker Modal ─────────────────────────────────────────────────────────

function TimePicker({
  visible,
  initialTime,
  onConfirm,
  onClose,
}: {
  visible: boolean;
  initialTime: string;
  onConfirm: (time: string) => void;
  onClose: () => void;
}) {
  const [hour, setHour] = useState("08");
  const [minute, setMinute] = useState("00");
  const translateY = useRef(new Animated.Value(320)).current;

  useEffect(() => {
    if (visible) {
      const [h = "08", m = "00"] = (initialTime || "08:00").split(":");
      setHour(h.padStart(2, "0"));
      const snapped = String(Math.round(parseInt(m, 10) / 5) * 5).padStart(2, "0");
      setMinute(MINUTES.includes(snapped) ? snapped : "00");
    }
  }, [visible, initialTime]);

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible ? 0 : 320,
      duration: visible ? 280 : 220,
      useNativeDriver: true,
    }).start();
  }, [visible, translateY]);

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <Animated.View style={[drumStyles.sheet, { transform: [{ translateY }] }]}>
        <View style={drumStyles.handle} />
        <Text style={drumStyles.title}>حدد وقت بدء الحصة</Text>

        <View style={drumStyles.drumsWrap}>
          {/* Selection highlight behind the columns */}
          <View style={drumStyles.selectionBar} pointerEvents="none" />

          <View style={drumStyles.drumsRow}>
            <DrumColumn items={MINUTES} selected={minute} onChange={setMinute} />
            <Text style={drumStyles.colon}>:</Text>
            <DrumColumn items={HOURS} selected={hour} onChange={setHour} />
          </View>
        </View>

        <TouchableOpacity
          style={drumStyles.confirmBtn}
          onPress={() => onConfirm(`${hour}:${minute}`)}
          activeOpacity={0.85}
        >
          <Text style={drumStyles.confirmBtnText}>تأكيد</Text>
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  );
}

// ── Selector Card ─────────────────────────────────────────────────────────────

function SelectorCard({
  label,
  value,
  placeholder,
  onPress,
  disabled,
  loading,
}: {
  label: string;
  value: string;
  placeholder: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}) {
  return (
    <View style={styles.fieldBlock}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TouchableOpacity
        style={[styles.selector, disabled && styles.selectorDisabled]}
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator size="small" color={Colors.primary} />
        ) : (
          <>
            <ArrowLeft size={16} color={disabled ? Colors.borderLight : Colors.primary} />
            <Text
              style={[
                styles.selectorText,
                !value && styles.selectorPlaceholder,
                disabled && styles.selectorTextDisabled,
              ]}
              numberOfLines={1}
            >
              {value || placeholder}
            </Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────

export default function AddSessionsScreen() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { addGroups, addSubjects, addGroupsLoading, sessionCount, sessionCountLoading, creating } =
    useSelector((state: RootState) => state.sessions);

  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [dayTimes, setDayTimes] = useState<Record<string, string>>({});
  const [groupSheetVisible, setGroupSheetVisible] = useState(false);
  const [subjectSheetVisible, setSubjectSheetVisible] = useState(false);
  const [timePickerDay, setTimePickerDay] = useState<string | null>(null);

  // Only show selectable groups
  const selectableGroups = useMemo(
    () => addGroups.filter((g) => !g.status || SELECTABLE_STATUSES.includes(g.status)),
    [addGroups],
  );

  const selectedGroup: GroupItem | null =
    addGroups.find((g) => g.id === selectedGroupId) ?? null;

  // is_special is 0|1 from the API — cast to boolean
  const isSpecial = Boolean(selectedGroup?.is_special);

  const selectedSubject = addSubjects.find((s) => s.id === selectedSubjectId) ?? null;

  const remaining =
    !isSpecial && sessionCount !== null
      ? sessionCount - selectedDays.length
      : null;
  const canSelectMore = isSpecial || remaining === null || remaining > 0;

  // Fetch groups on mount
  useEffect(() => {
    dispatch(fetchAddSessionsGroups());
  }, [dispatch]);

  // When group changes: reset subject & days; auto-select if only one subject exists
  useEffect(() => {
    setSelectedDays([]);
    setDayTimes({});
    if (addSubjects.length === 1) {
      setSelectedSubjectId(addSubjects[0].id);
    } else {
      setSelectedSubjectId(null);
    }
  }, [selectedGroupId, addSubjects]);

  // Fetch session count whenever both group + subject are set
  useEffect(() => {
    if (selectedGroupId && selectedSubjectId) {
      dispatch(
        fetchSessionCount({ groupId: selectedGroupId, subjectId: selectedSubjectId }),
      );
      setSelectedDays([]);
      setDayTimes({});
    }
  }, [selectedGroupId, selectedSubjectId, dispatch]);

  const handleDayToggle = useCallback(
    (day: string) => {
      if (selectedDays.includes(day)) {
        setSelectedDays((prev) => prev.filter((d) => d !== day));
        setDayTimes((prev) => {
          const next = { ...prev };
          delete next[day];
          return next;
        });
      } else if (canSelectMore) {
        setSelectedDays((prev) => [...prev, day]);
      }
    },
    [selectedDays, canSelectMore],
  );

  const handleSubmit = useCallback(async () => {
    if (!selectedGroupId || !selectedSubjectId) {
      Alert.alert("تنبيه", "يرجى اختيار المجموعة والمادة الدراسية");
      return;
    }
    if (selectedDays.length === 0) {
      Alert.alert("تنبيه", "يرجى اختيار يوم واحد على الأقل");
      return;
    }
    if (!isSpecial && sessionCount !== null && selectedDays.length !== sessionCount) {
      Alert.alert("تنبيه", `يجب اختيار ${sessionCount} أيام بالضبط`);
      return;
    }
    if (isSpecial) {
      const missingTime = selectedDays.find((d) => !dayTimes[d]?.trim());
      if (missingTime) {
        Alert.alert("تنبيه", "يرجى تحديد وقت البداية لكل يوم مختار");
        return;
      }
    }

    const days: string[] | DayTimeSelection[] = isSpecial
      ? selectedDays.map((day) => ({ day, start_time: dayTimes[day] }))
      : selectedDays;

    try {
      await dispatch(
        createSessionThunk({
          group_id: String(selectedGroupId),
          subject_id: String(selectedSubjectId),
          is_special: isSpecial,
          days,
        }),
      ).unwrap();

      Alert.alert("تم بنجاح", "تم إنشاء المواعيد بنجاح", [
        { text: "حسنًا", onPress: () => router.back() },
      ]);
    } catch {
      // alertGateway handles the error toast
    }
  }, [
    selectedGroupId,
    selectedSubjectId,
    selectedDays,
    dayTimes,
    isSpecial,
    sessionCount,
    dispatch,
    router,
  ]);

  const backBtn = (
    <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
      <ArrowLeft size={20} color={Colors.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScreenHeader title="إضافة مواعيد" icon={CalendarClock} leftAction={backBtn} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Group selector ── */}
          <SelectorCard
            label="المجموعة *"
            value={selectedGroup?.name ?? ""}
            placeholder="اختر المجموعة"
            onPress={() => setGroupSheetVisible(true)}
            loading={addGroupsLoading}
          />

          {/* ── Subject selector ── */}
          <SelectorCard
            label="المادة الدراسية *"
            value={selectedSubject?.name ?? ""}
            placeholder="اختر المادة"
            onPress={() => setSubjectSheetVisible(true)}
            disabled={addSubjects.length === 0}
          />

          {/* ── Session count info (non-special only) ── */}
          {!isSpecial && selectedSubjectId && (
            <View style={styles.infoBox}>
              {sessionCountLoading ? (
                <ActivityIndicator size="small" color={Colors.primary} />
              ) : sessionCount !== null ? (
                <Text style={styles.infoText}>
                  {remaining === 0
                    ? "✓  اكتمل اختيار الأيام"
                    : `يلزم اختيار ${sessionCount} أيام  •  متبقي ${remaining}`}
                </Text>
              ) : null}
            </View>
          )}

          {/* ── Days grid ── */}
          {selectedSubjectId && (
            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>
                {isSpecial ? "الأيام والأوقات *" : "أيام الحصة *"}
              </Text>
              <View style={styles.daysGrid}>
                {DAYS.map((day) => {
                  const isSelected = selectedDays.includes(day.key);
                  const isDisabled = !isSelected && !canSelectMore;
                  return (
                    <TouchableOpacity
                      key={day.key}
                      style={[
                        styles.dayPill,
                        isSelected && styles.dayPillSelected,
                        isDisabled && styles.dayPillDisabled,
                      ]}
                      onPress={() => handleDayToggle(day.key)}
                      disabled={isDisabled}
                      activeOpacity={0.75}
                    >
                      <Text
                        style={[
                          styles.dayPillText,
                          isSelected && styles.dayPillTextSelected,
                          isDisabled && styles.dayPillTextDisabled,
                        ]}
                      >
                        {day.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* ── Time rows for special groups ── */}
              {isSpecial && selectedDays.length > 0 && (
                <View style={styles.timesBlock}>
                  <Text style={styles.timesHint}>
                    حدد وقت بدء الحصة لكل يوم مختار
                  </Text>
                  {selectedDays.map((dayKey) => {
                    const dayLabel =
                      DAYS.find((d) => d.key === dayKey)?.label ?? dayKey;
                    const time = dayTimes[dayKey] ?? "";
                    return (
                      <TouchableOpacity
                        key={dayKey}
                        style={[styles.timeRow, !!time && styles.timeRowFilled]}
                        onPress={() => setTimePickerDay(dayKey)}
                        activeOpacity={0.8}
                      >
                        <View style={styles.timeDisplay}>
                          <Clock
                            size={15}
                            color={time ? Colors.primary : Colors.textSecondary}
                          />
                          <Text
                            style={[
                              styles.timeValue,
                              !time && styles.timePlaceholder,
                            ]}
                          >
                            {time || "اختر الوقت"}
                          </Text>
                        </View>
                        <Text style={styles.timeRowLabel}>{dayLabel}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          )}

          {/* ── Submit ── */}
          <TouchableOpacity
            style={[
              styles.submitBtn,
              (creating || selectedDays.length === 0 || !selectedSubjectId) &&
                styles.submitBtnDisabled,
            ]}
            onPress={handleSubmit}
            disabled={creating || selectedDays.length === 0 || !selectedSubjectId}
            activeOpacity={0.85}
          >
            {creating ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.submitBtnText}>إنشاء المواعيد</Text>
            )}
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── Group picker sheet ── */}
      <PickerSheet
        visible={groupSheetVisible}
        title="اختر المجموعة"
        items={selectableGroups}
        selectedId={selectedGroupId}
        onSelect={(id) => {
          setSelectedGroupId(id);
          setGroupSheetVisible(false);
        }}
        onClose={() => setGroupSheetVisible(false)}
      />

      {/* ── Subject picker sheet ── */}
      <PickerSheet
        visible={subjectSheetVisible}
        title="اختر المادة الدراسية"
        items={addSubjects}
        selectedId={selectedSubjectId}
        onSelect={(id) => {
          setSelectedSubjectId(id);
          setSubjectSheetVisible(false);
        }}
        onClose={() => setSubjectSheetVisible(false)}
      />

      {/* ── Time Picker ── */}
      <TimePicker
        visible={timePickerDay !== null}
        initialTime={timePickerDay ? (dayTimes[timePickerDay] ?? "") : ""}
        onConfirm={(time) => {
          if (timePickerDay) {
            setDayTimes((prev) => ({ ...prev, [timePickerDay]: time }));
          }
          setTimePickerDay(null);
        }}
        onClose={() => setTimePickerDay(null)}
      />
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  flex: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 8 },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },

  // ── Field ──────────────────────────────────────────────
  fieldBlock: { marginBottom: 20 },
  fieldLabel: {
    fontFamily: "Alex_600",
    fontSize: 14,
    color: Colors.textPrimary,
    textAlign: "right",
    marginBottom: 8,
  },

  // ── Selector ───────────────────────────────────────────
  selector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 10,
  },
  selectorDisabled: {
    backgroundColor: Colors.surfaceAlt,
    borderColor: Colors.borderLight,
  },
  selectorText: {
    flex: 1,
    fontFamily: "Alex_500",
    fontSize: 14,
    color: Colors.textPrimary,
    textAlign: "right",
  },
  selectorPlaceholder: { color: Colors.textPlaceholder },
  selectorTextDisabled: { color: Colors.textSecondary },

  // ── Info box ───────────────────────────────────────────
  infoBox: {
    backgroundColor: "#EFF6FF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
    alignItems: "center",
    minHeight: 44,
    justifyContent: "center",
  },
  infoText: {
    fontFamily: "Alex_600",
    fontSize: 13,
    color: Colors.primary,
    textAlign: "center",
  },

  // ── Days grid ──────────────────────────────────────────
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "flex-end",
  },
  dayPill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  dayPillSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  dayPillDisabled: {
    backgroundColor: Colors.surfaceAlt,
    borderColor: Colors.borderLight,
  },
  dayPillText: {
    fontFamily: "Alex_600",
    fontSize: 13,
    color: Colors.textPrimary,
  },
  dayPillTextSelected: { color: "#fff" },
  dayPillTextDisabled: { color: Colors.textSecondary },

  // ── Time rows (special groups) ─────────────────────────
  timesBlock: { marginTop: 16, gap: 10 },
  timesHint: {
    fontFamily: "Alex_500",
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: "right",
    marginBottom: 2,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  timeRowFilled: { borderColor: Colors.primary },
  timeDisplay: { flexDirection: "row", alignItems: "center", gap: 6 },
  timeValue: {
    fontFamily: "Alex_700",
    fontSize: 15,
    color: Colors.primary,
    letterSpacing: 1,
  },
  timePlaceholder: {
    fontFamily: "Alex_400",
    fontSize: 13,
    color: Colors.textPlaceholder,
    letterSpacing: 0,
  },
  timeRowLabel: {
    fontFamily: "Alex_600",
    fontSize: 14,
    color: Colors.textPrimary,
  },

  // ── Submit ─────────────────────────────────────────────
  submitBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  submitBtnDisabled: { opacity: 0.5 },
  submitBtnText: {
    fontFamily: "Alex_700",
    fontSize: 16,
    color: "#fff",
  },

  // ── Picker sheet ───────────────────────────────────────
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: SCREEN_H * 0.6,
    paddingTop: 12,
    paddingHorizontal: 20,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E0E0E0",
    alignSelf: "center",
    marginBottom: 16,
  },
  sheetTitle: {
    fontFamily: "Alex_700",
    fontSize: 16,
    color: Colors.textPrimary,
    textAlign: "right",
    marginBottom: 12,
  },
  sheetItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingVertical: 14,
    gap: 12,
  },
  sheetItemText: {
    fontFamily: "Alex_500",
    fontSize: 14,
    color: Colors.textPrimary,
    textAlign: "right",
    flex: 1,
  },
  sheetRadio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  sheetRadioActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  sheetSep: {
    height: 1,
    backgroundColor: Colors.borderLight,
  },
});

const DRUM_H = ITEM_H * VISIBLE_ITEMS;

const drumStyles = StyleSheet.create({
  // ── Sheet wrapper ──────────────────────────────────────
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 12,
    paddingBottom: 32,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E0E0E0",
    marginBottom: 16,
  },
  title: {
    fontFamily: "Alex_700",
    fontSize: 17,
    color: Colors.textPrimary,
    marginBottom: 20,
  },

  // ── Drum columns ───────────────────────────────────────
  drumsWrap: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  drumsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  selectionBar: {
    position: "absolute",
    top: ITEM_H * 2,
    left: 24,
    right: 24,
    height: ITEM_H,
    backgroundColor: Colors.primaryLight,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    opacity: 0.5,
  },
  item: {
    height: ITEM_H,
    width: 72,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontFamily: "Alex_600",
    fontSize: 22,
    color: "#C0C0C0",
  },
  labelSelected: {
    color: Colors.primary,
    fontSize: 26,
  },
  colon: {
    fontFamily: "Alex_700",
    fontSize: 28,
    color: Colors.primary,
    marginBottom: 4,
    width: 20,
    textAlign: "center",
    height: DRUM_H,
    lineHeight: DRUM_H,
  },

  // ── Confirm button ─────────────────────────────────────
  confirmBtn: {
    width: "100%",
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
  },
  confirmBtnText: {
    fontFamily: "Alex_700",
    fontSize: 16,
    color: "#fff",
  },
});
