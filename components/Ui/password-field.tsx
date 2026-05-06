import { Colors } from '@/constants/colors';
import { Eye, EyeOff } from 'lucide-react-native';
import React, { memo, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { FieldError } from './field-error';

interface PasswordFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
}

export const PasswordField = memo(function PasswordField({
  label,
  placeholder,
  value,
  onChangeText,
  error,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.inputRow,
          error ? styles.inputError : value ? styles.inputFilled : null,
        ]}
      >
        <TouchableOpacity
          onPress={() => setVisible((v) => !v)}
          style={styles.eyeBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          {visible ? (
            <EyeOff size={18} color="#9CA3AF" />
          ) : (
            <Eye size={18} color="#9CA3AF" />
          )}
        </TouchableOpacity>
        <TextInput
          style={styles.inputRowText}
          placeholder={placeholder}
          placeholderTextColor={Colors.textPlaceholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!visible}
          textAlign="right"
          autoCapitalize="none"
        />
      </View>
      <FieldError message={error} />
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: { marginBottom: 14 },
  label: {
    fontSize: 14,
    fontFamily: 'Alex_400',
    color: '#1A1A1A',
    textAlign: 'right',
    marginBottom: 7,
  },
  inputRow: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: Colors.borderInput,
    borderRadius: 10,
    height: 50,
    overflow: 'hidden',
    backgroundColor: Colors.surface,
    alignItems: 'center',
  },
  inputRowText: {
    flex: 1,
    paddingHorizontal: 14,
    fontSize: 15,
    fontFamily: 'Alex_400',
    color: '#1A1A1A',
  },
  inputError: { borderColor: Colors.error, backgroundColor: '#FFF5F5' },
  inputFilled: { backgroundColor: '#F0F4FF', borderColor: '#C7D2FE' },
  eyeBtn: {
    paddingHorizontal: 12,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
