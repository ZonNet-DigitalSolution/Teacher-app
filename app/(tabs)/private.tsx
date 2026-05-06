import { ScreenHeader } from "@/components/Ui/screen-header";
import { Colors } from "@/constants/colors";
import { PrivateAvailability } from "@/screens/PrivateAvailability";
import { PrivateDashboard } from "@/screens/PrivateDashboard";
import { PrivateLog } from "@/screens/PrivateLog";
import { PrivateSettings } from "@/screens/PrivateSettings";
import { User } from "lucide-react-native";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type TabId = "dashboard" | "availability" | "log" | "settings";

const TABS: { id: TabId; label: string }[] = [
  { id: "dashboard", label: "الرئيسية" },
  { id: "availability", label: "الأوقات" },
  { id: "log", label: "السجل" },
  { id: "settings", label: "الإعدادات" },
];

export default function PrivateScreen() {
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScreenHeader title="الحصص الفردية" icon={User} />

      {/* Internal Tab Bar */}
      <View style={styles.tabBarWrap}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tabItem, isActive && styles.tabItemActive]}
              onPress={() => setActiveTab(tab.id)}
              activeOpacity={0.8}
            >
              <Text
                style={[styles.tabLabel, isActive && styles.tabLabelActive]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Screen Content */}
      <View style={styles.content}>
        {activeTab === "dashboard" && <PrivateDashboard />}
        {activeTab === "availability" && <PrivateAvailability />}
        {activeTab === "log" && <PrivateLog />}
        {activeTab === "settings" && <PrivateSettings />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  tabBarWrap: {
    flexDirection: "row-reverse",
    backgroundColor: Colors.surfaceAlt,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 50,
    borderColor: "#D9D9D9",
    borderWidth: 1,
    padding: 4,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 50,
  },
  tabItemActive: {
    backgroundColor: Colors.primary,
  },
  tabLabel: {
    fontSize: 14,
    fontFamily: "Alex_400",
    color: Colors.textSecondary,
  },
  tabLabelActive: {
    fontFamily: "Alex_600",
    color: "#fff",
  },
  content: { flex: 1 },
});
