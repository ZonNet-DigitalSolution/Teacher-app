import React from "react";

export type StatItem = {
  label: string;
  value: string;
  unit: string;
  color: string;
  icon: React.ComponentType<{ size: number; color: string }>;
};

export type PendingRequest = {
  id: string;
  student: string;
  subject: string;
  date: string;
  time: string;
  price: string;
};

export type UpcomingSession = {
  id: string;
  student: string;
  subject: string;
  date: string;
  time: string;
  isToday: boolean;
};
