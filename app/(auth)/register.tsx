import {
  BackgroundDots,
  type DotPosition,
} from '@/components/Ui/background-dots';
import { CountryPicker } from '@/components/Ui/country-picker';
import { ErrorBanner } from '@/components/Ui/error-banner';
import { FieldError } from '@/components/Ui/field-error';
import { PasswordField } from '@/components/Ui/password-field';
import { TextField } from '@/components/Ui/text-field';
import { Colors } from '@/constants/colors';
import { useRegisterForm } from '@/hooks/use-register-form';
import { router } from 'expo-router';
import { ChevronDown } from 'lucide-react-native';
import React from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DOT_POSITIONS: DotPosition[] = [
  { top: 30, left: 25, size: 5, opacity: 0.32 },
  { top: 70, left: 70, size: 4, opacity: 0.22 },
  { top: 20, right: 45, size: 6, opacity: 0.28 },
  { top: 110, right: 25, size: 7, opacity: 0.18 },
  { top: 150, left: 40, size: 3, opacity: 0.38 },
  { bottom: 180, left: 35, size: 6, opacity: 0.2 },
  { bottom: 140, right: 30, size: 4, opacity: 0.32 },
  { bottom: 90, left: 65, size: 5, opacity: 0.25 },
  { bottom: 55, left: 28, size: 4, opacity: 0.28 },
];

export default function RegisterScreen() {
  const {
    values,
    country,
    pickerVisible,
    errors,
    isLoading,
    error,
    fullPhone,
    handleChange,
    handleCountrySelect,
    openPicker,
    closePicker,
    handleSubmit,
    clearError,
  } = useRegisterForm();

  const onSubmit = async () => {
    const result = await handleSubmit();
    if (!result || result.meta.requestStatus === 'rejected') return;
    router.push({ pathname: '/(auth)/otp', params: { phone: fullPhone, mode: 'register' } });
  };

  return (
    <SafeAreaView style={styles.screen}>
      <BackgroundDots positions={DOT_POSITIONS} color={Colors.primaryAuth} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <Image
              source={require('@/assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />

            <Text style={styles.title}>تسجيل حساب جديد</Text>
            <Text style={styles.subtitle}>انضم إلينا بإنشاء حساب مجاني!</Text>

            {error && <ErrorBanner message={error} onDismiss={clearError} />}

            <TextField
              label="الاسم الكامل"
              placeholder="أدخل الاسم الكامل"
              value={values.fullName}
              onChangeText={handleChange('fullName')}
              error={errors.fullName}
            />

            <TextField
              label="البريد الإلكتروني"
              placeholder="أدخل البريد الإلكتروني"
              value={values.email}
              onChangeText={handleChange('email')}
              keyboardType="email-address"
              error={errors.email}
            />

            {/* Phone field with country picker — custom layout */}
            <View style={styles.fieldWrap}>
              <Text style={styles.label}>رقم الهاتف</Text>
              <View
                style={[
                  styles.inputRow,
                  errors.phone ? styles.inputError : null,
                ]}
              >
                <TextInput
                  style={styles.inputRowText}
                  placeholder="رقم الهاتف"
                  placeholderTextColor={Colors.textPlaceholder}
                  value={values.phone}
                  onChangeText={handleChange('phone')}
                  keyboardType="phone-pad"
                  textAlign="right"
                  editable={!isLoading}
                />
                <TouchableOpacity
                  style={styles.countryBtn}
                  onPress={openPicker}
                  disabled={isLoading}
                >
                  <ChevronDown size={12} color={Colors.textSecondary} />
                  <Text style={styles.dialCode}>{country.dial}</Text>
                  <Text style={styles.flagEmoji}>{country.flag}</Text>
                </TouchableOpacity>
              </View>
              <FieldError message={errors.phone} />
            </View>

            <PasswordField
              label="كلمة المرور"
              placeholder="أدخل كلمة المرور"
              value={values.password}
              onChangeText={handleChange('password')}
              error={errors.password}
            />

            <PasswordField
              label="تأكيد كلمة المرور"
              placeholder="أعد إدخال كلمة المرور"
              value={values.confirmPassword}
              onChangeText={handleChange('confirmPassword')}
              error={errors.confirmPassword}
            />

            <TouchableOpacity
              style={[styles.btn, isLoading && styles.btnDisabled]}
              activeOpacity={0.85}
              onPress={onSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.surface} size="small" />
              ) : (
                <Text style={styles.btnText}>تسجيل حساب</Text>
              )}
            </TouchableOpacity>

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>أو</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.footerRow}>
              <TouchableOpacity onPress={() => router.back()} disabled={isLoading}>
                <Text style={styles.link}>تسجيل الدخول</Text>
              </TouchableOpacity>
              <Text style={styles.footerBase}> لديك حساب؟</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <CountryPicker
        visible={pickerVisible}
        selected={country}
        onSelect={handleCountrySelect}
        onClose={closePicker}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.surface },
  flex: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 28,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 6,
  },
  logo: { width: 160, height: 60, alignSelf: 'center', marginBottom: 20 },
  title: {
    fontSize: 24,
    fontFamily: 'Alex_600',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontFamily: 'Alex_400',
    marginBottom: 20,
  },
  fieldWrap: { marginBottom: 14 },
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
  countryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 4,
    borderLeftWidth: 1,
    borderLeftColor: Colors.borderInput,
    backgroundColor: '#F9FAFB',
    height: '100%',
  },
  flagEmoji: { fontSize: 20 },
  dialCode: { fontSize: 13, fontFamily: 'Alex_400', color: '#374151' },
  btn: {
    backgroundColor: Colors.primaryAuth,
    borderRadius: 30,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    marginBottom: 18,
    shadowColor: Colors.primaryAuth,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
  },
  btnDisabled: { opacity: 0.7 },
  btnText: { color: Colors.surface, fontSize: 17, fontFamily: 'Alex_400' },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.borderInput },
  dividerText: { fontSize: 13, color: '#9CA3AF', fontFamily: 'Alex_400' },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
  },
  footerBase: { fontSize: 14, color: '#374151', fontFamily: 'Alex_400' },
  link: { fontSize: 14, color: Colors.primaryAuth, fontFamily: 'Alex_500' },
});
