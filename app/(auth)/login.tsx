import {
  BackgroundDots,
  type DotPosition,
} from "@/components/Ui/background-dots";
import { CountryPicker } from "@/components/Ui/country-picker";
import { ErrorBanner } from "@/components/Ui/error-banner";
import { FieldError } from "@/components/Ui/field-error";
import { Colors } from "@/constants/colors";
import { useLoginForm } from "@/hooks/use-login-form";
import { router } from "expo-router";
import { ChevronDown } from "lucide-react-native";
import React from "react";
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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const DOT_POSITIONS: DotPosition[] = [
  { top: 40, left: 30, size: 6, opacity: 0.35 },
  { top: 80, left: 80, size: 4, opacity: 0.25 },
  { top: 25, right: 50, size: 5, opacity: 0.3 },
  { top: 120, right: 30, size: 8, opacity: 0.2 },
  { top: 160, left: 50, size: 3, opacity: 0.4 },
  { top: 200, right: 80, size: 5, opacity: 0.28 },
  { bottom: 200, left: 40, size: 7, opacity: 0.22 },
  { bottom: 160, right: 35, size: 4, opacity: 0.35 },
  { bottom: 100, left: 70, size: 5, opacity: 0.28 },
  { bottom: 260, right: 60, size: 6, opacity: 0.2 },
];

export default function LoginScreen() {
  const {
    phone,
    country,
    pickerVisible,
    errors,
    touched,
    isLoading,
    error,
    fullPhone,
    handlePhoneChange,
    handleCountrySelect,
    openPicker,
    closePicker,
    handleSubmit,
    clearError,
  } = useLoginForm();

  const onSubmit = async () => {
    const result = await handleSubmit();
    if (!result || result.meta.requestStatus === "rejected") return;
    router.push({
      pathname: "/(auth)/password-login",
      params: { phone: fullPhone },
    });
  };

  return (
    <SafeAreaView style={styles.screen}>
      <BackgroundDots positions={DOT_POSITIONS} color={Colors.primaryAuth} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <Image
              source={require("@/assets/images/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />

            <Text style={styles.title}>مرحبا بعودتك !</Text>
            <Text style={styles.subtitle}>أدخل بيانات الدخول</Text>

            {error && <ErrorBanner message={error} onDismiss={clearError} />}

            <Text style={styles.label}>رقم الهاتف</Text>
            <View
              style={[
                styles.phoneWrap,
                touched && errors.phone ? styles.inputError : null,
              ]}
            >
              <TextInput
                style={styles.phoneInput}
                value={phone}
                onChangeText={handlePhoneChange}
                placeholder="رقم الهاتف"
                placeholderTextColor={Colors.textPlaceholder}
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
            <FieldError message={touched ? errors.phone : undefined} />

            <TouchableOpacity
              style={[styles.btn, isLoading && styles.btnDisabled]}
              activeOpacity={0.85}
              onPress={onSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.btnText}>تسجيل الدخول</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.forgotBtn}
              onPress={() => router.push("/(auth)/forgot-password")}
              disabled={isLoading}
            >
              <Text style={styles.forgotText}>نسيت كلمة المرور؟</Text>
            </TouchableOpacity>

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>أو</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.footerRow}>
              <TouchableOpacity
                onPress={() => router.push("/(auth)/register")}
                disabled={isLoading}
              >
                <Text style={styles.link}>تسجيل</Text>
              </TouchableOpacity>
              <Text style={styles.footerBase}> ليس لديك حساب؟</Text>
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
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 6,
  },
  logo: { width: 160, height: 60, alignSelf: "center", marginBottom: 24 },
  title: {
    fontSize: 26,
    fontFamily: "Alex_600",
    color: "#1A1A1A",
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    fontFamily: "Alex_400",
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontFamily: "Alex_400",
    color: "#1A1A1A",
    textAlign: "right",
    marginBottom: 7,
  },
  phoneWrap: {
    flexDirection: "row-reverse",
    borderWidth: 1,
    borderColor: Colors.borderInput,
    borderRadius: 10,
    overflow: "hidden",
    height: 52,
    backgroundColor: Colors.surface,
  },
  inputError: { borderColor: Colors.error, backgroundColor: "#FFF5F5" },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 14,
    fontSize: 15,
    fontFamily: "Alex_400",
    textAlign: "left",
    color: "#1A1A1A",
  },
  countryBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    gap: 4,
    borderLeftWidth: 1,
    borderLeftColor: Colors.borderInput,
    backgroundColor: "#F9FAFB",
  },
  flagEmoji: { fontSize: 20 },
  dialCode: {
    fontSize: 13,
    fontFamily: "Alex_400",
    color: "#374151",
    fontWeight: "600",
  },
  btn: {
    backgroundColor: Colors.primaryAuth,
    borderRadius: 30,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 20,
    shadowColor: Colors.primaryAuth,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
  },
  btnDisabled: { opacity: 0.7 },
  forgotBtn: { alignSelf: "flex-end", marginTop: 4, marginBottom: 16 },
  forgotText: {
    fontSize: 13,
    color: Colors.primaryAuth,
    fontFamily: "Alex_400",
  },
  btnText: { color: Colors.surface, fontSize: 17, fontFamily: "Alex_400" },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.borderInput },
  dividerText: { fontSize: 13, color: "#9CA3AF", fontFamily: "Alex_400" },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  footerBase: { fontSize: 14, color: "#374151", fontFamily: "Alex_400" },
  link: {
    fontSize: 14,
    color: Colors.primaryAuth,
    fontFamily: "Alex_500",
  },
});
