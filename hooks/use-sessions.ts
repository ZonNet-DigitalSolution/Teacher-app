import { fetchDaySessions, fetchWeekSessions } from "@/store/sessions";
import type { ScheduleView } from "@/types/schedule.types";
import { generateDays, mapSession } from "@/utils/schedule";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "./store-hooks";

const TODAY_INDEX = 6; // always the centre of the 13-day window

export function useSessions() {
  const dispatch = useAppDispatch();
  const { sessions, daySessions, isLoading, error } = useAppSelector(
    (s) => s.sessions,
  );

  const days = useMemo(() => generateDays(), []);
  const [activeIndex, setActiveIndex] = useState(TODAY_INDEX);
  const [view, setView] = useState<ScheduleView>("daily");

  const selectedDate = days[activeIndex]?.date;

  useEffect(() => {
    dispatch(fetchWeekSessions());
  }, [dispatch]);

  useEffect(() => {
    if (selectedDate && !daySessions[selectedDate]) {
      dispatch(fetchDaySessions(selectedDate));
    }
  }, [selectedDate, daySessions, dispatch]);

  const handleDayPress = useCallback(
    (index: number) => setActiveIndex(index),
    [],
  );
  const handleViewChange = useCallback((v: ScheduleView) => setView(v), []);

  const activeSessions = useMemo(
    () => (daySessions[selectedDate] ?? []).map(mapSession),
    [daySessions, selectedDate],
  );

  const weeklySessions = useMemo(
    () => sessions.map(mapSession),
    [sessions],
  );

  return {
    days,
    activeSessions,
    weeklySessions,
    activeIndex,
    view,
    isLoading,
    error,
    handleDayPress,
    handleViewChange,
  };
}
