import Coins from "@/assets/svg/coins.svg";
import { Colors } from "@/constants/colors";
import { X } from "lucide-react-native";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const INTERACTION_TOOLS = [
  { id: "clap", label: "تصفيق", emoji: "👏" },
  { id: "cheer", label: "تشجيع", emoji: "⭐" },
  { id: "hand", label: "رفع اليد", emoji: "✋" },
  { id: "support", label: "دعم", emoji: "🤝" },
  { id: "calm", label: "هدوء", emoji: "😯" },
  { id: "hint", label: "تلميح", emoji: "💡" },
  { id: "break", label: "استراحة", emoji: "☕" },
  { id: "timer", label: "عداد 30 ث", emoji: "⏱️" },
];

const REWARDS = [
  { id: "10pts", label: "+10 نقاط للجميع !", emoji: "🪙" },
  { id: "20pts", label: "+20 نقطة تميز !", emoji: "🪙" },
];

const NON_SCROLL_H = 55; // header(50) + divider(5)

export function ToolsPanel({
  onClose,
  maxHeight,
}: {
  onClose: () => void;
  maxHeight: number;
}) {
  const scrollMaxH = maxHeight - NON_SCROLL_H;
  const [activeTools, setActiveTools] = useState<string[]>(["clap"]);
  const [muteMic, setMuteMic] = useState(true);
  const [muteChat, setMuteChat] = useState(false);

  function toggleTool(id: string) {
    setActiveTools((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );
  }

  return (
    <View style={tp.panel}>
      {/* Header */}
      <View style={tp.header}>
        <TouchableOpacity onPress={onClose} style={tp.closeBtn}>
          <X size={20} color="#111" />
        </TouchableOpacity>
        <Text style={tp.title}>ادوات المعلم</Text>
      </View>
      <View style={tp.divider} />

      <ScrollView
        style={{ maxHeight: scrollMaxH }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tp.scrollContent}
      >
        {/* Section: Interaction Tools */}
        <Text style={tp.sectionTitle}>ادوات التفاعل</Text>
        <View style={tp.toolsGrid}>
          {INTERACTION_TOOLS.map((tool) => {
            const isActive = activeTools.includes(tool.id);
            return (
              <TouchableOpacity
                key={tool.id}
                style={[tp.toolBtn, isActive && tp.toolBtnActive]}
                onPress={() => toggleTool(tool.id)}
                activeOpacity={0.8}
              >
                <Text style={[tp.toolLabel, isActive && tp.toolLabelActive]}>
                  {tool.label} {tool.emoji}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Section: Rewards */}
        <Text style={tp.sectionTitle}>المكافآت</Text>
        <View style={tp.rewardsCol}>
          {REWARDS.map((r) => (
            <TouchableOpacity
              key={r.id}
              style={tp.rewardBtn}
              activeOpacity={0.8}
            >
              <Coins />
              <Text style={tp.rewardLabel}>{r.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Section: Settings */}
        <Text style={tp.sectionTitle}>اعدادات</Text>
        <View style={tp.settingsCol}>
          <View style={tp.settingRow}>
            <Switch
              value={muteMic}
              onValueChange={setMuteMic}
              trackColor={{ false: "#CCC", true: Colors.primary }}
              thumbColor="#fff"
            />
            <Text style={tp.settingLabel}>كتم الصوت للجميع</Text>
          </View>
          <View style={tp.settingRow}>
            <Switch
              value={muteChat}
              onValueChange={setMuteChat}
              trackColor={{ false: "#CCC", true: Colors.primary }}
              thumbColor="#fff"
            />
            <Text style={tp.settingLabel}>اغلاق الدردشة للجميع</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const tp = StyleSheet.create({
  panel: { backgroundColor: "#fff" },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 24, gap: 12 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  closeBtn: { padding: 4 },
  title: { fontFamily: "Alex_700", fontSize: 18, color: "#1B3A4B" },
  divider: { height: 1, backgroundColor: "#E8E8E8", marginBottom: 4 },

  sectionTitle: {
    fontFamily: "Alex_600",
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: "right",
    marginTop: 8,
  },

  // Interaction grid
  toolsGrid: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  toolBtn: {
    borderWidth: 1,
    width: "30%",
    borderColor: Colors.borderLight,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: "center",
  },
  toolBtnActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  toolLabel: {
    fontFamily: "Alex_500",
    fontSize: 13,
    color: Colors.textPrimary,
  },
  toolLabelActive: {
    color: Colors.primary,
    // fontFamily: "Alex_700",
  },

  // Rewards
  rewardsCol: { gap: 10 },
  rewardBtn: {
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    flexDirection: "row-reverse",
  },
  rewardLabel: {
    fontFamily: "Alex_600",
    fontSize: 14,
    color: Colors.textPrimary,
  },

  // Settings
  settingsCol: { gap: 2 },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  settingLabel: {
    fontFamily: "Alex_500",
    fontSize: 14,
    color: Colors.textPrimary,
    textAlign: "right",
    flex: 1,
    paddingRight: 8,
  },
});
