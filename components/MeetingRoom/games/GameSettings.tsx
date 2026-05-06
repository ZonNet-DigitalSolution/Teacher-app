import { Colors } from "@/constants/colors";
import { ChevronDown } from "lucide-react-native";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { QuestionForm } from "./QuestionForm";
import { Game } from "./types";

// ── Reusable picker field ─────────────────────────────────────────────────────
interface PickerFieldProps {
  label: string;
  placeholder: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}

function PickerField({
  label,
  placeholder,
  options,
  value,
  onChange,
}: PickerFieldProps) {
  const [open, setOpen] = useState(false);
  return (
    <View style={gs.pickerWrap}>
      <Text style={gs.fieldLabel}>{label}</Text>
      <TouchableOpacity
        style={gs.picker}
        onPress={() => setOpen((v) => !v)}
        activeOpacity={0.8}
      >
        <ChevronDown size={18} color={Colors.textSecondary} />
        <Text style={[gs.pickerText, !value && gs.pickerPlaceholder]}>
          {value || placeholder}
        </Text>
      </TouchableOpacity>
      {open && (
        <View style={gs.dropdown}>
          {options.map((opt) => (
            <TouchableOpacity
              key={opt}
              style={[gs.dropdownItem, value === opt && gs.dropdownItemActive]}
              onPress={() => {
                onChange(opt);
                setOpen(false);
              }}
            >
              <Text
                style={[
                  gs.dropdownItemText,
                  value === opt && gs.dropdownItemTextActive,
                ]}
              >
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

// ── Match words settings ──────────────────────────────────────────────────────
function MatchSettings() {
  const [matchType, setMatchType] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [pairsCount, setPairsCount] = useState("");

  return (
    <View style={gs.settingsBlock}>
      <PickerField
        label="نوع المطابقة"
        placeholder="اختر نوع المطابقة"
        options={["كلمة ← صورة", "كلمة ← كلمة", "صورة ← صورة"]}
        value={matchType}
        onChange={setMatchType}
      />
      <PickerField
        label="مستوي الصعوبة"
        placeholder="حدد مستوي الصعوبة"
        options={["سهل", "متوسط", "صعب"]}
        value={difficulty}
        onChange={setDifficulty}
      />
      <PickerField
        label="عدد الازواج"
        placeholder="اختر عدد الازواج"
        options={["3", "4", "5", "6", "7", "8"]}
        value={pairsCount}
        onChange={setPairsCount}
      />
    </View>
  );
}

// ── Wheel settings ────────────────────────────────────────────────────────────
function WheelSettings() {
  const [items, setItems] = useState(["", "", ""]);

  function addItem() {
    if (items.length >= 8) return;
    setItems((p) => [...p, ""]);
  }

  function updateItem(i: number, val: string) {
    setItems((p) => p.map((v, idx) => (idx === i ? val : v)));
  }

  function removeItem(i: number) {
    if (items.length <= 2) return;
    setItems((p) => p.filter((_, idx) => idx !== i));
  }

  return (
    <View style={gs.settingsBlock}>
      <Text style={gs.fieldLabel}>عناصر العجلة</Text>
      {items.map((item, i) => (
        <View key={i} style={gs.wheelRow}>
          <TouchableOpacity onPress={() => removeItem(i)}>
            <Text style={gs.removeX}>×</Text>
          </TouchableOpacity>
          <TextInput
            style={gs.wheelInput}
            value={item}
            onChangeText={(t) => updateItem(i, t)}
            placeholder={`العنصر ${i + 1}`}
            textAlign="right"
            placeholderTextColor={Colors.textPlaceholder}
          />
          <View
            style={[
              gs.wheelDot,
              { backgroundColor: WHEEL_COLORS[i % WHEEL_COLORS.length] },
            ]}
          />
        </View>
      ))}
      {items.length < 8 && (
        <TouchableOpacity style={gs.addItemBtn} onPress={addItem}>
          <Text style={gs.addItemText}>+ اضافة عنصر</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const WHEEL_COLORS = [
  "#FF6B6B",
  "#FFA800",
  "#4CAF50",
  "#2196F3",
  "#9C27B0",
  "#FF5722",
  "#00BCD4",
  "#795548",
];

// ── True/False settings ───────────────────────────────────────────────────────
function TrueFalseSettings() {
  return (
    <QuestionForm
      questionLabel="نص العبارة"
      addNewLabel="+ عبارة جديدة"
      placeholder="اكتب العبارة هنا"
      showOptions={false}
      cardWrapped={false}
    />
  );
}

// ── Game settings dispatcher ──────────────────────────────────────────────────
interface GameSettingsProps {
  game: Game;
}

export function GameSettings({ game }: GameSettingsProps) {
  switch (game.settingsType) {
    case "match":
      return <MatchSettings />;
    case "wheel":
      return <WheelSettings />;
    case "truefalse":
      return <TrueFalseSettings />;
    case "question":
    default:
      return (
        <QuestionForm
          questionLabel="نص السؤال"
          addNewLabel="+ سؤال جديد"
          placeholder="اكتب سؤالك هنا"
          showOptions
          cardWrapped
        />
      );
  }
}

// ── Styles ────────────────────────────────────────────────────────────────────
const gs = StyleSheet.create({
  settingsBlock: { gap: 14 },

  fieldLabel: {
    fontFamily: "Alex_400",
    fontSize: 14,
    color: "#000000",
    textAlign: "right",
    marginBottom: 4,
  },

  // Picker
  pickerWrap: { gap: 0 },
  picker: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  pickerText: {
    flex: 1,
    fontFamily: "Alex_500",
    fontSize: 14,
    color: Colors.textPrimary,
    textAlign: "right",
  },
  pickerPlaceholder: { color: Colors.textPlaceholder },
  dropdown: {
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff",
    marginTop: 4,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  dropdownItemActive: { backgroundColor: Colors.primaryLight },
  dropdownItemText: {
    fontFamily: "Alex_400",
    fontSize: 14,
    color: Colors.textPrimary,
    textAlign: "right",
  },
  dropdownItemTextActive: { fontFamily: "Alex_700", color: Colors.primary },

  // Wheel
  wheelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F7F7F7",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  wheelDot: { width: 14, height: 14, borderRadius: 7 },
  wheelInput: {
    flex: 1,
    fontFamily: "Alex_400",
    fontSize: 13,
    color: "#333",
    paddingVertical: 8,
  },
  removeX: { fontSize: 20, color: "#999", paddingHorizontal: 2 },
  addItemBtn: {
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: "center",
  },
  addItemText: { fontFamily: "Alex_500", fontSize: 13, color: Colors.primary },
});
