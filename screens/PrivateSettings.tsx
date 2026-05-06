import RiyalIcon from "@/assets/svg/Riyal.svg";
import UploadCloudIcon from "@/assets/svg/upload-cloud.svg";
import { Colors } from "@/constants/colors";
import { Copy, Share2 } from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type PricingTab = "private" | "packages";

const PAGE_URL = "https/hhnkmoikwyw/.slqp";

export function PrivateSettings() {
  const [enabled, setEnabled] = useState(true);
  const [pricingTab, setPricingTab] = useState<PricingTab>("private");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [breakTime, setBreakTime] = useState("");
  const [maxPerDay, setMaxPerDay] = useState("");
  const [maxPerWeek, setMaxPerWeek] = useState("");
  const [bio, setBio] = useState("");
  const [identifier, setIdentifier] = useState("");

  function handleSave() {
    Alert.alert("تم الحفظ", "تم حفظ الإعدادات بنجاح");
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Toggle ── */}
        <View style={styles.toggleRow}>
          <View style={styles.toggleLabels}>
            <Text style={styles.toggleTitle}>تفعيل الحصص الفردية</Text>
            <Text style={styles.toggleHint}>
              عند التفعيل سيتمكن الطالب من حجز حصص فردية معك
            </Text>
          </View>
          <Switch
            value={enabled}
            onValueChange={setEnabled}
            trackColor={{ false: Colors.border, true: Colors.primary + "88" }}
            thumbColor={enabled ? Colors.primary : Colors.textTertiary}
          />
        </View>

        <View style={styles.divider} />

        {/* ── Pricing section heading ── */}
        <Text style={styles.sectionHeading}>نظام التسعير</Text>

        {/* Underline tab bar */}
        <View style={styles.underlineTabs}>
          {(
            [
              { id: "private", label: "حصص فردية" },
              { id: "packages", label: "باقات" },
            ] as { id: PricingTab; label: string }[]
          ).map((tab) => {
            const isActive = pricingTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[
                  styles.underlineTab,
                  isActive && styles.underlineTabActive,
                ]}
                onPress={() => setPricingTab(tab.id)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.underlineTabText,
                    isActive && styles.underlineTabTextActive,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Price field ── */}
        <View style={styles.fieldBlock}>
          <View style={styles.fieldLabelRow}>
            <Text style={styles.fieldLabel}>سعر الحصة الواحدة</Text>
            <RiyalIcon width={13} height={13} color={Colors.textPrimary} />
          </View>
          <TextInput
            style={styles.input}
            value={price}
            onChangeText={setPrice}
            placeholder="ادخل سعر الحصة الواحدة"
            placeholderTextColor={Colors.textPlaceholder}
            keyboardType="numeric"
            textAlign="right"
          />
          <View style={styles.minHintRow}>
            <Text style={styles.minHint}>الحد الادني 50</Text>
            <RiyalIcon width={11} height={11} color={Colors.primary} />
          </View>
        </View>

        {/* ── Session settings card ── */}
        <View style={[styles.card, styles.cardOrange]}>
          <Text style={styles.cardTitle}>اعدادات الحصة</Text>

          <Text style={styles.fieldLabel}>مدة الحصة الافتراضية</Text>
          <TextInput
            style={styles.input}
            value={duration}
            onChangeText={setDuration}
            placeholder="ادخل مدة الحصة"
            placeholderTextColor={Colors.textPlaceholder}
            keyboardType="numeric"
            textAlign="right"
          />

          <Text style={styles.fieldLabel}>
            فترة الراحة بين الحصص (بالدقائق)
          </Text>
          <TextInput
            style={styles.input}
            value={breakTime}
            onChangeText={setBreakTime}
            placeholder="ادخل مدة الحصة"
            placeholderTextColor={Colors.textPlaceholder}
            keyboardType="numeric"
            textAlign="right"
          />

          <Text style={styles.fieldLabel}>الحد الاقصى للحصص يومياً</Text>
          <TextInput
            style={styles.input}
            value={maxPerDay}
            onChangeText={setMaxPerDay}
            placeholder="ادخل الحد الاقصى للحصص يومياً"
            placeholderTextColor={Colors.textPlaceholder}
            keyboardType="numeric"
            textAlign="right"
          />

          <Text style={styles.fieldLabel}>الحد الاقصى للحصص اسبوعياً</Text>
          <TextInput
            style={styles.input}
            value={maxPerWeek}
            onChangeText={setMaxPerWeek}
            placeholder="ادخل الحد الاقصى للحصص اسبوعياً"
            placeholderTextColor={Colors.textPlaceholder}
            keyboardType="numeric"
            textAlign="right"
          />
        </View>

        {/* ── Profile card ── */}
        <View
          style={[
            styles.card,
            { borderWidth: 2, borderColor: "#DAD4D4", borderStyle: "dashed" },
          ]}
        >
          <Text style={styles.cardTitle}>بيانات الصفحة الشخصية</Text>

          <Text style={styles.fieldLabel}>نبذة عنك</Text>
          <TextInput
            style={[styles.input, styles.inputMultiline]}
            value={bio}
            onChangeText={setBio}
            placeholder="اكتب نبذة عنك"
            placeholderTextColor={Colors.textPlaceholder}
            multiline
            textAlign="right"
            textAlignVertical="top"
          />

          <Text style={styles.fieldLabel}>المعرف الخاص</Text>
          <TextInput
            style={styles.input}
            value={identifier}
            onChangeText={setIdentifier}
            placeholder="ادخل معرفك الخاص"
            placeholderTextColor={Colors.textPlaceholder}
            textAlign="right"
          />

          <Text style={styles.fieldLabel}>رابط الصفحة</Text>
          <View style={styles.urlRow}>
            <TouchableOpacity style={styles.urlCopyBtn}>
              <Copy size={16} color={Colors.textSecondary} />
            </TouchableOpacity>
            <Text style={styles.urlText} numberOfLines={1}>
              {PAGE_URL}
            </Text>
            <TouchableOpacity style={styles.urlShareBtn}>
              <Share2 size={16} color="#fff" />
            </TouchableOpacity>
          </View>

          <Text style={styles.fieldLabel}>الفيديو التعريفي</Text>
          <TouchableOpacity style={styles.uploadBox} activeOpacity={0.8}>
            <UploadCloudIcon width={32} height={24} />
            <Text style={styles.uploadBoxText}>
              اسحب الفيديو هنا أو اضغط للاختيار
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Save button ── */}
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleSave}
          activeOpacity={0.85}
        >
          <Text style={styles.saveBtnText}>حفظ التغييرات</Text>
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { flex: 1 },
  content: { padding: 16, gap: 30 },

  // ── Toggle ─────────────────────────────────────────
  toggleRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 12,
  },
  toggleLabels: { flex: 1, alignItems: "flex-end" },
  toggleTitle: {
    fontSize: 15,
    fontFamily: "Alex_600",
    color: Colors.textPrimary,
  },
  toggleHint: {
    fontSize: 12,
    fontFamily: "Alex_400",
    color: Colors.textSecondary,
    marginTop: 3,
    textAlign: "right",
  },
  divider: {
    // height: 1,
    // backgroundColor: Colors.borderLight,
    borderBottomWidth: 2,
    borderStyle: "dashed",
    borderBottomColor: Colors.borderLight,
    marginVertical: 5,
  },

  // ── Pricing tabs ───────────────────────────────────
  sectionHeading: {
    fontSize: 16,
    fontFamily: "Alex_700",
    color: Colors.textPrimary,
    textAlign: "right",
    marginBottom: -4,
  },
  underlineTabs: {
    flexDirection: "row-reverse",
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  underlineTab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
  },
  underlineTabActive: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
    marginBottom: -1,
  },
  underlineTabText: {
    fontSize: 14,
    fontFamily: "Alex_500",
    color: Colors.textSecondary,
  },
  underlineTabTextActive: {
    fontFamily: "Alex_700",
    color: Colors.primary,
  },

  // ── Field / Input ──────────────────────────────────
  fieldBlock: { gap: 6 },
  fieldLabel: {
    fontSize: 13,
    fontFamily: "Alex_600",
    color: Colors.textPrimary,
    textAlign: "right",
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.borderInput,
    borderRadius: 10,
    height: 48,
    paddingHorizontal: 14,
    fontSize: 14,
    fontFamily: "Alex_400",
    color: Colors.textPrimary,
    backgroundColor: Colors.surface,
  },
  inputMultiline: {
    height: 100,
    paddingTop: 12,
    paddingBottom: 12,
  },
  fieldLabelRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
    marginTop: 12,
  },
  minHintRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  minHint: {
    fontSize: 12,
    fontFamily: "Alex_400",
    color: Colors.primary,
    textAlign: "right",
  },

  // ── Cards ─────────────────────────────────────────
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    // borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  cardOrange: {
    backgroundColor: "#FDF5EB",
    // borderColor: "#E8C98A",
  },
  cardTitle: {
    fontSize: 14,
    fontFamily: "Alex_700",
    color: Colors.textPrimary,
    textAlign: "center",
    marginBottom: 4,
  },

  // ── URL row ────────────────────────────────────────
  urlRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.borderInput,
    borderRadius: 10,
    height: 48,
    overflow: "hidden",
  },
  urlShareBtn: {
    width: 46,
    height: 48,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  urlText: {
    flex: 1,
    fontSize: 12,
    fontFamily: "Alex_400",
    color: Colors.textSecondary,
    textAlign: "right",
    paddingHorizontal: 10,
  },
  urlCopyBtn: {
    width: 46,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderLeftWidth: 1,
    borderLeftColor: Colors.borderInput,
  },

  // ── Upload box ─────────────────────────────────────
  uploadBox: {
    height: 110,

    borderColor: Colors.borderLight,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#F5F5F4",
    marginTop: 6,
  },
  uploadBoxText: {
    fontSize: 13,
    fontFamily: "Alex_400",
    color: Colors.textSecondary,
  },

  // ── Save button ────────────────────────────────────
  saveBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 50,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  saveBtnText: {
    fontSize: 14,
    fontFamily: "Alex_700",
    color: "#fff",
  },
});
