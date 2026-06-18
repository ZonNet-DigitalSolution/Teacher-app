import { AccountSheet } from "@/components/Ui/account-sheet";
import { EditProfileSheet } from "@/components/Ui/edit-profile-sheet";
import { ScreenHeader } from "@/components/Ui/screen-header";
import { Colors } from "@/constants/colors";
import { useAuth } from "@/hooks/use-auth";
import { sendTestPushNotification } from "@/services/pushNotificationsService";
import { fetchProfile } from "@/store/teacher";
import { useRouter } from "expo-router";
import {
  BellRing,
  BookOpen,
  CalendarClock,
  Lightbulb,
  LogOut,
  Settings,
  Star,
  User,
  UserCircle,
  UserCog,
  Video,
} from "lucide-react-native";
import { Path, Svg } from "react-native-svg";

import { AppDispatch, RootState } from "@/store";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

interface ProfileMenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size: number; color: string }>;
  iconColor: string;
  iconBg: string;
  isDestructive?: boolean;
  onPress?: () => void;
}

// ─── Pure stat item ───────────────────────────────────────────────────────────
const StatItem = memo(function StatItem({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
});

// ─── Pure menu row ────────────────────────────────────────────────────────────
const MenuRow = memo(function MenuRow({ item }: { item: ProfileMenuItem }) {
  const Icon = item.icon;
  return (
    <TouchableOpacity
      style={styles.menuItem}
      activeOpacity={0.7}
      onPress={item.onPress}
    >
      <Svg width={6} height={11} viewBox="0 0 6 11" fill="none">
        <Path
          d="M5.04291 9.75L1.25001 5.95711C0.916681 5.62377 0.750014 5.45711 0.750014 5.25C0.750014 5.04289 0.916681 4.87623 1.25001 4.54289L5.04291 0.75"
          stroke="#0C2D40"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
      <Text
        style={[
          styles.menuLabel,
          item.isDestructive && styles.menuLabelDestructive,
        ]}
      >
        {item.label}
      </Text>
      <View style={[styles.menuIconWrap, { backgroundColor: item.iconBg }]}>
        <Icon size={20} color={item.iconColor} />
      </View>
    </TouchableOpacity>
  );
});

// ─── Profile Screen ───────────────────────────────────────────────────────────
export default function ProfileScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const teacher = useSelector((state: RootState) => state.teacher);
  const { logout } = useAuth();
  const router = useRouter();
  const [accountSheetVisible, setAccountSheetVisible] = useState(false);
  const [editSheetVisible, setEditSheetVisible] = useState(false);
  const [isSendingTestPush, setIsSendingTestPush] = useState(false);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  const openAccountSheet = useCallback(() => setAccountSheetVisible(true), []);
  const closeAccountSheet = useCallback(
    () => setAccountSheetVisible(false),
    [],
  );
  const handleEdit = useCallback(() => {
    setAccountSheetVisible(false);
    setEditSheetVisible(true);
  }, []);

  const handleLogout = useCallback(() => {
    Alert.alert("تسجيل الخروج", "هل أنت متأكد من تسجيل الخروج؟", [
      { text: "إلغاء", style: "cancel" },
      { text: "تسجيل الخروج", style: "destructive", onPress: logout },
    ]);
  }, [logout]);

  const handleSendTestPush = useCallback(async () => {
    if (isSendingTestPush) return;

    try {
      setIsSendingTestPush(true);
      await sendTestPushNotification();
      Alert.alert("تم الإرسال", "تم إرسال إشعار الاختبار إلى موبايل المدرس الحالي.");
    } catch {
      Alert.alert("تعذر الإرسال", "تأكد من تسجيل الجهاز ومن صلاحية الإشعارات.");
    } finally {
      setIsSendingTestPush(false);
    }
  }, [isSendingTestPush]);

  const menuItems = useMemo<ProfileMenuItem[]>(
    () => [
      {
        id: "account",
        label: "بيانات الحساب",
        icon: UserCog,
        iconColor: Colors.primary,
        iconBg: Colors.primaryLight,
        onPress: openAccountSheet,
      },
      {
        id: "add-sessions",
        label: "إضافة مواعيد",
        icon: CalendarClock,
        iconColor: Colors.purple,
        iconBg: Colors.purpleBg,
        onPress: () => router.push("/add-sessions"),
      },
      {
        id: "library",
        label: "المكتبة الرقمية",
        icon: BookOpen,
        iconColor: Colors.info,
        iconBg: Colors.infoBg,
        onPress: () => router.push("/library"),
      },
      {
        id: "lobby",
        label: "قاعة الجلسات",
        icon: Video,
        iconColor: "#0e7490",
        iconBg: "#cffafe",
        onPress: () => router.push("/hall"),
      },
      {
        id: "reviews",
        label: "التقييمات",
        icon: Star,
        iconColor: Colors.warning,
        iconBg: Colors.warningBg,
        onPress: () => router.push("/reviews"),
      },
      {
        id: "guide",
        label: "دليل المعلم",
        icon: Lightbulb,
        iconColor: "#7c3aed",
        iconBg: Colors.purpleBg,
        onPress: () => router.push("/guide"),
      },
      ...(__DEV__
        ? [
            {
              id: "test-push",
              label: isSendingTestPush ? "جاري إرسال الإشعار..." : "إرسال إشعار اختبار",
              icon: BellRing,
              iconColor: Colors.info,
              iconBg: Colors.infoBg,
              onPress: handleSendTestPush,
            },
          ]
        : []),
      // {
      //   id: "invite",
      //   label: "دعوة الأشخاص",
      //   icon: Gift,
      //   iconColor: Colors.success,
      //   iconBg: Colors.successBg,
      // },
      {
        id: "logout",
        label: "تسجيل الخروج",
        icon: LogOut,
        iconColor: Colors.error,
        iconBg: "#fee2e2",
        isDestructive: true,
        onPress: handleLogout,
      },
    ],
    [openAccountSheet, handleLogout, router, isSendingTestPush, handleSendTestPush],
  );

  const settingsButton = (
    <TouchableOpacity style={styles.settingsBtn}>
      <Settings size={20} color={Colors.textSecondary} />
    </TouchableOpacity>
  );

  const displayRating = teacher.rating > 0 ? teacher.rating.toFixed(1) : null;

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title="الملف الشخصي"
        icon={UserCircle}
        leftAction={settingsButton}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          {/* Status badge */}
          {teacher.status && (
            <View
              style={[
                styles.statusBadge,
                teacher.status === "active"
                  ? styles.statusBadgeActive
                  : styles.statusBadgeInactive,
              ]}
            >
              <Text
                style={[
                  styles.statusBadgeText,
                  teacher.status === "active"
                    ? styles.statusBadgeTextActive
                    : styles.statusBadgeTextInactive,
                ]}
              >
                {teacher.status === "active" ? "نشط" : "غير نشط"}
              </Text>
            </View>
          )}

          <View style={styles.profileAvatarWrap}>
            <View style={styles.profileAvatar}>
              {teacher.profileImage ? (
                <Image
                  source={{ uri: teacher.profileImage }}
                  style={styles.profileAvatarImg}
                />
              ) : teacher.isLoading ? (
                <ActivityIndicator size="small" color={Colors.primary} />
              ) : (
                <User size={40} color={Colors.primary} />
              )}
            </View>
            {displayRating && (
              <View style={styles.ratingBadge}>
                <Star size={10} color="#f59e0b" fill="#f59e0b" />
                <Text style={styles.ratingText}>{displayRating}</Text>
              </View>
            )}
          </View>

          <Text style={styles.teacherName}>{teacher.name || "—"}</Text>
          <Text style={styles.teacherSubject}>{teacher.subject || "معلم"}</Text>

          <View style={styles.statsRow}>
            <StatItem label="طلاب" value={teacher.studentsCount || "—"} />
            <StatItem label="مجموعات" value={teacher.groupsCount || "—"} />
            <StatItem label="تقييمات" value={teacher.reviewsCount || "—"} />
          </View>
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <MenuRow key={item.id} item={item} />
          ))}
        </View>

        <View style={styles.listFooter} />
      </ScrollView>

      <AccountSheet
        visible={accountSheetVisible}
        onClose={closeAccountSheet}
        onEdit={handleEdit}
        data={{
          nameAr: teacher.name,
          nameEn: teacher.nameEn,
          teacherId: teacher.teacherId,
          phone: teacher.phone,
          email: teacher.email,
          country: teacher.country,
          joinDate: teacher.joinDate,
          workType: teacher.workType,
          bio: teacher.bio,
        }}
      />

      <EditProfileSheet
        visible={editSheetVisible}
        onClose={() => setEditSheetVisible(false)}
        data={{
          name: teacher.name,
          nameEn: teacher.nameEn,
          email: teacher.email,
          country: teacher.country,
          bio: teacher.bio,
          workType: teacher.workType,
          profileImage: teacher.profileImage,
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  settingsBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  profileCard: {
    backgroundColor: "#DDE8EE",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    padding: 24,
    alignItems: "center",
  },
  statusBadge: {
    alignSelf: "flex-end",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 8,
  },
  statusBadgeActive: { backgroundColor: "#dcfce7" },
  statusBadgeInactive: { backgroundColor: "#f3f4f6" },
  statusBadgeText: { fontSize: 11, fontFamily: "Alex_600" },
  statusBadgeTextActive: { color: "#16a34a" },
  statusBadgeTextInactive: { color: "#6b7280" },
  profileAvatarWrap: { position: "relative", marginBottom: 12 },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  profileAvatarImg: { width: 80, height: 80, borderRadius: 40 },
  ratingBadge: {
    position: "absolute",
    bottom: 0,
    right: -4,
    backgroundColor: Colors.surface,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  ratingText: {
    fontSize: 11,
    fontFamily: "Alex_600",
    color: Colors.textPrimary,
  },
  teacherName: {
    fontSize: 20,
    fontFamily: "Alex_700",
    color: "#0C2D40",
    textAlign: "center",
  },
  teacherSubject: {
    fontSize: 14,
    fontFamily: "Alex_400",
    color: Colors.textSecondary,
    marginTop: 4,
    marginBottom: 16,
    textAlign: "center",
  },
  statsRow: {
    flexDirection: "row-reverse",
    paddingTop: 16,
    width: "100%",
  },
  statItem: { flex: 1, alignItems: "center" },
  statValue: { fontSize: 18, fontFamily: "Alex_700", color: "#0C2D40" },
  statLabel: {
    fontSize: 12,
    fontFamily: "Alex_400",
    color: Colors.textSecondary,
    marginTop: 2,
  },
  menuContainer: {
    marginHorizontal: 16,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    overflow: "hidden",
    borderColor: "#D9D9D9",
    borderWidth: 1,
    marginVertical: 40,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Alex_500",
    color: Colors.textPrimary,
    textAlign: "right",
    marginHorizontal: 12,
    writingDirection: "rtl",
  },
  menuLabelDestructive: { color: Colors.error },
  menuIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  listFooter: { height: 120 },
});
