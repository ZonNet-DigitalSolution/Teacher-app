import React from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '@/constants/colors';
import { COUNTRIES, type Country } from '@/constants/countries';

interface CountryPickerProps {
  visible: boolean;
  selected: Country;
  onSelect: (country: Country) => void;
  onClose: () => void;
}

export function CountryPicker({ visible, selected, onSelect, onClose }: CountryPickerProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <Text style={styles.title}>اختر الدولة</Text>
        <FlatList
          data={COUNTRIES}
          keyExtractor={(c) => c.code}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.row, item.code === selected.code && styles.rowActive]}
              onPress={() => { onSelect(item); onClose(); }}
            >
              <Text style={styles.dial}>{item.dial}</Text>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.flag}>{item.flag}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: '60%',
  },
  handle: {
    width: 40, height: 4,
    backgroundColor: Colors.borderInput,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12, marginBottom: 16,
  },
  title: {
    fontSize: 17, fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'right', marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 10,
  },
  rowActive: { backgroundColor: '#FFF8EC' },
  flag: { fontSize: 24 },
  name: { flex: 1, fontSize: 15, color: Colors.textPrimary, textAlign: 'right' },
  dial: { fontSize: 13, color: Colors.textSecondary, fontWeight: '600' },
});
