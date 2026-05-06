import { Colors } from "@/constants/colors";
import React from "react";
import { StyleSheet, TextInput } from "react-native";

export function StyledInput({
  value,
  onChangeText,
  keyboardType = "default",
  multiline = false,
  placeholder = "",
  numberOfLines,
}: {
  value: string;
  onChangeText: (v: string) => void;
  keyboardType?: "default" | "numeric";
  multiline?: boolean;
  placeholder?: string;
  numberOfLines?: number;
}) {
  return (
    <TextInput
      style={[styles.input, multiline && styles.inputMultiline]}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      multiline={multiline}
      numberOfLines={numberOfLines}
      textAlign="right"
      textAlignVertical={multiline ? "top" : "center"}
      placeholderTextColor={Colors.textPlaceholder}
      placeholder={placeholder}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: Colors.borderInput,
    borderRadius: 10,
    height: 48,
    paddingHorizontal: 14,
    fontSize: 15,
    fontFamily: "Alex_400",
    color: Colors.textPrimary,
    backgroundColor: Colors.surfaceAlt,
  },
  inputMultiline: {
    height: 100,
    paddingTop: 12,
    paddingBottom: 12,
  },
});
