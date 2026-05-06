import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import ThemeContext from "../../components/Theme/ThemeContext";
import SaudiRiyalSvg from "../../assets/svg/SaudiRiyal.svg";
import { packageFactoryWithTitle } from "../../utils/packageFactory";

const PAYMENT_METHODS = [
  {
    id: "tamara",
    label: "تمارا",
    image: require("../../assets/images/uiuxIMG.png"),
    isTamara: true,
  },
  { id: "wallet", label: "المحفظة", icon: "wallet-outline" },
  { id: "card", label: "بطاقات ائتمانية", isCard: true },
];

const PrivateSessionCheckoutScreen = () => {
  const theme = useContext(ThemeContext);
  const navigation = useNavigation();
  const route = useRoute();
  const { subject, pkg, timeValue, teacher } = route.params || {};

  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");

  const SubjectImage = subject?.title
    ? packageFactoryWithTitle(subject.title)?.image
    : null;

  const selectedDay = timeValue?.days?.[0] || "السبت";
  const selectedTime = timeValue?.time || "10 ص";

  const handleApplyCoupon = () => {
    if (coupon.trim().length > 0) setCouponApplied(true);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.whiteOrBlack }]}
    >
      {/* Header */}
      <View
        style={[styles.header, { borderBottomColor: theme.border || "#eee" }]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            name="arrow-forward-outline"
            size={24}
            color={theme.orange}
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.whiteOrBlack }]}>
          حجز حصة فردية والدفع
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary Card */}
        <View
          style={[
            styles.summaryCard,
            {
              backgroundColor: theme.background,
              borderColor: theme.border || "#eee",
            },
          ]}
        >
          {/* Banner */}
          <View style={styles.summaryBanner}>
            <Text style={styles.summaryBannerText}>ملخص الطلب</Text>
          </View>

          {/* Subject row */}
          <View style={styles.subjectRow}>
            <View style={styles.subjectTextCol}>
              <Text style={[styles.subjectName, { color: theme.whiteOrBlack }]}>
                {subject?.title || "اللغة العربية"}
              </Text>
              <Text
                style={[styles.subjectSub, { color: theme.subText || "#aaa" }]}
              >
                {pkg?.title || "حصة فردية تجريبية"} - {pkg?.sessions || 60}{" "}
                دقيقيه
              </Text>
            </View>
            {SubjectImage && (
              <View
                style={[
                  styles.subjectIconBox,
                  {
                    backgroundColor:
                      packageFactoryWithTitle(subject.title)?.bgColor || "#eee",
                  },
                ]}
              >
                <SubjectImage width={40} height={40} />
              </View>
            )}
          </View>

          <View
            style={[
              styles.divider,
              { backgroundColor: theme.border || "#eee" },
            ]}
          />

          {/* Details rows */}
          {[
            { label: "المعلم", value: teacher?.name || "الزهراء خضري" },
            { label: "نوع الحجز", value: pkg?.title || "حصة فردية تجريبية" },
            { label: "مدة الحصة", value: `${pkg?.sessions || 60} دقيقة` },
            { label: "التاريخ", value: `${selectedDay} 17 مارس 2026` },
            { label: "الوقت", value: selectedTime },
          ].map(({ label, value }) => (
            <View key={label} style={styles.detailRow}>
              <Text style={[styles.detailValue, { color: theme.whiteOrBlack }]}>
                {value}
              </Text>
              <Text
                style={[styles.detailLabel, { color: theme.subText || "#aaa" }]}
              >
                {label}
              </Text>
            </View>
          ))}

          <View
            style={[
              styles.divider,
              { backgroundColor: theme.border || "#eee" },
            ]}
          />

          {/* Total */}
          <View style={styles.totalRow}>
            <View style={styles.totalPriceRow}>
              <Text style={[styles.totalPrice, { color: theme.orange }]}>
                {pkg?.price || "20"}
              </Text>
              <SaudiRiyalSvg width={16} height={16} />
            </View>
            <Text style={[styles.totalLabel, { color: theme.whiteOrBlack }]}>
              الاجمالي
            </Text>
          </View>
        </View>

        {/* Coupon */}
        <Text style={[styles.sectionLabel, { color: theme.whiteOrBlack }]}>
          هل لديك كود خصم؟
        </Text>
        <View style={styles.couponWrapper}>
          <View
            style={[
              styles.couponBox,
              {
                borderColor: couponApplied ? "#2ecc71" : theme.border || "#ccc",
              },
            ]}
          >
            {couponApplied && (
              <View style={styles.couponCheck}>
                <Ionicons name="checkmark-circle" size={24} color="#2ecc71" />
              </View>
            )}
            <TextInput
              style={[styles.couponInput, { color: theme.whiteOrBlack }]}
              value={coupon}
              onChangeText={setCoupon}
              placeholder="أدخل كود الخصم"
              placeholderTextColor={theme.subText || "#aaa"}
              textAlign="right"
            />
            <Ionicons
              name="ticket-outline"
              size={22}
              color={theme.subText || "#aaa"}
            />
          </View>
          {!couponApplied && (
            <TouchableOpacity
              style={[styles.applyBtn, { backgroundColor: theme.orange }]}
              onPress={handleApplyCoupon}
            >
              <Text style={styles.applyBtnText}>تطبيق</Text>
            </TouchableOpacity>
          )}
        </View>
        {couponApplied && (
          <Text style={styles.couponSuccess}>تم تفعيل كود الخصم بنجاح</Text>
        )}

        {/* Payment Method */}
        <Text style={[styles.sectionLabel, { color: theme.whiteOrBlack }]}>
          اختر طريقة الدفع:
        </Text>
        <View style={styles.paymentRow}>
          {PAYMENT_METHODS.map((method) => {
            const isSelected = paymentMethod === method.id;
            return (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.paymentCard,
                  {
                    borderColor: isSelected
                      ? theme.orange
                      : theme.border || "#ddd",
                    borderWidth: isSelected ? 2 : 1,
                    backgroundColor: theme.background,
                  },
                ]}
                onPress={() => setPaymentMethod(method.id)}
              >
                {method.isCard ? (
                  <View style={styles.cardIconsGrid}>
                    <View style={styles.cardRow}>
                      <Text style={styles.cardBadge}>STC</Text>
                      <Text style={styles.cardBadge}>VISA</Text>
                      <Text style={styles.cardBadge}>MC</Text>
                    </View>
                    <View style={styles.cardRow}>
                      <Text style={styles.cardBadge}>مدى</Text>
                      <Text style={styles.cardBadge}>Apple</Text>
                    </View>
                  </View>
                ) : method.isTamara ? (
                  <Text style={styles.tamaraText}>تمارا</Text>
                ) : (
                  <Ionicons
                    name={method.icon}
                    size={26}
                    color={isSelected ? theme.orange : theme.subText || "#aaa"}
                  />
                )}
                <Text
                  style={[
                    styles.paymentLabel,
                    {
                      color: isSelected
                        ? theme.orange
                        : theme.subText || "#aaa",
                    },
                  ]}
                >
                  {method.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.payBtn, { backgroundColor: theme.orange }]}
        >
          <Text style={styles.payBtnText}>متابعة الدفع</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontFamily: "Alexandria-Regular",
    fontSize: 16,
  },
  scroll: { padding: 16, paddingBottom: 100 },
  summaryCard: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 20,
  },
  summaryBanner: {
    backgroundColor: "#D18C2D",
    paddingVertical: 14,
    alignItems: "center",
  },
  summaryBannerText: {
    fontFamily: "Alexandria-Regular",
    fontSize: 16,

    color: "#fff",
  },
  subjectRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    paddingLeft:5,
    gap: 10,
  },
  subjectTextCol: { flex: 1, alignItems: "flex-start" },
  subjectName: {
    fontFamily: "Alexandria-Regular",
    fontSize: 15,

    // textAlign: "right",
  },
  subjectSub: {
    fontFamily: "Alexandria-Regular",
    fontSize: 12,
    textAlign: "right",
    // marginTop: 4,
  },
  subjectIconBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  divider: { height: 1, marginHorizontal: 14 },
  detailRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  detailLabel: {
    fontFamily: "Alexandria-Regular",
    fontSize: 13,
  },
  detailValue: {
    fontFamily: "Alexandria-Regular",
    fontSize: 13,
  },
  totalRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  totalLabel: {
    fontFamily: "Alexandria-Regular",
    fontSize: 16,
  },
  totalPriceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  totalPrice: {
    fontFamily: "Alexandria-Regular",
    fontSize: 18,
  },
  sectionLabel: {
    fontFamily: "Alexandria-Regular",
    fontSize: 14,
    marginBottom: 10,
  },
  couponWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
      borderWidth: 1.5,
    borderStyle: "dashed",
    borderRadius: 50,
        paddingHorizontal:20,
  },
  couponBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  

    paddingVertical: 10,
    gap: 8,
  },
  couponCheck: { marginLeft: 4 },
  couponInput: {
    flex: 1,
    fontFamily: "Alexandria-Regular",
    fontSize: 14,
  },
  applyBtn: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
  },
  applyBtnText: {
    color: "#fff",
    fontFamily: "Alexandria-Regular",
    fontSize: 13,
  },
  couponSuccess: {
    color: "#2ecc71",
    fontFamily: "Alexandria-Regular",
    fontSize: 12,
    textAlign: "right",
    marginBottom: 16,
  },
  paymentRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  paymentCard: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: "center",
    gap: 6,
  },
  cardIconsGrid: { gap: 4 },
  cardRow: { flexDirection: "row", gap: 4 },
  cardBadge: {
    fontSize: 8,
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 3,
    fontFamily: "Alexandria-Regular",
  },
  tamaraText: {
    fontFamily: "Alexandria-Regular",
    fontSize: 16,

    color: "#6B3FA0",
  },
  paymentLabel: {
    fontFamily: "Alexandria-Regular",
    fontSize: 11,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  payBtn: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  payBtnText: {
    color: "#fff",
    fontFamily: "Alexandria-Regular",
    fontSize: 16,
  },
});

export default PrivateSessionCheckoutScreen;
