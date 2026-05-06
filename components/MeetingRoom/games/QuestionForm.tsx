import { Colors } from "@/constants/colors";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ARABIC_LETTERS, Option } from "./types";

// ── Option row ────────────────────────────────────────────────────────────────
interface OptionRowProps {
  option: Option;
  onRemove: (id: number) => void;
  onChange: (id: number, text: string) => void;
}

function OptionRow({ option, onRemove, onChange }: OptionRowProps) {
  return (
    <View style={qf.optionRow}>
      <TouchableOpacity onPress={() => onRemove(option.id)}>
        <Text style={qf.optX}>×</Text>
      </TouchableOpacity>
      <View style={qf.optInput}>
        <TextInput
          style={qf.optText}
          value={option.label}
          onChangeText={(t) => onChange(option.id, t)}
          textAlign="right"
          placeholderTextColor={Colors.textPlaceholder}
        />
        <View style={qf.optBadge}>
          <Text style={qf.optBadgeText}>{option.letter}</Text>
        </View>
      </View>
      <View style={qf.radioOuter} />
    </View>
  );
}

// ── QuestionForm ──────────────────────────────────────────────────────────────
interface QuestionFormProps {
  questionLabel?: string;
  addNewLabel?: string;
  placeholder?: string;
  showOptions?: boolean;
  cardWrapped?: boolean;
}

export function QuestionForm({
  questionLabel = "نص السؤال",
  addNewLabel = "+ سؤال جديد",
  placeholder = "اكتب سؤالك هنا",
  showOptions = true,
  cardWrapped = false,
}: QuestionFormProps) {
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState<Option[]>([
    { id: 1, label: "الخيار أ", letter: "أ" },
    { id: 2, label: "الخيار ب", letter: "ب" },
  ]);

  function addOption() {
    if (options.length >= 4) return;
    const letter = ARABIC_LETTERS[options.length];
    setOptions((p) => [...p, { id: Date.now(), label: `الخيار ${letter}`, letter }]);
  }

  function removeOption(id: number) {
    setOptions((p) => p.filter((o) => o.id !== id));
  }

  function changeOption(id: number, text: string) {
    setOptions((p) => p.map((o) => (o.id === id ? { ...o, label: text } : o)));
  }

  const content = (
    <View style={qf.inner}>
      <View style={qf.fieldHeader}>
        <TouchableOpacity onPress={() => setQuestionText("")}>
          <Text style={qf.addNew}>{addNewLabel}</Text>
        </TouchableOpacity>
        <Text style={qf.fieldLabel}>{questionLabel}</Text>
      </View>

      <TextInput
        style={qf.questionInput}
        placeholder={placeholder}
        value={questionText}
        onChangeText={setQuestionText}
        textAlign="right"
        placeholderTextColor={Colors.textPlaceholder}
        multiline
        textAlignVertical="top"
      />

      {showOptions && (
        <>
          {options.map((opt) => (
            <OptionRow
              key={opt.id}
              option={opt}
              onRemove={removeOption}
              onChange={changeOption}
            />
          ))}
          {options.length < 4 && (
            <TouchableOpacity style={qf.addOptionBtn} onPress={addOption}>
              <Text style={qf.addOptionText}>+ اضافة خيار</Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );

  if (cardWrapped) {
    return <View style={qf.card}>{content}</View>;
  }
  return content;
}

// ── Styles ────────────────────────────────────────────────────────────────────
const qf = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 14,
    padding: 14,
  },
  inner: { gap: 10 },

  fieldHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  fieldLabel: {
    fontFamily: "Alex_400",
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "right",
  },
  addNew: { fontFamily: "Alex_600", fontSize: 13, color: Colors.primary },

  questionInput: {
    backgroundColor: "#EEECEA",
    borderRadius: 10,
    padding: 12,
    fontFamily: "Alex_400",
    fontSize: 13,
    color: "#444",
    minHeight: 52,
  },

  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 10,
    borderRadius: 10,
    paddingVertical: 4,
    gap: 8,
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: "#CCC",
  },
  optInput: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  optText: {
    flex: 1,
    fontFamily: "Alex_400",
    fontSize: 13,
    color: "#333",
    paddingVertical: 6,
  },
  optX: { fontSize: 20, color: "#999", paddingHorizontal: 2 },
  optBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 50,
    width: 26,
    height: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  optBadgeText: { fontFamily: "Alex_700", fontSize: 12, color: "#fff" },

  addOptionBtn: {
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: "center",
  },
  addOptionText: { fontFamily: "Alex_500", fontSize: 13, color: Colors.primary },
});
