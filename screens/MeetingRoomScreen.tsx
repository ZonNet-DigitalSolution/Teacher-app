import { ChatPanel } from "@/components/MeetingRoom/ChatPanel";
import { EndModal } from "@/components/MeetingRoom/EndModal";
import { GamesPanel } from "@/components/MeetingRoom/GamesPanel";
import { OthersPanel } from "@/components/MeetingRoom/OthersPanel";
import {
  BackIcon,
  BoardIcon,
  CameraIcon,
  ChatIcon,
  DotsIcon,
  EndIcon,
  GameIcon,
  MicIcon,
  ShareIcon,
  StudentsIcon,
  ToolsIcon,
} from "@/components/MeetingRoom/RoomIcons";
import {
  MOCK_STUDENTS,
  StudentsPanel,
} from "@/components/MeetingRoom/StudentsPanel";
import { ToolsPanel } from "@/components/MeetingRoom/ToolsPanel";
import { WhiteboardView } from "@/components/MeetingRoom/WhiteboardView";
import { Colors } from "@/constants/colors";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { height } = Dimensions.get("window");
const PANEL_MAX = height - 45; // sheet maxHeight(h-20) minus handle(25)

type PanelType = "none" | "students" | "chat" | "games" | "tools" | "others";

export function MeetingRoomScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    subject?: string;
    date?: string;
    time?: string;
  }>();

  const subject = params.subject ?? "الحصة";
  const date = params.date ?? "—";
  const time = params.time ?? "—";

  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [boardOpen, setBoardOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<PanelType>("none");
  const [endModal, setEndModal] = useState(false);

  const togglePanel = (name: PanelType) =>
    setActivePanel((prev) => (prev === name ? "none" : name));

  const CONTROLS = [
    {
      label: "شارك الشاشة",
      key: "share",
      icon: <ShareIcon />,
      onPress: () => {},
    },
    {
      label: "السبورة",
      key: "board",
      icon: <BoardIcon active={boardOpen} />,
      onPress: () => {
        setBoardOpen((v) => !v);
        setActivePanel("none");
      },
    },
    {
      label: "مايك",
      key: "mic",
      icon: <MicIcon on={micOn} />,
      onPress: () => setMicOn((v) => !v),
    },
    {
      label: "كاميرا",
      key: "camera",
      icon: <CameraIcon on={cameraOn} />,
      onPress: () => setCameraOn((v) => !v),
    },
  ];

  const TOOLS: {
    label: string;
    key: PanelType;
    icon: (a: boolean) => React.ReactNode;
  }[] = [
    {
      label: "الطلاب",
      key: "students",
      icon: (a) => <StudentsIcon active={a} />,
    },
    {
      label: "ادوات المعلم",
      key: "tools",
      icon: (a) => <ToolsIcon active={a} />,
    },
    { label: "دردشة", key: "chat", icon: (a) => <ChatIcon active={a} /> },
    { label: "العاب", key: "games", icon: (a) => <GameIcon active={a} /> },
    { label: "أخرى", key: "others", icon: (a) => <DotsIcon active={a} /> },
  ];

  return (
    <SafeAreaView style={s.safe}>
      {/* <StatusBar barStyle="dark-content" backgroundColor="#fff" /> */}

      {/* Top bar */}
      <View style={s.topBar}>
        <View style={s.topLeft}>
          <TouchableOpacity
            style={s.endBtn}
            onPress={() => setEndModal(true)}
            activeOpacity={0.85}
          >
            <Text style={s.endTxt}>إنهاء الجلسة</Text>
            <EndIcon />
          </TouchableOpacity>
        </View>

        <View style={s.topRight}>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={s.subjectTxt}>{subject}</Text>
            <Text style={s.dateTxt}>
              {date} | {time}
            </Text>
          </View>
          <TouchableOpacity
            style={s.backBtn}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <BackIcon />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <View style={s.content}>
        <View style={s.mainRow}>
          <View style={s.videoCol}>
            {boardOpen ? (
              <WhiteboardView />
            ) : (
              <View style={s.videoWrap}>
                <View style={s.videoPlaceholder}>
                  <CameraIcon on={cameraOn} />
                </View>
                <View style={s.liveBadge}>
                  <Text style={s.liveTxt}>بث مباشر</Text>
                  <View style={s.liveDot} />
                </View>
                <View style={s.teacherBadge}>
                  <Text style={s.teacherTxt}>المعلم</Text>
                </View>
              </View>
            )}

            <View style={s.controlsBar}>
              {CONTROLS.map((c, i) => (
                <React.Fragment key={c.key}>
                  <TouchableOpacity
                    style={s.ctrlBtn}
                    onPress={c.onPress}
                    activeOpacity={0.75}
                  >
                    {c.icon}
                    <Text
                      style={[
                        s.ctrlLbl,
                        c.key === "board" && boardOpen && { color: "#E89B32" },
                      ]}
                    >
                      {c.label}
                    </Text>
                  </TouchableOpacity>
                  {i < CONTROLS.length - 1 && <View style={s.ctrlDiv} />}
                </React.Fragment>
              ))}
            </View>
          </View>
        </View>
      </View>

      {/* Bottom Sheet */}
      <Modal
        visible={activePanel !== "none"}
        transparent
        animationType="slide"
        onRequestClose={() => setActivePanel("none")}
      >
        <View style={s.sheetOverlay}>
          <TouchableOpacity
            style={s.sheetDismiss}
            onPress={() => setActivePanel("none")}
            activeOpacity={1}
          />
          <View
            style={[
              s.sheetContainer,
              activePanel === "games" ||
              activePanel === "chat" ||
              activePanel === "others"
                ? { height: height - 20 }
                : { maxHeight: height - 20 },
            ]}
          >
            <View style={s.sheetHandle} />
            <View
              style={[
                s.sheetContent,
                (activePanel === "games" ||
                  activePanel === "chat" ||
                  activePanel === "others") && { flex: 1 },
              ]}
            >
              {activePanel === "students" && (
                <StudentsPanel
                  maxHeight={PANEL_MAX}
                  onClose={() => setActivePanel("none")}
                />
              )}
              {activePanel === "chat" && (
                <ChatPanel onClose={() => setActivePanel("none")} />
              )}
              {activePanel === "games" && (
                <GamesPanel onClose={() => setActivePanel("none")} />
              )}
              {activePanel === "tools" && (
                <ToolsPanel
                  maxHeight={PANEL_MAX}
                  onClose={() => setActivePanel("none")}
                />
              )}
              {activePanel === "others" && (
                <OthersPanel onClose={() => setActivePanel("none")} />
              )}
            </View>
          </View>
        </View>
      </Modal>

      {/* Bottom toolbar */}
      <View style={s.bottomBar}>
        <View style={s.bottomTools}>
          {TOOLS.map((t) => {
            const isActive = activePanel === t.key;
            return (
              <TouchableOpacity
                key={t.key}
                style={s.toolBtn}
                onPress={() => {
                  setBoardOpen(false);
                  togglePanel(t.key);
                }}
                activeOpacity={0.75}
              >
                <View style={[s.toolIconWrap, isActive && s.toolIconActive]}>
                  {t.icon(isActive)}
                </View>
                <Text style={[s.toolLbl, isActive && { color: "#E89B32" }]}>
                  {t.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={s.bottomDiv} />
        <TouchableOpacity
          style={s.participantsWrap}
          onPress={() => togglePanel("students")}
          activeOpacity={0.8}
        >
          <View style={s.avatarStack}>
            {MOCK_STUDENTS.slice(0, 3).map((p, i) => (
              <View key={p.id} style={[s.stackAvatar, { right: i * 20 }]}>
                <Text style={s.stackAvatarText}>{p.name[0]}</Text>
              </View>
            ))}
          </View>
          <Text style={s.participantCount}>
            {String(MOCK_STUDENTS.length).padStart(2, "0")}
          </Text>
        </TouchableOpacity>
      </View>

      <EndModal
        visible={endModal}
        onClose={() => setEndModal(false)}
        onConfirm={() => {
          setEndModal(false);
          router.back();
        }}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F6F6F6" },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  topLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderWidth: 2,
    borderColor: "#E89B32",
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  backTxt: { fontFamily: "Alex_400", fontSize: 13, color: "#E89B32" },
  endBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#BE0B0B",
    borderRadius: 50,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  endTxt: { fontFamily: "Alex_700", fontSize: 13, color: "#fff" },
  topRight: { flexDirection: "row", alignItems: "center", gap: 10 },
  subjectTxt: { fontFamily: "Alex_700", fontSize: 14, color: "#000" },
  dateTxt: { fontFamily: "Alex_400", fontSize: 11, color: "#4B4A4B" },
  content: { flex: 1 },
  mainRow: { flex: 1, flexDirection: "row", padding: 12, gap: 10 },
  videoCol: { flex: 1, gap: 10 },
  videoWrap: {
    flex: 1,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#222",
  },
  videoPlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1a1a2e",
  },
  liveBadge: {
    position: "absolute",
    top: 14,
    left: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#BE0B0B",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: "#fff" },
  liveTxt: { fontFamily: "Alex_700", fontSize: 12, color: "#fff" },
  teacherBadge: {
    position: "absolute",
    bottom: 14,
    right: 14,
    backgroundColor: "rgba(0,0,0,0.45)",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  teacherTxt: { fontFamily: "Alex_400", fontSize: 13, color: "#fff" },
  controlsBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#E8E8E8",
    borderColor: "#4C464D24",
    borderWidth: 2,
    borderRadius: 50,
    paddingVertical: 12,
  },
  ctrlBtn: { alignItems: "center", gap: 5, flex: 1 },
  ctrlLbl: { fontFamily: "Alex_400", fontSize: 11, color: "#333" },
  ctrlDiv: { width: 1, height: 32, backgroundColor: "#F0F0F0" },
  sheetOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheetDismiss: { flex: 1 },
  sheetContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
  },
  sheetHandle: {
    width: 40,
    height: 5,
    backgroundColor: "#DDD",
    borderRadius: 3,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 8,
  },
  sheetContent: {},
  bottomBar: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
  },
  bottomTools: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  toolBtn: { alignItems: "center", gap: 3 },
  toolIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#FEF3E2",
    alignItems: "center",
    justifyContent: "center",
  },
  toolIconActive: { backgroundColor: "#E89B32" },
  toolLbl: { fontFamily: "Alex_400", fontSize: 10, color: "#444" },
  bottomDiv: {
    width: 1,
    height: 50,
    backgroundColor: "#1A1A1A",
    marginHorizontal: 8,
  },
  participantsWrap: { alignItems: "center", gap: 4, paddingHorizontal: 6 },
  participantCount: { fontFamily: "Alex_700", fontSize: 16, color: "#1B3A4B" },
  avatarStack: { width: 60, height: 30, position: "relative" },
  stackAvatar: {
    position: "absolute",
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#fff",
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    top: 0,
  },
  stackAvatarText: {
    fontFamily: "Alex_700",
    fontSize: 11,
    color: Colors.primary,
  },
});
