import { NavHeader } from "@/components/Ui/NavHeader";
import { Colors } from "@/constants/colors";
import { API_ENDPOINTS } from "@/constants/endpoints";
import { api, normalizeError } from "@/services/api";
import { useRouter } from "expo-router";
import {
  AlertCircle,
  BookText,
  CheckCircle,
  Search,
  Share2,
  ShieldCheck,
} from "lucide-react-native";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const FEATURES = [
  {
    icon: Share2,
    color: Colors.primary,
    bg: Colors.primaryLight,
    text: "مشاركة المحتوي مع الطلاب",
  },
  {
    icon: BookText,
    color: "#7c3aed",
    bg: "#ede9fe",
    text: "تنظيم المواد الدراسية",
  },
  {
    icon: Search,
    color: Colors.success,
    bg: Colors.successBg,
    text: "البحث السريع عن المواد",
  },
];

export default function LibraryScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [opened, setOpened] = useState(false);

  const handleOpen = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.post<{ data: any; success?: boolean }>(
        API_ENDPOINTS.LIBRARY.LOGIN_LINK,
      );
      const payload = data.data ?? data;
      const url: string = payload.url ?? payload.login_link ?? "";
      if (!url) throw new Error("لم يتم العثور على رابط المكتبة");
      await Linking.openURL(url);
      setOpened(true);
    } catch (err) {
      setError(normalizeError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      <NavHeader title="المكتبة الرقمية" onBack={() => router.back()} />

      <View style={styles.body}>
        {/* Hero card */}
        <View style={styles.heroCard}>
          {/* Decorative circles */}
          <View style={styles.circle1} />
          <View style={styles.circle2} />
          <View style={styles.circle3} />

          <View style={styles.iconWrap}>
            <Image
              source={require("@/assets/images/library.png")}
              style={{ width: 65, height: 65 }}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.heroTitle}>مرحباً بك في المكتبة الرقمية</Text>
          <Text style={styles.heroSub}>
            منصة learn at Dolphin للمكتبة الرقمية
          </Text>
          <Text style={styles.heroDesc}>
            الوصول الي جميع المواد التعليمية واكتب والمحتوي التعليمي
          </Text>
        </View>

        {/* Features */}
        <View style={styles.featuresCard}>
          {FEATURES.map(({ icon: Icon, color, bg, text }, i) => (
            <View
              key={text}
              style={[
                styles.featureRow,
                i === FEATURES.length - 1 && styles.featureRowLast,
              ]}
            >
              <View style={[styles.featureIconWrap, { backgroundColor: bg }]}>
                <Icon size={18} color={color} />
              </View>
              <Text style={styles.featureText}>{text}</Text>
            </View>
          ))}
        </View>

        <View style={styles.spacer} />

        {/* Error */}
        {error ? (
          <View style={styles.errorBox}>
            <AlertCircle size={16} color={Colors.error} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* Success hint */}
        {opened && !error ? (
          <View style={styles.successBox}>
            <CheckCircle size={16} color={Colors.success} />
            <Text style={styles.successText}>تم فتح المكتبة بنجاح</Text>
          </View>
        ) : null}

        {/* CTA */}
        <TouchableOpacity
          style={[styles.openBtn, loading && styles.openBtnDim]}
          activeOpacity={0.85}
          onPress={handleOpen}
          disabled={loading}
        >
          {loading ? (
            <>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={styles.openBtnText}>جاري الفتح...</Text>
            </>
          ) : (
            <Text style={styles.openBtnText}>دخول المكتبة</Text>
          )}
        </TouchableOpacity>

        {/* Security note */}
        <View style={styles.secureRow}>
          <ShieldCheck size={14} color={Colors.textTertiary} />
          <Text style={styles.secureText}>
            سيتم فتح المكتبة في المتصفح بشكل آمن
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
  body: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    gap: 16,
  },

  /* Hero */
  heroCard: {
    backgroundColor: "#F8E0BF",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    gap: 8,
    overflow: "hidden",
  },
  circle1: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1.5,
    borderColor: "#fff",
    top: -30,
    left: -30,
    opacity: 0.6,
  },
  circle2: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: "#fff",
    top: 10,
    left: 10,
    opacity: 0.4,
  },
  circle3: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1.5,
    borderColor: "#fff",
    bottom: -20,
    right: -20,
    opacity: 0.5,
  },
  iconWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  heroTitle: {
    fontFamily: "Alex_700",
    fontSize: 18,
    color: Colors.textPrimary,
    textAlign: "center",
  },
  heroSub: {
    fontFamily: "Alex_500",
    fontSize: 13,
    color: Colors.primary,
    textAlign: "center",
  },
  heroDesc: {
    fontFamily: "Alex_400",
    fontSize: 13,
    color: "#676767",
    textAlign: "center",
    lineHeight: 22,
    marginTop: 2,
  },

  /* Features */
  featuresCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
  },
  featureRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    gap: 12,
  },
  featureRowLast: {
    borderBottomWidth: 0,
  },
  featureText: {
    fontFamily: "Alex_500",
    fontSize: 14,
    color: Colors.textPrimary,
    flex: 1,
    textAlign: "right",
  },
  featureIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  spacer: { flex: 1 },

  /* Error / success */
  errorBox: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#fef2f2",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#fecaca",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  errorText: {
    flex: 1,
    fontFamily: "Alex_400",
    fontSize: 13,
    color: Colors.error,
    textAlign: "right",
  },
  successBox: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.successBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.success + "40",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  successText: {
    flex: 1,
    fontFamily: "Alex_500",
    fontSize: 13,
    color: Colors.success,
    textAlign: "right",
  },

  /* Button */
  openBtn: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    borderRadius: 50,
    paddingVertical: 16,
  },
  openBtnDim: { backgroundColor: Colors.textTertiary },
  openBtnText: { fontFamily: "Alex_700", fontSize: 16, color: "#fff" },

  /* Security note */
  secureRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  secureText: {
    fontFamily: "Alex_400",
    fontSize: 12,
    color: Colors.textTertiary,
  },
});
