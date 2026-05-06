import { Colors } from "@/constants/colors";
import { API_ENDPOINTS } from "@/constants/endpoints";
import { api, normalizeError } from "@/services/api";
import * as DocumentPicker from "expo-document-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  CheckCircle,
  ChevronRight,
  ClipboardList,
  FileText,
  FolderOpen,
  Link,
  Video,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
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

// ─── Types ─────────────────────────────────────────────────────────────────────
type Tab = "video" | "exam" | "file";

const TAB_CONFIG: Record<
  Tab,
  { label: string; color: string; lightColor: string; apiType: string }
> = {
  video: {
    label: "رابط الفيديو",
    color: "#165072",
    lightColor: "#E8F4FB",
    apiType: "video",
  },
  exam: {
    label: "رابط الامتحان",
    color: "#27C840",
    lightColor: "#E8FBE8",
    apiType: "exam_link",
  },
  file: {
    label: "رفع ملف",
    color: "#E8A020",
    lightColor: "#FEF3DC",
    apiType: "pdf",
  },
};

// ─── Screen ────────────────────────────────────────────────────────────────────
export default function AddContentScreen() {
  const router = useRouter();
  const { lessonId, subject } = useLocalSearchParams<{
    lessonId: string;
    subject: string;
  }>();

  const [activeTab, setActiveTab] = useState<Tab>("video");
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [fileMode, setFileMode] = useState<"upload" | "link">("upload");
  const [pickedFileName, setPickedFileName] = useState<string | null>(null);
  const [pickedFileUri, setPickedFileUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const cfg = TAB_CONFIG[activeTab];

  const resetForm = () => {
    setName("");
    setLink("");
    setFileMode("upload");
    setPickedFileName(null);
    setPickedFileUri(null);
    setSaved(false);
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    resetForm();
  };

  const handlePickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/vnd.ms-powerpoint",
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        ],
        copyToCacheDirectory: true,
      });
      if (result.canceled) return;
      const file = result.assets[0];
      setPickedFileName(file.name);
      setPickedFileUri(file.uri);
      if (!name) setName(file.name.replace(/\.[^/.]+$/, ""));
    } catch {
      Alert.alert("خطأ", "تعذر اختيار الملف");
    }
  };

  const isValid = () => {
    if (activeTab === "file" && fileMode === "upload") return !!pickedFileUri;
    return link.trim().length > 0;
  };

  const handleSave = async () => {
    if (!isValid()) return;
    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("class_session_id", lessonId!);
      formData.append("important", "0");
      if (name.trim()) formData.append("name", name.trim());

      if (activeTab === "file" && fileMode === "upload" && pickedFileUri) {
        formData.append("type", "pdf");
        formData.append("file", {
          uri: pickedFileUri,
          name: pickedFileName ?? "file",
          type: "application/octet-stream",
        } as any);
      } else {
        formData.append("type", cfg.apiType);
        formData.append("link", link.trim());
        if (activeTab === "video") {
          formData.append("video_source", "manual");
        }
      }

      await api.post(API_ENDPOINTS.CONTENTS.ADD, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSaved(true);
      setTimeout(() => {
        router.replace({
          pathname: "/session-content",
          params: { lessonId, subject },
        });
      }, 900);
    } catch (err) {
      Alert.alert("خطأ", normalizeError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ width: 38 }} />
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>إضافة محتوى</Text>
          {subject ? (
            <Text style={styles.headerSub} numberOfLines={1}>
              {subject}
            </Text>
          ) : null}
        </View>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronRight size={22} color="#165072" />
        </TouchableOpacity>
      </View>

      {/* Tab selector */}
      <View style={styles.tabRow}>
        {(["video", "exam", "file"] as Tab[]).map((tab) => {
          const tabCfg = TAB_CONFIG[tab];
          const isActive = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tabBtn,
                isActive && {
                  backgroundColor: tabCfg.color,
                  borderColor: tabCfg.color,
                },
              ]}
              onPress={() => handleTabChange(tab)}
              activeOpacity={0.8}
            >
              {tab === "video" && (
                <Video size={15} color={isActive ? "#fff" : "#888"} />
              )}
              {tab === "exam" && (
                <ClipboardList size={15} color={isActive ? "#fff" : "#888"} />
              )}
              {tab === "file" && (
                <FileText size={15} color={isActive ? "#fff" : "#888"} />
              )}
              <Text
                style={[styles.tabBtnText, isActive && styles.tabBtnTextActive]}
              >
                {tabCfg.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.body}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Content card */}
          <View style={[styles.card, { borderTopColor: cfg.color }]}>
            {/* Card header */}
            <View
              style={[styles.cardHeader, { backgroundColor: cfg.lightColor }]}
            >
              <View
                style={[styles.cardIconCircle, { backgroundColor: cfg.color }]}
              >
                {activeTab === "video" && <Video size={20} color="#fff" />}
                {activeTab === "exam" && (
                  <ClipboardList size={20} color="#fff" />
                )}
                {activeTab === "file" && <FileText size={20} color="#fff" />}
              </View>
              <View style={styles.cardHeaderText}>
                <Text style={[styles.cardTitle, { color: cfg.color }]}>
                  {cfg.label}
                </Text>
                <Text style={styles.cardSub}>
                  {activeTab === "video" &&
                    "أضف رابط فيديو من يوتيوب أو أي منصة"}
                  {activeTab === "exam" &&
                    "أضف رابط امتحان من Google Forms أو غيرها"}
                  {activeTab === "file" && "ارفع ملف PDF أو Word أو PowerPoint"}
                </Text>
              </View>
            </View>

            <View style={styles.cardBody}>
              {/* Name field — shared */}
              <Text style={styles.label}>الاسم (اختياري)</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="أدخل اسم المحتوى"
                placeholderTextColor={Colors.textPlaceholder}
                textAlign="right"
              />

              {/* Video tab */}
              {activeTab === "video" && (
                <>
                  <Text style={styles.label}>رابط الفيديو *</Text>
                  <View style={styles.inputRow}>
                    <TextInput
                      style={[styles.input, styles.inputFlex]}
                      value={link}
                      onChangeText={setLink}
                      placeholder="https://youtube.com/..."
                      placeholderTextColor={Colors.textPlaceholder}
                      keyboardType="url"
                      autoCapitalize="none"
                      textAlign="right"
                    />
                    <View
                      style={[styles.inputIcon, { backgroundColor: "#E8F4FB" }]}
                    >
                      <Link size={18} color="#165072" />
                    </View>
                  </View>
                  <Text style={styles.hint}>
                    يدعم يوتيوب، فيميو، أو أي رابط مباشر
                  </Text>
                </>
              )}

              {/* Exam tab */}
              {activeTab === "exam" && (
                <>
                  <Text style={styles.label}>رابط الامتحان *</Text>
                  <View style={styles.inputRow}>
                    <TextInput
                      style={[styles.input, styles.inputFlex]}
                      value={link}
                      onChangeText={setLink}
                      placeholder="https://forms.google.com/..."
                      placeholderTextColor={Colors.textPlaceholder}
                      keyboardType="url"
                      autoCapitalize="none"
                      textAlign="right"
                    />
                    <View
                      style={[styles.inputIcon, { backgroundColor: "#E8FBE8" }]}
                    >
                      <ClipboardList size={18} color="#27C840" />
                    </View>
                  </View>
                  <Text style={styles.hint}>
                    Google Forms، Microsoft Forms، أو أي منصة امتحانات
                  </Text>
                </>
              )}

              {/* File tab */}
              {activeTab === "file" && (
                <>
                  {/* Mode toggle */}
                  <View style={styles.modeToggle}>
                    <TouchableOpacity
                      style={[
                        styles.modeBtn,
                        fileMode === "upload" && {
                          backgroundColor: "#E8A020",
                          borderColor: "#E8A020",
                        },
                      ]}
                      onPress={() => {
                        setFileMode("upload");
                        setLink("");
                      }}
                      activeOpacity={0.8}
                    >
                      <FolderOpen
                        size={14}
                        color={fileMode === "upload" ? "#fff" : "#888"}
                      />
                      <Text
                        style={[
                          styles.modeBtnText,
                          fileMode === "upload" && styles.modeBtnTextActive,
                        ]}
                      >
                        رفع من الجهاز
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.modeBtn,
                        fileMode === "link" && {
                          backgroundColor: "#E8A020",
                          borderColor: "#E8A020",
                        },
                      ]}
                      onPress={() => {
                        setFileMode("link");
                        setPickedFileName(null);
                        setPickedFileUri(null);
                      }}
                      activeOpacity={0.8}
                    >
                      <Link
                        size={14}
                        color={fileMode === "link" ? "#fff" : "#888"}
                      />
                      <Text
                        style={[
                          styles.modeBtnText,
                          fileMode === "link" && styles.modeBtnTextActive,
                        ]}
                      >
                        رابط مباشر
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {fileMode === "upload" ? (
                    <TouchableOpacity
                      style={[
                        styles.uploadBox,
                        pickedFileName && styles.uploadBoxDone,
                      ]}
                      onPress={handlePickFile}
                      activeOpacity={0.8}
                    >
                      {pickedFileName ? (
                        <>
                          <View style={styles.filePickedIcon}>
                            <FileText size={28} color="#E8A020" />
                          </View>
                          <Text style={styles.filePickedName} numberOfLines={2}>
                            {pickedFileName}
                          </Text>
                          <Text style={styles.filePickedHint}>
                            اضغط لتغيير الملف
                          </Text>
                        </>
                      ) : (
                        <>
                          <View style={styles.uploadIconCircle}>
                            <FolderOpen size={32} color="#E8A020" />
                          </View>
                          <Text style={styles.uploadTitle}>
                            اضغط لاختيار ملف
                          </Text>
                          <Text style={styles.uploadSub}>
                            PDF • Word • PowerPoint
                          </Text>
                        </>
                      )}
                    </TouchableOpacity>
                  ) : (
                    <>
                      <Text style={styles.label}>رابط الملف *</Text>
                      <View style={styles.inputRow}>
                        <TextInput
                          style={[styles.input, styles.inputFlex]}
                          value={link}
                          onChangeText={setLink}
                          placeholder="https://drive.google.com/..."
                          placeholderTextColor={Colors.textPlaceholder}
                          keyboardType="url"
                          autoCapitalize="none"
                          textAlign="right"
                        />
                        <View
                          style={[
                            styles.inputIcon,
                            { backgroundColor: "#FEF3DC" },
                          ]}
                        >
                          <Link size={18} color="#E8A020" />
                        </View>
                      </View>
                      <Text style={styles.hint}>
                        Google Drive، Dropbox، أو أي رابط تحميل مباشر
                      </Text>
                    </>
                  )}
                </>
              )}
            </View>
          </View>

          {/* Save button */}
          <TouchableOpacity
            style={[
              styles.saveBtn,
              { backgroundColor: cfg.color },
              (!isValid() || isLoading || saved) && styles.saveBtnDisabled,
            ]}
            activeOpacity={0.85}
            onPress={handleSave}
            disabled={!isValid() || isLoading || saved}
          >
            {saved ? (
              <View style={styles.savedRow}>
                <CheckCircle size={20} color="#fff" />
                <Text style={styles.saveBtnText}>تم الحفظ!</Text>
              </View>
            ) : isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveBtnText}>حفظ المحتوى</Text>
            )}
          </TouchableOpacity>

          <View style={{ height: 32 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F7F8FA" },
  flex: { flex: 1 },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: { alignItems: "center", flex: 1 },
  headerTitle: {
    fontSize: 16,
    fontFamily: "Alex_700",
    color: "#111",
  },
  headerSub: {
    fontSize: 11,
    fontFamily: "Alex_400",
    color: Colors.textSecondary,
    marginTop: 2,
  },

  // Tabs
  tabRow: {
    flexDirection: "row-reverse",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 8,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  tabBtn: {
    flex: 1,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingVertical: 10,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FBFBFB",
  },
  tabBtnText: {
    fontSize: 11,
    fontFamily: "Alex_600",
    color: "#888",
  },
  tabBtnTextActive: { color: "#fff" },

  // Body
  body: { padding: 16, flexGrow: 1 },

  // Card
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    // borderTopWidth: 4,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  cardIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  cardHeaderText: { flex: 1, alignItems: "flex-end" },
  cardTitle: { fontSize: 15, fontFamily: "Alex_700" },
  cardSub: {
    fontSize: 11,
    fontFamily: "Alex_400",
    color: Colors.textSecondary,
    marginTop: 2,
    textAlign: "right",
  },
  cardBody: { paddingHorizontal: 18, paddingBottom: 20 },

  // Form
  label: {
    fontSize: 13,
    fontFamily: "Alex_600",
    color: "#333",
    textAlign: "right",
    marginBottom: 8,
    marginTop: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 14,
    fontFamily: "Alex_400",
    color: "#111",
    backgroundColor: "#FBFBFB",
    marginBottom: 10,
  },
  inputFlex: { flex: 1, marginBottom: 0, borderRadius: 0, borderRightWidth: 0 },
  inputRow: {
    flexDirection: "row-reverse",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 10,
    backgroundColor: "#FBFBFB",
  },
  inputIcon: {
    width: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  hint: {
    fontSize: 11,
    fontFamily: "Alex_400",
    color: Colors.textSecondary,
    textAlign: "right",
    marginBottom: 4,
  },

  // File mode toggle
  modeToggle: {
    flexDirection: "row-reverse",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
    marginBottom: 14,
  },
  modeBtn: {
    flex: 1,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 11,
    backgroundColor: "#F9FAFB",
    borderWidth: 0,
    borderColor: "transparent",
  },
  modeBtnText: { fontSize: 12, fontFamily: "Alex_500", color: "#666" },
  modeBtnTextActive: { color: "#fff" },

  // Upload box
  uploadBox: {
    borderWidth: 1.5,
    borderColor: "#E8A020",
    borderStyle: "dashed",
    borderRadius: 16,
    paddingVertical: 36,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#FFFBF2",
    marginBottom: 10,
  },
  uploadBoxDone: {
    borderStyle: "solid",
    backgroundColor: "#FEF3DC",
  },
  uploadIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FEF3DC",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  uploadTitle: {
    fontSize: 14,
    fontFamily: "Alex_600",
    color: "#E8A020",
  },
  uploadSub: {
    fontSize: 11,
    fontFamily: "Alex_400",
    color: Colors.textSecondary,
  },
  filePickedIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  filePickedName: {
    fontSize: 13,
    fontFamily: "Alex_600",
    color: "#333",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  filePickedHint: {
    fontSize: 11,
    fontFamily: "Alex_400",
    color: Colors.textSecondary,
    marginTop: 4,
  },

  // Save button
  saveBtn: {
    height: 54,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  saveBtnDisabled: { opacity: 0.5, elevation: 0 },
  saveBtnText: { fontSize: 16, fontFamily: "Alex_700", color: "#fff" },
  savedRow: { flexDirection: "row", alignItems: "center", gap: 8 },
});
