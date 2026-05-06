import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  ArrowIcon,
  EllipseIcon,
  EraserIcon,
  PenIcon,
  RedoIcon,
  SquareIcon,
  TextIcon,
  TrashIcon,
  UndoIcon,
} from "./RoomIcons";

const WB_COLORS = ["#FF5C5C", "#E89B32", "#27C840", "#5BBFCE", "#8180BD", "#222222"];

const WB_TOOLS = [
  { id: "ellipse", icon: <EllipseIcon /> },
  { id: "arrow", icon: <ArrowIcon /> },
  { id: "square", icon: <SquareIcon /> },
  { id: "eraser", icon: <EraserIcon /> },
  { id: "text", icon: <TextIcon /> },
  { id: "pen", icon: <PenIcon /> },
];

export function WhiteboardView() {
  const [activeColor, setActiveColor] = useState("#222222");
  const [activeTool, setActiveTool] = useState("pen");
  return (
    <View style={wb.container}>
      <View style={wb.toolbar}>
        <TouchableOpacity style={wb.toolBtn}>
          <TrashIcon />
        </TouchableOpacity>
        <View style={wb.sep} />
        <TouchableOpacity style={wb.toolBtn}>
          <UndoIcon />
        </TouchableOpacity>
        <TouchableOpacity style={wb.toolBtn}>
          <RedoIcon />
        </TouchableOpacity>
        <View style={wb.sep} />
        {WB_COLORS.map((c) => (
          <TouchableOpacity
            key={c}
            onPress={() => setActiveColor(c)}
            style={[wb.colorDot, { backgroundColor: c }, activeColor === c && wb.colorActive]}
          />
        ))}
        <View style={wb.sep} />
        {WB_TOOLS.map((t) => (
          <TouchableOpacity
            key={t.id}
            onPress={() => setActiveTool(t.id)}
            style={[wb.toolBtn, activeTool === t.id && wb.toolActive]}
          >
            {t.icon}
          </TouchableOpacity>
        ))}
      </View>
      <View style={wb.canvas}>
        <Text style={wb.hint}>منطقة السبورة التفاعلية</Text>
      </View>
    </View>
  );
}

const wb = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", borderRadius: 14, overflow: "hidden" },
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 6,
    flexWrap: "wrap",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  toolBtn: { padding: 5, borderRadius: 6 },
  toolActive: { backgroundColor: "#FEF3E2" },
  sep: { width: 1, height: 22, backgroundColor: "#DDD", marginHorizontal: 2 },
  colorDot: { width: 18, height: 18, borderRadius: 9 },
  colorActive: { borderWidth: 2.5, borderColor: "#333" },
  canvas: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#FAFAFA" },
  hint: { fontFamily: "Alex_400", fontSize: 14, color: "#CCC" },
});
