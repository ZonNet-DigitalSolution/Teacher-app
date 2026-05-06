import { Colors } from "@/constants/colors";
import { ChevronDown } from "lucide-react-native";
import React, { memo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface GradeFilterProps {
  grades: string[];
  selected: string;
  open: boolean;
  onToggle: () => void;
  onSelect: (grade: string) => void;
}

export const GradeFilter = memo(function GradeFilter({
  grades,
  selected,
  open,
  onToggle,
  onSelect,
}: GradeFilterProps) {
  return (
    <View>
      <TouchableOpacity
        style={styles.filterBtn}
        activeOpacity={0.8}
        onPress={onToggle}
      >
        <ChevronDown size={15} color={Colors.textPrimary} />
        <Text style={styles.filterText}>{selected}</Text>
      </TouchableOpacity>

      {open && (
        <View style={styles.dropdown}>
          {grades.map((grade) => (
            <TouchableOpacity
              key={grade}
              style={[
                styles.dropdownItem,
                selected === grade && styles.dropdownItemActive,
              ]}
              onPress={() => onSelect(grade)}
            >
              <Text
                style={[
                  styles.dropdownItemText,
                  selected === grade && styles.dropdownItemTextActive,
                ]}
              >
                {grade}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 9,
    backgroundColor: "#fff",
  },
  filterText: {
    fontFamily: "Alex_700",
    fontSize: 13,
    color: Colors.textPrimary,
  },
  dropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    marginTop: 4,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    zIndex: 100,
    minWidth: 160,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  dropdownItemActive: {
    backgroundColor: Colors.primaryLight,
  },
  dropdownItemText: {
    fontFamily: "Alex_400",
    fontSize: 13,
    color: Colors.textPrimary,
    textAlign: "right",
  },
  dropdownItemTextActive: {
    fontFamily: "Alex_700",
    color: Colors.primary,
  },
});
