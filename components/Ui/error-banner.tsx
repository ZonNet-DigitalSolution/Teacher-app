import { AlertCircle } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/colors';

interface ErrorBannerProps {
  message: string;
  onDismiss: () => void;
}

export function ErrorBanner({ message, onDismiss }: ErrorBannerProps) {
  return (
    <TouchableOpacity style={styles.banner} onPress={onDismiss} activeOpacity={0.9}>
      <AlertCircle size={16} color={Colors.error} />
      <Text style={styles.text}>{message}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.errorBg,
    borderWidth: 1,
    borderColor: Colors.errorBorder,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  text: {
    flex: 1,
    fontSize: 13,
    color: Colors.error,
    textAlign: 'right',
  },
});
