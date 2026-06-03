import { ScreenHeader } from "@/components/Ui/screen-header";
import { Colors } from "@/constants/colors";
import { AppDispatch, RootState } from "@/store";
import { fetchGroups } from "@/store/community";
import type { ChatGroup } from "@/store/community/communityService";
import { clearCommunityBadge } from "@/store/navigation";
import { getPackageStyle } from "@/utils/package-factory";
import { useRouter } from "expo-router";
import { MessageSquare, Search, SlidersHorizontal } from "lucide-react-native";
import React, { memo, useCallback, useEffect, useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

// ── Group card ───────────────────────────────────────────────────────────────
const MEMBER_COLORS = ["#F29A52", "#4FC3C3", "#7B9FE0", "#E06B8B"];

const GroupCard = memo(function GroupCard({ item }: { item: ChatGroup }) {
  const router = useRouter();
  const { image: SubjectIcon, bgColor } = getPackageStyle(item.name);
  const lastMsg = item.latest_message?.content ?? "";
  const time = item.latest_message?.created_at
    ? formatTime(item.latest_message.created_at)
    : "";

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() =>
        router.push({
          pathname: "/group-chat",
          params: { groupId: String(item.id), name: item.name },
        })
      }
    >
      <View style={styles.cardInner}>
        {/* Left: time + badge */}
        <View style={styles.cardMeta}>
          <Text style={styles.cardTime}>{time}</Text>
          {item.unread_count > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.unread_count}</Text>
            </View>
          )}
        </View>

        {/* Center: name, last message, member count */}
        <View style={styles.cardBody}>
          <Text style={styles.groupName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {lastMsg}
          </Text>
          <View style={styles.membersRow}>
            {MEMBER_COLORS.slice(0, Math.min(item.member_count, 4)).map(
              (color, i) => (
                <View
                  key={i}
                  style={[
                    styles.memberAvatar,
                    { backgroundColor: color, marginRight: i === 0 ? 0 : 4 },
                  ]}
                />
              ),
            )}
            {item.member_count > 4 && (
              <Text style={styles.memberMore}>+{item.member_count - 4}</Text>
            )}
          </View>
        </View>

        {/* Right: group image */}
        <View style={[styles.groupImage, { backgroundColor: bgColor }]}>
          <SubjectIcon width={42} height={42} />
        </View>
      </View>
    </TouchableOpacity>
  );
});

function formatTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffDays === 0) {
    return date.toLocaleTimeString("ar-EG", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  if (diffDays === 1) return "امس";
  if (diffDays < 7) return `${diffDays} أيام`;
  return date.toLocaleDateString("ar-EG", { month: "short", day: "numeric" });
}

// ── Screen ───────────────────────────────────────────────────────────────────
export default function CommunityScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { groups, groupsLoading } = useSelector(
    (state: RootState) => state.community,
  );
  const [search, setSearch] = React.useState("");

  useEffect(() => {
    dispatch(clearCommunityBadge());
    dispatch(fetchGroups());
  }, [dispatch]);

  const filtered = useMemo(() => {
    if (!search.trim()) return groups;
    const q = search.toLowerCase();
    return groups.filter((g) => g.name.toLowerCase().includes(q));
  }, [groups, search]);

  const renderItem = useCallback(
    ({ item }: { item: ChatGroup }) => <GroupCard item={item} />,
    [],
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScreenHeader title="المجتمع" icon={MessageSquare} />

      <FlatList
        data={filtered}
        keyExtractor={(g) => String(g.id)}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.searchBar}>
            <TouchableOpacity style={styles.filterBtn}>
              <SlidersHorizontal size={18} color={Colors.textSecondary} />
            </TouchableOpacity>
            <TextInput
              style={styles.searchInput}
              value={search}
              onChangeText={setSearch}
              placeholder="ابحث عن شئ تريده داخل محادثاتك"
              placeholderTextColor={Colors.textPlaceholder}
              textAlign="right"
            />
            <Search size={18} color={Colors.textPlaceholder} />
          </View>
        }
        ListEmptyComponent={
          groupsLoading ? (
            <ActivityIndicator
              style={{ marginTop: 40 }}
              color={Colors.primary}
            />
          ) : (
            <Text style={styles.emptyText}>لا توجد مجموعات</Text>
          )
        }
        ListFooterComponent={<View style={{ height: 100 }} />}
      />
    </SafeAreaView>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FD" },
  listContent: { paddingHorizontal: 16, gap: 12 },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 50,
    marginBottom: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Alex_400",
    color: "#757575",
  },
  filterBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
  },

  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    padding: 14,
  },
  cardInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  cardMeta: {
    alignItems: "center",
    gap: 6,
    minWidth: 36,
  },
  cardTime: {
    fontSize: 11,
    fontFamily: "Alex_400",
    color: "#E89B32",
  },
  badge: {
    width: 22,
    height: 22,
    borderRadius: 5,
    backgroundColor: "#E89B32",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    fontSize: 11,
    fontFamily: "Alex_700",
    color: "#fff",
  },
  cardBody: {
    flex: 1,
    alignItems: "flex-end",
    gap: 3,
  },
  groupName: {
    fontSize: 15,
    fontFamily: "Alex_700",
    color: Colors.textPrimary,
    textAlign: "right",
  },
  lastMessage: {
    fontSize: 12,
    fontFamily: "Alex_400",
    color: Colors.textSecondary,
    textAlign: "right",
  },
  membersRow: {
    flexDirection: "row-reverse",
    marginTop: 4,
    alignItems: "center",
  },
  memberAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: "#FE8401",
  },
  memberMore: {
    fontSize: 11,
    fontFamily: "Alex_600",
    color: Colors.textSecondary,
    marginRight: 4,
  },
  groupImage: {
    width: 56,
    height: 56,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 14,
    fontFamily: "Alex_400",
    color: Colors.textSecondary,
  },
});
