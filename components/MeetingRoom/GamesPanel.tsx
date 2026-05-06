import Controller from "@/assets/svg/controller.svg";
import Think from "@/assets/svg/think.svg";
import { Colors } from "@/constants/colors";
import { X } from "lucide-react-native";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GameGrid } from "./games/GameGrid";
import { GameSettings } from "./games/GameSettings";
import { QuestionForm } from "./games/QuestionForm";
import { GAMES } from "./games/data";
import { MainTab, SubTab } from "./games/types";

// ── Sub-tab bar (underline style) ─────────────────────────────────────────────
function SubTabBar({
  active,
  onChange,
}: {
  active: SubTab;
  onChange: (t: SubTab) => void;
}) {
  const tabs: { id: SubTab; label: string }[] = [
    { id: "ai", label: "انشاء بالذكاء الاصطناعي" },
    { id: "preset", label: "اسئلة مجهزة مسبقاً" },
  ];
  return (
    <View style={gp.subTabs}>
      {tabs.map((t) => (
        <TouchableOpacity
          key={t.id}
          style={[gp.subTab, active === t.id && gp.subTabActive]}
          onPress={() => onChange(t.id)}
          activeOpacity={0.8}
        >
          <Text style={[gp.subTabText, active === t.id && gp.subTabTextActive]}>
            {t.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ── Games tab content ─────────────────────────────────────────────────────────
function GamesTabContent() {
  const [subTab, setSubTab] = useState<SubTab>("ai");
  const [selectedGameId, setSelectedGameId] = useState(GAMES[1].id); // طابق الكلمات default

  const selectedGame = GAMES.find((g) => g.id === selectedGameId) ?? GAMES[0];

  return (
    <>
      <View style={gp.sectionHeading}>
        <Controller width={24} height={24} />
        <Text style={gp.sectionTitle}>العاب</Text>
      </View>

      <SubTabBar active={subTab} onChange={setSubTab} />

      <GameGrid
        games={GAMES}
        selectedId={selectedGameId}
        onSelect={(id) => setSelectedGameId(id as typeof selectedGameId)}
      />

      <View style={gp.sectionDivider} />

      <GameSettings game={selectedGame} />
    </>
  );
}

// ── Quick question tab content ────────────────────────────────────────────────
function QuickTabContent() {
  return (
    <>
      <View style={gp.sectionHeading}>
        <Think width={24} height={24} />
        <Text style={gp.sectionTitle}>سؤال سريع</Text>
      </View>
      <QuestionForm
        questionLabel="نص السؤال"
        addNewLabel="+ سؤال جديد"
        placeholder="اكتب سؤالك هنا"
        showOptions
        cardWrapped={false}
      />
    </>
  );
}

// ── Main panel ────────────────────────────────────────────────────────────────
export function GamesPanel({ onClose }: { onClose: () => void }) {
  const [mainTab, setMainTab] = useState<MainTab>("games");

  return (
    <View style={gp.panel}>
      {/* Header */}
      <View style={gp.header}>
        <TouchableOpacity onPress={onClose} style={gp.closeBtn}>
          <X size={20} fontWeight={900} color="#555" />
        </TouchableOpacity>
        <Text style={gp.title}>العاب</Text>
      </View>
      <View style={gp.divider} />

      {/* Main tab bar */}
      <View style={gp.mainTabs}>
        {(["quick", "games"] as MainTab[]).map((t) => (
          <TouchableOpacity
            key={t}
            style={[gp.mainTab, mainTab === t && gp.mainTabActive]}
            onPress={() => setMainTab(t)}
            activeOpacity={0.8}
          >
            <Text
              style={[gp.mainTabText, mainTab === t && gp.mainTabTextActive]}
            >
              {t === "games" ? "العاب" : "سؤال سريع"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Scrollable content */}
      <ScrollView
        style={gp.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={gp.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {mainTab === "games" ? <GamesTabContent /> : <QuickTabContent />}
      </ScrollView>

      {/* Launch button */}
      <View style={gp.footer}>
        <TouchableOpacity style={gp.launchBtn} activeOpacity={0.85}>
          <Text style={gp.launchText}>
            {mainTab === "quick" ? "اطلاق السؤال للجميع" : "اطلاق اللعبة"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const gp = StyleSheet.create({
  panel: { flex: 1, backgroundColor: "#fff" },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 16, gap: 12 },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  closeBtn: { padding: 4 },
  title: { fontFamily: "Alex_700", fontSize: 18, color: "#1B3A4B" },
  divider: { height: 1, backgroundColor: "#E8E8E8" },

  // Main tabs
  mainTabs: {
    flexDirection: "row",
    marginHorizontal: "auto",
    marginVertical: 12,
    width: "70%",
    backgroundColor: Colors.primaryLight,
    borderRadius: 50,
  },
  mainTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 50,
  },
  mainTabActive: { backgroundColor: Colors.primary },
  mainTabText: {
    fontFamily: "Alex_500",
    fontSize: 13,
    color: Colors.textSecondary,
  },
  mainTabTextActive: { fontFamily: "Alex_700", color: "#fff" },

  // Section heading
  sectionHeading: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 6,
  },
  sectionTitle: { fontFamily: "Alex_700", fontSize: 17, color: "#1B3A4B" },

  // Sub tabs
  subTabs: {
    flexDirection: "row-reverse",
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    marginHorizontal: 20,
  },
  subTab: { flex: 1, alignItems: "center", paddingVertical: 10 },
  subTabActive: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
    marginBottom: -1,
  },
  subTabText: {
    fontFamily: "Alex_400",
    fontSize: 13,
    color: Colors.textSecondary,
  },
  subTabTextActive: { fontFamily: "Alex_700", color: Colors.primary },

  // Section divider
  sectionDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: 2,
  },

  // Footer
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  launchBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 50,
    paddingVertical: 14,
    alignItems: "center",
  },
  launchText: { fontFamily: "Alex_700", fontSize: 15, color: "#fff" },
});
