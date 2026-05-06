import { type ScheduleView, VIEW_OPTIONS } from "@/types/schedule.types";
import { ChevronDown, ChevronUp } from "lucide-react-native";
import React, { memo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  scheduleView: ScheduleView;
  onToggleView: (v: ScheduleView) => void;
};

export const SectionHeader = memo(function SectionHeader({
  scheduleView,
  onToggleView,
}: Props) {
  const [open, setOpen] = useState(false);
  const selectedLabel =
    VIEW_OPTIONS.find((o) => o.value === scheduleView)?.label ?? "";

  return (
    <View style={styles.container}>
      <View>
        <TouchableOpacity
          style={styles.pill}
          onPress={() => setOpen((v) => !v)}
          activeOpacity={0.7}
        >
          {open ? (
            <ChevronUp size={12} color="#444" style={{ marginLeft: 4 }} />
          ) : (
            <ChevronDown size={12} color="#444" style={{ marginLeft: 4 }} />
          )}
          <Text style={styles.pillText}>{selectedLabel}</Text>
        </TouchableOpacity>

        {open && (
          <View style={styles.menu}>
            {VIEW_OPTIONS.map((opt, i) => (
              <TouchableOpacity
                key={opt.value}
                style={[
                  styles.menuItem,
                  opt.value === scheduleView && styles.menuItemActive,
                  i < VIEW_OPTIONS.length - 1 && styles.menuItemBorder,
                ]}
                onPress={() => {
                  setOpen(false);
                  onToggleView(opt.value as ScheduleView);
                }}
                activeOpacity={0.7}
              >
                {opt.value === scheduleView && (
                  <View style={styles.activeDot} />
                )}
                <Text
                  style={[
                    styles.menuText,
                    opt.value === scheduleView && styles.menuTextActive,
                  ]}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <View>
        <Text style={styles.title}>الجدول الدراسي</Text>
        <View style={styles.underline} />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    backgroundColor: "#fff",
  },
  title: {
    fontFamily: "Alex_700",
    fontSize: 14,
    color: "#111",
    textAlign: "right",
  },
  underline: {
    height: 3,
    backgroundColor: "#8180BD",
    borderRadius: 2,
    marginTop: 3,
    opacity: 0.7,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E6D6BB",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 4,
  },
  pillText: {
    fontFamily: "Alex_400",
    fontSize: 13,
    color: "#444",
  },
  menu: {
    position: "absolute",
    top: "100%",
    left: 0,
    backgroundColor: "#fff",
    borderRadius: 14,
    minWidth: 160,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
    overflow: "hidden",
    marginTop: 6,
    zIndex: 100,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  menuItemActive: {
    backgroundColor: "#FEF3E2",
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E89B32",
  },
  menuText: {
    fontFamily: "Alex_400",
    fontSize: 14,
    color: "#444",

    textAlign: "right",
  },
  menuTextActive: {
    fontFamily: "Alex_700",
    color: "#E89B32",
  },
});
