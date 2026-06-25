import GroupIcon from "@/assets/svg/Group.svg";
import { AddGroupSheet } from "@/components/Ui/add-group-sheet";
import { ScreenHeader } from "@/components/Ui/screen-header";
import { StudentListSheet } from "@/components/Ui/student-list-sheet";
import { Colors } from "@/constants/colors";
import { API_ENDPOINTS } from "@/constants/endpoints";
import { useAlert } from "@/hooks/use-alert";
import { api, normalizeError } from "@/services/api";
import {
  Group,
  GROUP_STATUS_COLORS,
  GROUP_STATUS_LABELS,
} from "@/types/group.types";
import { ChevronDown, Eye, Plus, Trash2, Users } from "lucide-react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ClipPath, Defs, G, Path, Rect, Svg } from "react-native-svg";

// ─── Group card ───────────────────────────────────────────────────────────────

function GroupCard({
  item,
  onStudentList,
  onDelete,
}: {
  item: Group;
  onStudentList: () => void;
  onDelete: () => void;
}) {
  const statusColor = GROUP_STATUS_COLORS[item.status] ?? Colors.textTertiary;
  const statusLabel = GROUP_STATUS_LABELS[item.status] ?? item.status;
  const classList = item.classes?.join("، ") || item.package_name || "";

  return (
    <View style={styles.card}>
      {/* Delete button */}
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={onDelete}
        activeOpacity={0.8}
      >
        <Trash2 size={16} color={Colors.error} />
      </TouchableOpacity>

      {/* Icon circle */}
      <View style={styles.iconCircle}>
        <GroupIcon width={28} height={28} />
      </View>

      {/* Info */}
      <Text style={styles.cardName}>{item.name}</Text>
      {classList ? <Text style={styles.cardGrade}>{classList}</Text> : null}

      {/* Status badge */}
      <View
        style={[styles.statusBadge, { backgroundColor: statusColor + "20" }]}
      >
        <Text style={[styles.statusText, { color: statusColor }]}>
          {statusLabel}
        </Text>
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statText}>{item.student_count ?? 0} طالب</Text>
          <GroupIcon width={18} height={18} />
        </View>

        {item.time ? (
          <>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statText}>{item.time}</Text>
              <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
                <Defs>
                  <ClipPath id="clip_clock">
                    <Rect width="16" height="16" fill="white" />
                  </ClipPath>
                </Defs>
                <G clipPath="url(#clip_clock)">
                  <Path
                    d="M12.634 15.3333H12.612C12.2714 15.328 11.9474 15.1833 11.716 14.9333L10.4374 13.6793C10.1814 13.4147 10.1874 12.9927 10.4521 12.7367C10.7187 12.4807 11.1387 12.488 11.394 12.7507L12.6347 13.966L14.862 11.7387C15.122 11.4787 15.5447 11.4787 15.8047 11.7387C16.0647 11.9987 16.0647 12.4213 15.8047 12.6813L13.524 14.962C13.2894 15.2 12.9687 15.334 12.634 15.3333Z"
                    fill="#5C6064"
                  />
                  <Path
                    d="M9.35649 13.3435C9.35383 11.1455 11.1332 9.36149 13.3305 9.35816C14.1858 9.35682 15.0192 9.63149 15.7058 10.1415C16.8878 5.88482 14.3952 1.47615 10.1392 0.294155C5.88316 -0.887845 1.47516 1.60415 0.293162 5.86082C-0.888838 10.1175 1.60383 14.5268 5.85983 15.7088C7.25983 16.0975 8.73916 16.0975 10.1392 15.7088C9.63116 15.0248 9.35649 14.1955 9.35649 13.3435ZM8.6665 8.01482C8.6665 8.19216 8.59583 8.36149 8.4705 8.48682L6.46716 10.4908C6.20183 10.7468 5.77916 10.7395 5.52316 10.4742C5.27316 10.2155 5.27316 9.80482 5.52316 9.54616L7.33116 7.73816V4.67549C7.33116 4.30682 7.62983 4.00749 7.99916 4.00749C8.36783 4.00749 8.6665 4.30682 8.6665 4.67549V8.01482Z"
                    fill="#5C6064"
                  />
                </G>
              </Svg>
            </View>
          </>
        ) : null}
      </View>

      {/* Button */}
      <TouchableOpacity
        style={styles.listBtn}
        activeOpacity={0.8}
        onPress={onStudentList}
      >
        <Text style={styles.listBtnText}>قائمة الطلاب</Text>
        <Eye size={18} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function GroupsScreen() {
  const alert = useAlert();

  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedClass, setSelectedClass] = useState("الكل");
  const [filterOpen, setFilterOpen] = useState(false);

  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [studentSheetVisible, setStudentSheetVisible] = useState(false);
  const [addSheetVisible, setAddSheetVisible] = useState(false);

  const fetchGroups = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { data } = await api.get<{ data: { groups: any[] } }>(
        API_ENDPOINTS.GROUPS.LIST,
      );
      const raw = data.data?.groups ?? data.data ?? (data as any);
      setGroups(Array.isArray(raw) ? raw : []);
    } catch (err) {
      setError(normalizeError(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    Promise.resolve().then(() => fetchGroups());
  }, [fetchGroups]);

  const deleteGroup = useCallback(async (id: number) => {
    await api.delete(`${API_ENDPOINTS.GROUPS.DELETE}${id}`);
    setGroups((prev) => prev.filter((g) => g.id !== id));
  }, []);

  const handleDelete = useCallback(
    (group: Group) => {
      alert.confirm({
        type: "warning",
        title: "حذف المجموعة",
        message: `هل أنت متأكد من حذف "${group.name}"؟ لا يمكن التراجع عن هذا الإجراء.`,
        confirmAction: {
          label: "حذف",
          style: "danger",
          onPress: () => deleteGroup(group.id),
        },
        cancelAction: { label: "إلغاء", style: "secondary", onPress: () => {} },
      });
    },
    [alert, deleteGroup],
  );

  // Build unique class list for filter
  const classes = useMemo(() => {
    const seen = new Set<string>();
    groups.forEach((g) => {
      g.classes?.forEach((c) => seen.add(c));
      if (g.package_name) seen.add(g.package_name);
    });
    return ["الكل", ...Array.from(seen)];
  }, [groups]);

  const filtered = useMemo(() => {
    if (selectedClass === "الكل") return groups;
    return groups.filter(
      (g) =>
        g.classes?.includes(selectedClass) || g.package_name === selectedClass,
    );
  }, [groups, selectedClass]);

  return (
    <SafeAreaView style={styles.screen}>
      <ScreenHeader title="المجموعات" icon={Users} />

      {/* Toolbar */}
      <View style={styles.toolbar}>
        <TouchableOpacity
          style={styles.addBtn}
          activeOpacity={0.85}
          onPress={() => setAddSheetVisible(true)}
        >
          <Text style={styles.addBtnText}>مجموعة جديدة</Text>
          <Plus size={17} color="#fff" />
        </TouchableOpacity>

        <View>
          <TouchableOpacity
            style={[styles.gradeBtn, filterOpen && styles.gradeBtnActive]}
            activeOpacity={0.8}
            onPress={() => setFilterOpen((v) => !v)}
          >
            <ChevronDown
              size={15}
              color={filterOpen ? Colors.primary : Colors.textSecondary}
              style={{
                transform: [{ rotate: filterOpen ? "180deg" : "0deg" }],
              }}
            />
            <Text
              style={[
                styles.gradeBtnText,
                filterOpen && styles.gradeBtnTextActive,
              ]}
            >
              {selectedClass}
            </Text>
          </TouchableOpacity>
          {filterOpen && (
            <View style={styles.filterDropdown}>
              {classes.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[
                    styles.filterOption,
                    selectedClass === c && styles.filterOptionSelected,
                  ]}
                  onPress={() => {
                    setSelectedClass(c);
                    setFilterOpen(false);
                  }}
                >
                  <Text
                    style={[
                      styles.filterOptionText,
                      selectedClass === c && styles.filterOptionTextActive,
                    ]}
                  >
                    {c}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>

      {/* Content */}
      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={fetchGroups}>
            <Text style={styles.retryText}>إعادة المحاولة</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <GroupCard
              item={item}
              onStudentList={() => {
                setSelectedGroup(item);
                setStudentSheetVisible(true);
              }}
              onDelete={() => handleDelete(item)}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <GroupIcon width={56} height={56} />
              <Text style={styles.emptyTitle}>لا توجد مجموعات</Text>
              <Text style={styles.emptySub}>
                {selectedClass === "الكل"
                  ? 'اضغط على "اضافة مجموعة" للبدء'
                  : "لا توجد مجموعات لهذا الصف"}
              </Text>
            </View>
          }
          ListFooterComponent={<View style={{ height: 100 }} />}
        />
      )}

      <StudentListSheet
        visible={studentSheetVisible}
        group={selectedGroup}
        onClose={() => setStudentSheetVisible(false)}
      />

      <AddGroupSheet
        visible={addSheetVisible}
        onClose={() => setAddSheetVisible(false)}
        onCreated={fetchGroups}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },

  /* Toolbar */
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 16,
    zIndex: 20,
  },
  addBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 13,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  addBtnText: { fontFamily: "Alex_700", fontSize: 13, color: "#fff" },
  gradeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 14,
    backgroundColor: "#fff",
  },
  gradeBtnActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  gradeBtnText: {
    fontFamily: "Alex_600",
    fontSize: 13,
    color: Colors.textPrimary,
  },
  gradeBtnTextActive: { color: Colors.primary },
  filterDropdown: {
    position: "absolute",
    top: 52,
    left: 0,
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    minWidth: 150,
    zIndex: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    overflow: "hidden",
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  filterOptionSelected: { backgroundColor: Colors.primaryLight },
  filterOptionTextActive: { fontFamily: "Alex_700", color: Colors.primary },
  filterOptionText: {
    fontFamily: "Alex_400",
    fontSize: 13,
    color: Colors.textPrimary,
    textAlign: "right",
  },

  /* Center states */
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  errorText: {
    fontSize: 14,
    fontFamily: "Alex_400",
    color: Colors.error,
    textAlign: "center",
    paddingHorizontal: 24,
  },
  retryBtn: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.primary,
  },
  retryText: { fontSize: 13, fontFamily: "Alex_600", color: "#fff" },

  /* List */
  list: { paddingHorizontal: 16, gap: 12 },

  /* Empty */
  empty: { alignItems: "center", paddingVertical: 60, gap: 10 },
  emptyTitle: {
    fontSize: 16,
    fontFamily: "Alex_600",
    color: Colors.textSecondary,
  },
  emptySub: {
    fontSize: 13,
    fontFamily: "Alex_400",
    color: Colors.textTertiary,
    textAlign: "center",
  },

  /* Card */
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    paddingTop: 20,
    alignItems: "center",
  },
  deleteBtn: {
    position: "absolute",
    top: 12,
    left: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  cardName: {
    fontFamily: "Alex_700",
    fontSize: 16,
    color: Colors.textPrimary,
    textAlign: "center",
    marginBottom: 4,
  },
  cardGrade: {
    fontFamily: "Alex_400",
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 8,
  },
  statusBadge: {
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginBottom: 14,
  },
  statusText: { fontFamily: "Alex_700", fontSize: 12 },

  /* Stats */
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 16,
  },
  statItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  statText: { fontFamily: "Alex_700", fontSize: 12, color: Colors.primary },
  statDivider: { width: 1, height: 16, backgroundColor: Colors.border },

  /* Button */
  listBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 8,
    width: "100%",
  },
  listBtnText: { fontFamily: "Alex_700", fontSize: 14, color: "#fff" },
});
