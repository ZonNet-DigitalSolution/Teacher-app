import {
  BackgroundDots,
  type DotPosition,
} from "@/components/Ui/background-dots";
import { ErrorBanner } from "@/components/Ui/error-banner";
import { PasswordField } from "@/components/Ui/password-field";
import { Colors } from "@/constants/colors";
import { usePasswordLoginForm } from "@/hooks/use-password-login-form";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const DOT_POSITIONS: DotPosition[] = [
  { top: 40, left: 30, size: 6, opacity: 0.35 },
  { top: 80, left: 80, size: 4, opacity: 0.25 },
  { bottom: 200, left: 40, size: 7, opacity: 0.22 },
  { bottom: 100, left: 70, size: 5, opacity: 0.28 },
];

export default function PasswordLoginScreen() {
  const { phone } = useLocalSearchParams<{ phone: string }>();

  const {
    password,
    errors,
    touched,
    isLoading,
    error,
    handlePasswordChange,
    handleSubmit,
    clearError,
  } = usePasswordLoginForm(phone ?? "");

  const onSubmit = async () => {
    const result = await handleSubmit();
    if (!result || (result as any).meta?.requestStatus === "rejected") return;
    router.replace("/(tabs)");
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

            <Text style={styles.title}>أدخل كلمة المرور</Text>
            <Text style={styles.subtitle}>
              <Text style={styles.phoneText}>{phone}</Text>
            </Text>

            {error && <ErrorBanner message={error} onDismiss={clearError} />}

            <PasswordField
              label="كلمة المرور"
              placeholder="أدخل كلمة المرور"
              value={password}
              onChangeText={handlePasswordChange}
              error={touched ? errors.password : undefined}
            />

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

            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => router.back()}
              disabled={isLoading}
            >
              <Text style={styles.backText}>رجوع</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  phoneText: { color: Colors.primaryAuth, fontFamily: "Alex_500" },
  btn: {
    backgroundColor: Colors.primaryAuth,
    borderRadius: 30,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 12,
    shadowColor: Colors.primaryAuth,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
  },
  btnDisabled: { opacity: 0.7 },
  btnText: { color: Colors.surface, fontSize: 17, fontFamily: "Alex_400" },
  forgotBtn: { alignItems: "center", marginBottom: 12 },
  forgotText: {
    fontSize: 13,
    color: Colors.primaryAuth,
    fontFamily: "Alex_400",
  },
  backBtn: { alignItems: "center" },
  backText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontFamily: "Alex_400",
  },
});
