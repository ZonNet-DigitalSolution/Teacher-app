import { Colors } from "@/constants/colors";
import MoonIcon from "@/assets/times/moon.svg";
import MorningIcon from "@/assets/times/morning.svg";
import SunIcon from "@/assets/times/sun.svg";
import React from "react";
import { DayKey, Schedule } from "./Types";

export const DAYS: { key: DayKey; label: string; short: string }[] = [
  { key: "sat", label: "السبت", short: "سبت" },
  { key: "sun", label: "الأحد", short: "أحد" },
  { key: "mon", label: "الاثنين", short: "اثنين" },
  { key: "tue", label: "الثلاثاء", short: "ثلاثاء" },
  { key: "wed", label: "الأربعاء", short: "أربعاء" },
  { key: "thu", label: "الخميس", short: "خميس" },
  { key: "fri", label: "الجمعة", short: "جمعة" },
];

export const TIME_GROUPS: {
  key: string;
  label: string;
  timeRange: string;
  icon: React.ComponentType<{ width?: number; height?: number }>;
  color: string;
  slots: string[];
}[] = [
  {
    key: "morning",
    label: "صباحاً",
    timeRange: "8 ص ـ 12م",
    icon: MorningIcon,
    color: Colors.primary,
    slots: [
      "08:00",
      "08:30",
      "09:00",
      "09:30",
      "10:00",
      "10:30",
      "11:00",
      "11:30",
    ],
  },
  {
    key: "midday",
    label: "ظهراً",
    timeRange: "12م ـ 4م",
    icon: SunIcon,
    color: Colors.warning,
    slots: [
      "12:00",
      "12:30",
      "13:00",
      "13:30",
      "14:00",
      "14:30",
      "15:00",
      "15:30",
    ],
  },
  {
    key: "evening",
    label: "مساءً",
    timeRange: "4م ـ 10م",
    icon: MoonIcon,
    color: Colors.purple,
    slots: [
      "16:00",
      "16:30",
      "17:00",
      "17:30",
      "18:00",
      "18:30",
      "19:00",
      "19:30",
      "20:00",
    ],
  },
];

export const ALL_SLOTS = TIME_GROUPS.flatMap((g) => g.slots);

export const INITIAL_SCHEDULE: Schedule = {
  sun: {
    "09:00": "available",
    "09:30": "available",
    "10:00": "booked",
    "10:30": "available",
    "14:00": "available",
    "14:30": "available",
  },
  mon: { "11:00": "available", "11:30": "booked", "16:00": "available" },
  wed: { "09:00": "available", "09:30": "available", "10:00": "available" },
  thu: { "14:00": "booked", "14:30": "available", "15:00": "available" },
};
