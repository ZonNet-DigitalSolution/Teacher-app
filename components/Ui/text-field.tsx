import { Colors } from '@/constants/colors';
import React, { memo } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
} from 'react-native';
import { FieldError } from './field-error';

interface TextFieldProps extends Pick<TextInputProps, 'keyboardType' | 'autoCapitalize' | 'editable'> {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
}

export const TextField = memo(function TextField({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
  autoCapitalize = 'none',
  editable = true,
  error,
}: TextFieldProps) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        placeholder={placeholder}
        placeholderTextColor={Colors.textPlaceholder}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        editable={editable}
        textAlign="right"
      />
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
  input: {
    borderWidth: 1,
    borderColor: Colors.borderInput,
    borderRadius: 10,
    height: 50,
    paddingHorizontal: 14,
    fontSize: 15,
    fontFamily: 'Alex_400',
    color: '#1A1A1A',
    backgroundColor: Colors.surface,
  },
  inputError: { borderColor: Colors.error, backgroundColor: '#FFF5F5' },
});
