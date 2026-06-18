import React from "react";
import type { PrivateSessionBooking } from "@/store/private";

export type StatItem = {
  label: string;
  value: string;
  unit: string;
  color: string;
  icon: React.ComponentType<{ size: number; color: string }>;
};

export type { PrivateSessionBooking };

export type PendingRequest = PrivateSessionBooking;

export type UpcomingSession = {
  id: string;
  student: string;
  subject: string;
  date: string;
  time: string;
  isToday: boolean;
};
