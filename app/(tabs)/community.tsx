import { ScreenHeader } from "@/components/Ui/screen-header";
import { Colors } from "@/constants/colors";
import { clearCommunityBadge } from "@/store/navigation";
import { getPackageStyle } from "@/utils/package-factory";
import { useRouter } from "expo-router";
import { MessageSquare, Search, SlidersHorizontal } from "lucide-react-native";
import React, { memo, useEffect } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";

// ── Mock data ────────────────────────────────────────────────────────────────
const MEMBER_COLORS = ["#F29A52", "#4FC3C3", "#7B9FE0", "#E06B8B"];

const GROUPS = [
  {
    id: "1",
    name: "مجموعه حصة باقه المسلم",
    subject: "قرآن",
    lastMessage: "اهلا بيكم يا شباب اخبار الواجب ايه",
    time: "امس",
    unread: 1,
  },
  {
    id: "2",
    name: "مجموعه حصة رياضيات",
    subject: "رياضيات",
    lastMessage: "اهلا بيكم يا شباب اخبار الواجب ايه",
    time: "امس",
    unread: 1,
  },
  {
    id: "3",
    name: "مجموعه حصة علوم",
    subject: "علوم",
    lastMessage: "اهلا بيكم يا شباب اخبار الواجب ايه",
    time: "امس",
    unread: 1,
  },
  {
    id: "4",
    name: "مجموعه حصة لغة عربية",
    subject: "عربية",
    lastMessage: "اهلا بيكم يا شباب اخبار الواجب ايه",
    time: "امس",
    unread: 1,
  },
  {
    id: "5",
    name: "مجموعه حصة إنجليزي",
    subject: "إنجليزي",
    lastMessage: "اهلا بيكم يا شباب اخبار الواجب ايه",
    time: "امس",
    unread: 0,
  },
];

type Group = (typeof GROUPS)[0];

// ── Group card ───────────────────────────────────────────────────────────────
const GroupCard = memo(function GroupCard({ item }: { item: Group }) {
  const router = useRouter();
  const { image: SubjectIcon, bgColor } = getPackageStyle(item.subject);
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() =>
        router.push({ pathname: "/group-chat", params: { name: item.name, subject: item.subject } })
      }
    >
      <View style={styles.cardInner}>
        {/* Left: time + badge */}
        <View style={styles.cardMeta}>
          <Text style={styles.cardTime}>{item.time}</Text>
          {item.unread > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.unread}</Text>
            </View>
          )}
        </View>

        {/* Center: name, last message, member avatars */}
        <View style={styles.cardBody}>
          <Text style={styles.groupName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage}
          </Text>
          <View style={styles.membersRow}>
            {MEMBER_COLORS.map((color, i) => (
              <View
                key={i}
                style={[
                  styles.memberAvatar,
                  { backgroundColor: color, marginRight: i === 0 ? 0 : 4 },
                ]}
              />
            ))}
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

// ── Screen ───────────────────────────────────────────────────────────────────
export default function CommunityScreen() {
  const dispatch = useDispatch();
  const [search, setSearch] = React.useState("");

  useEffect(() => {
    dispatch(clearCommunityBadge());
  }, [dispatch]);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScreenHeader title="المجتمع" icon={MessageSquare} />

      <FlatList
        data={GROUPS}
        keyExtractor={(g) => g.id}
        renderItem={({ item }) => <GroupCard item={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            {/* ── Countdown banner ── */}
            {/* <View style={styles.banner}>
              <TouchableOpacity style={styles.joinBtn} activeOpacity={0.85}>
                <ArrowLeft size={16} color="#fff" />
                <Text style={styles.joinBtnText}>انضم الآن</Text>
              </TouchableOpacity>
              <View style={styles.countdown}>
                <Text style={styles.countdownNum}>00</Text>
                <Text style={styles.countdownLabel}>ساعة</Text>
                <View style={styles.countdownDivider} />
                <Text style={styles.countdownNum}>00</Text>
                <Text style={styles.countdownLabel}>أيام</Text>
              </View>
            </View> */}

            {/* ── Search bar ── */}
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
          </>
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

  // ── Banner ────────────────────────────────────────────
  banner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
    marginTop: 8,
    gap: 12,
  },
  joinBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: 50,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  joinBtnText: {
    fontSize: 14,
    fontFamily: "Alex_700",
    color: "#fff",
  },
  countdown: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
    borderStyle: "dashed",
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  countdownNum: {
    fontSize: 16,
    fontFamily: "Alex_700",
    color: Colors.textPrimary,
  },
  countdownLabel: {
    fontSize: 13,
    fontFamily: "Alex_400",
    color: Colors.textSecondary,
  },
  countdownDivider: {
    width: 1,
    height: 16,
    backgroundColor: Colors.borderLight,
    marginHorizontal: 2,
  },

  // ── Search ────────────────────────────────────────────
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    borderRadius: 14,
    // borderWidth: 1,
    // borderColor: Colors.borderLight,
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

  // ── Group card ────────────────────────────────────────
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
  },
  memberAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: "#FE8401",
  },
  groupImage: {
    width: 56,
    height: 56,
    borderRadius: 50,
    backgroundColor: Colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
    // borderWidth: 1,
    // borderColor: Colors.borderLight,
  },
  groupImageText: {
    fontSize: 26,
  },
});
