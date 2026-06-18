import { DailyView } from "@/components/Schedule/DailyView";
import { HomeHeader } from "@/components/Schedule/HomeHeader";
import { SectionHeader } from "@/components/Schedule/SectionHeader";
import { WeeklyView } from "@/components/Schedule/WeeklyView";
import { Colors } from "@/constants/colors";
import { useSessions } from "@/hooks/use-sessions";
import { AppDispatch, RootState } from "@/store";
import { fetchProfile } from "@/store/teacher";
import { useRouter } from "expo-router";
import { GraduationCap } from "lucide-react-native";
import React, { useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

export default function ScheduleScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const teacherName = useSelector(
    (state: RootState) => state.teacher.name || state.auth?.user?.name,
  );
  const {
    days,
    activeSessions,
    weeklySessions,
    activeIndex,
    view,
    isLoading,
    error,
    handleDayPress,
    handleViewChange,
  } = useSessions();

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <HomeHeader name={teacherName || "المعلم"} />

        {/* Private session requests banner */}
        <TouchableOpacity
          style={styles.privateBanner}
          activeOpacity={0.8}
          onPress={() => router.push("/(tabs)/private")}
        >
          <View style={styles.privateBannerIcon}>
            <GraduationCap size={22} color={Colors.primary} />
          </View>
          <View style={styles.privateBannerText}>
            <Text style={styles.privateBannerTitle}>طلبات الحصص الفردية</Text>
            <Text style={styles.privateBannerSub}>اعرض وأدِر طلبات الطلاب</Text>
          </View>
          <Text style={styles.privateBannerArrow}>‹</Text>
        </TouchableOpacity>

        <SectionHeader scheduleView={view} onToggleView={handleViewChange} />

        {view === "daily" ? (
          <DailyView
            days={days}
            activeIndex={activeIndex}
            sessions={activeSessions}
            onDayPress={handleDayPress}
            isLoading={isLoading}
            error={error}
          />
        ) : (
          <WeeklyView days={days} lessons={weeklySessions} />
        )}

        <View style={styles.listFooter} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
  scroll: { flex: 1, width: "100%" },
  listFooter: { height: 90 },
  privateBanner: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: Colors.primaryLight,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: "#F0D9B0",
  },
  privateBannerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  privateBannerText: { flex: 1, alignItems: "flex-end" },
  privateBannerTitle: {
    fontSize: 14,
    fontFamily: "Alex_600",
    color: Colors.textPrimary,
  },
  privateBannerSub: {
    fontSize: 12,
    fontFamily: "Alex_400",
    color: Colors.textSecondary,
    marginTop: 2,
  },
  privateBannerArrow: {
    fontSize: 20,
    color: Colors.primary,
    transform: [{ rotate: "180deg" }],
  },
});
