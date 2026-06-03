import { DailyView } from "@/components/Schedule/DailyView";
import { HomeHeader } from "@/components/Schedule/HomeHeader";
import { SectionHeader } from "@/components/Schedule/SectionHeader";
import { WeeklyView } from "@/components/Schedule/WeeklyView";
import { useSessions } from "@/hooks/use-sessions";
import { AppDispatch, RootState } from "@/store";
import { fetchProfile } from "@/store/teacher";
import React, { useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
export default function ScheduleScreen() {
  const dispatch = useDispatch<AppDispatch>();
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
});
