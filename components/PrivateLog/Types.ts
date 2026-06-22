import { BookOpen, CheckCircle, Clock, XCircle } from "lucide-react-native";
import React from "react";
import { Colors } from "@/constants/colors";

export type SessionStatus = "pending" | "approved" | "completed" | "cancelled";

export type LogSession = {
  id: string;
  student: string;
  subject: string;
  date: string;
  time: string;
  status: SessionStatus;
  price: string;
  rating?: number;
};

export const STATUS_CONFIG: Record<
  SessionStatus,
  {
    label: string;
    color: string;
    bg: string;
    icon: React.ComponentType<{ size: number; color: string }>;
  }
> = {
  pending: { label: "معلقة", color: Colors.warning, bg: Colors.warningBg, icon: Clock },
  approved: { label: "مؤكدة", color: Colors.info, bg: Colors.infoBg, icon: CheckCircle },
  completed: { label: "مكتملة", color: Colors.success, bg: Colors.successBg, icon: BookOpen },
  cancelled: { label: "ملغاة", color: Colors.error, bg: Colors.errorBg, icon: XCircle },
};

export const FILTER_TABS: { id: SessionStatus | "all"; label: string }[] = [
  { id: "all", label: "الكل" },
  { id: "approved", label: "مؤكدة" },
  { id: "cancelled", label: "ملغاة" },
];
