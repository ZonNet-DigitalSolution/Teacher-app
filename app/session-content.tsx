import { API_ENDPOINTS } from "@/constants/endpoints";
import { api, normalizeError } from "@/services/api";
import * as DocumentPicker from "expo-document-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ChevronRight,
  ClipboardList,
  ExternalLink,
  FileText,
  FolderOpen,
  Info,
  Link,
  Pencil,
  Play,
  Trash2,
  Video,
} from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Types ────────────────────────────────────────────────────────────────────

type ContentType = "video" | "pdf" | "file" | "exam_link";
type VideoType = "recording" | "manual_link";
type Tab = "videos" | "files" | "exams";

type Recording = {
  id: string;
  name: string;
  date: string | null;
  duration: number | null;
  play_url: string | null;
  download_url: string | null;
  source: "zamn" | "zon-net" | "live";
};

type Content = {
  id: number;
  name: string | null;
  link: string;
  type: ContentType;
  important?: boolean;
  video_source?: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getName(content: Content, index: number): string {
  if (content.name) return content.name;
  if (content.type === "video") return `فيديو الجلسة ${index + 1}`;
  if (content.type === "exam_link") return `رابط الامتحان ${index + 1}`;
  return `ملف ${index + 1}`;
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function SessionContentScreen() {
  const router = useRouter();
  const { lessonId, subject } = useLocalSearchParams<{
    lessonId: string;
    subject: string;
  }>();

  const [contents, setContents] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("videos");
  const [selectedVideo, setSelectedVideo] = useState<Content | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<Content | null>(null);
  const [editName, setEditName] = useState("");
  const [editLink, setEditLink] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [addType, setAddType] = useState<ContentType | null>(null);
  const [addName, setAddName] = useState("");
  const [addLink, setAddLink] = useState("");
  const [addVideoType, setAddVideoType] = useState<VideoType>("manual_link");
  const [addSelectedRecording, setAddSelectedRecording] =
    useState<Recording | null>(null);
  const [addFileMode, setAddFileMode] = useState<"link" | "upload">("link");
  const [pickedFileName, setPickedFileName] = useState<string | null>(null);
  const [pickedFileUri, setPickedFileUri] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [recordings, setRecordings] = useState<Recording[]>([]);

  const videos = contents.filter((c) => c.type === "video");
  const files = contents.filter((c) => c.type === "pdf" || c.type === "file");
  const exams = contents.filter((c) => c.type === "exam_link");

  const fetchContents = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { data } = await api.get<{ data: Content[] }>(
        API_ENDPOINTS.CONTENTS.BY_SESSION + lessonId,
      );
      const raw = data.data ?? (data as any);
      const list: Content[] = Array.isArray(raw) ? raw : [];
      setContents(list);
      setSelectedVideo(list.find((c) => c.type === "video") ?? null);
    } catch (err) {
      setError(normalizeError(err));
    } finally {
      setIsLoading(false);
    }
  }, [lessonId]);

  const fetchRecordings = useCallback(async () => {
    try {
      const { data } = await api.get<{ data: Recording[] }>(
        API_ENDPOINTS.CONTENTS.RECORDINGS,
      );
      const list = data.data ?? (data as any);
      setRecordings(Array.isArray(list) ? list : []);
    } catch {
      // non-critical — recordings list just stays empty
    }
  }, []);

  useEffect(() => {
    fetchContents();
    fetchRecordings();
  }, [fetchContents, fetchRecordings]);

  const handleDelete = (content: Content) => {
    Alert.alert("حذف المحتوى", `هل تريد حذف "${getName(content, 0)}"؟`, [
      { text: "إلغاء", style: "cancel" },
      {
        text: "حذف",
        style: "destructive",
        onPress: async () => {
          try {
            setDeletingId(content.id);
            await api.delete(API_ENDPOINTS.CONTENTS.DELETE + content.id);
            setContents((prev) => prev.filter((c) => c.id !== content.id));
            if (selectedVideo?.id === content.id) {
              setSelectedVideo(videos.find((v) => v.id !== content.id) ?? null);
            }
          } catch (err) {
            Alert.alert("خطأ", normalizeError(err));
          } finally {
            setDeletingId(null);
          }
        },
      },
    ]);
  };

  const handleEdit = (content: Content) => {
    setEditingItem(content);
    setEditName(content.name ?? "");
    setEditLink(content.link);
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;
    try {
      setIsSaving(true);
      await api.put(API_ENDPOINTS.CONTENTS.UPDATE + editingItem.id, {
        name: editName || null,
        link: editLink,
        type: editingItem.type,
        important: editingItem.important ?? false,
      });
      setContents((prev) =>
        prev.map((c) =>
          c.id === editingItem.id
            ? { ...c, name: editName || null, link: editLink }
            : c,
        ),
      );
      if (selectedVideo?.id === editingItem.id) {
        setSelectedVideo((v) =>
          v ? { ...v, name: editName || null, link: editLink } : v,
        );
      }
      setEditingItem(null);
    } catch (err) {
      Alert.alert("خطأ", normalizeError(err));
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenAdd = (type: ContentType) => {
    setAddType(type);
    setAddName("");
    setAddLink("");
    setAddVideoType("manual_link");
    setAddSelectedRecording(null);
    setAddFileMode("link");
    setPickedFileName(null);
    setPickedFileUri(null);
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
      setAddName((prev) => prev || file.name.replace(/\.[^/.]+$/, ""));
    } catch {
      Alert.alert("خطأ", "تعذر اختيار الملف");
    }
  };

  const handleSaveAdd = async () => {
    if (!addType) return;
    try {
      setIsAdding(true);

      const formData = new FormData();
      formData.append("class_session_id", lessonId!);
      formData.append("important", "0");
      formData.append("name", addName.trim());

      if (addType === "file" && addFileMode === "upload" && pickedFileUri) {
        formData.append("type", "pdf");
        formData.append("file", {
          uri: pickedFileUri,
          name: pickedFileName ?? "file",
          type: "application/octet-stream",
        } as any);
      } else {
        if (!addLink.trim()) {
          Alert.alert("خطأ", "الرابط مطلوب");
          return;
        }
        formData.append("type", addType);
        formData.append("link", addLink.trim());
        if (addType === "video") {
          formData.append(
            "video_source",
            addVideoType === "recording" && addSelectedRecording
              ? addSelectedRecording.source
              : "manual",
          );
        }
      }

      const res = await api.post<{ data: Content }>(
        API_ENDPOINTS.CONTENTS.ADD,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      const newItem: Content = res.data.data ?? (res.data as any);
      setContents((prev) => [...prev, newItem]);
      if (addType === "video" && !selectedVideo) setSelectedVideo(newItem);
      setAddType(null);
    } catch (err) {
      Alert.alert("خطأ", normalizeError(err));
    } finally {
      setIsAdding(false);
    }
  };

  const openLink = (url: string) => {
    if (!url) return;
    Linking.openURL(url).catch(() => Alert.alert("خطأ", "تعذر فتح الرابط"));
  };

  return (
    <SafeAreaView style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ width: 38 }} />
        <Text style={styles.headerTitle}>{subject ?? "محتوى الجلسة"}</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronRight size={22} color="#165072" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#165072" />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={fetchContents}>
            <Text style={styles.retryText}>إعادة المحاولة</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Video Player */}
          <View style={styles.playerBox}>
            {selectedVideo ? (
              <TouchableOpacity
                style={styles.playerPlaceholder}
                activeOpacity={0.85}
                onPress={() => openLink(selectedVideo.link)}
              >
                <View style={styles.playCircle}>
                  <Play size={32} color="#fff" fill="#fff" />
                </View>
                <Text style={styles.playerHint}>اضغط لفتح الفيديو</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.playerPlaceholder}>
                <Video size={48} color="#aaa" />
                <Text style={styles.playerHint}>لا يوجد فيديو متاح</Text>
              </View>
            )}
          </View>

          {/* Video title + open button */}
          {selectedVideo && (
            <View style={styles.videoMeta}>
              <TouchableOpacity
                style={styles.openBtn}
                activeOpacity={0.85}
                onPress={() => openLink(selectedVideo.link)}
              >
                <ExternalLink size={14} color="#fff" />
                <Text style={styles.openBtnText}>فتح في نافذة جديدة</Text>
              </TouchableOpacity>
              <Text style={styles.videoName}>{getName(selectedVideo, 0)}</Text>
            </View>
          )}

          {/* Tabs */}
          <View style={styles.tabs}>
            {(
              [
                {
                  key: "videos" as Tab,
                  label: "الفيديوهات",
                  count: videos.length,
                  icon: <Video size={20} color="#fff" />,
                },
                {
                  key: "files" as Tab,
                  label: "الملفات",
                  count: files.length,
                  icon: <FileText size={20} color="#fff" />,
                },
                {
                  key: "exams" as Tab,
                  label: "الامتحانات",
                  count: exams.length,
                  icon: <ClipboardList size={20} color="#fff" />,
                },
              ] as const
            ).map((tab) => (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tab, activeTab === tab.key && styles.tabActive]}
                onPress={() => setActiveTab(tab.key)}
                activeOpacity={0.8}
              >
                <View style={styles.tabIconCircle}>{tab.icon}</View>
                <Text style={styles.tabLabel}>{tab.label}</Text>
                <Text style={styles.tabCount}>({tab.count})</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tab Content */}
          <View style={styles.listSection}>
            {activeTab === "videos" && (
              <>
                <View style={styles.sectionRow}>
                  <TouchableOpacity
                    style={styles.addBtn}
                    activeOpacity={0.8}
                    onPress={() => handleOpenAdd("video")}
                  >
                    <Play size={13} color="#fff" fill="#fff" />
                    <Text style={styles.addBtnText}>إضافة فيديو</Text>
                  </TouchableOpacity>
                  <Text style={styles.sectionTitle}>فيديوهات الجلسة</Text>
                </View>
                {videos.length === 0 ? (
                  <EmptyState label="لا توجد فيديوهات" />
                ) : (
                  videos.map((item, i) => (
                    <View
                      key={item.id}
                      style={[
                        styles.listItem,
                        selectedVideo?.id === item.id && styles.listItemActive,
                      ]}
                    >
                      <TouchableOpacity
                        style={styles.listIconCircle}
                        onPress={() => setSelectedVideo(item)}
                        activeOpacity={0.8}
                      >
                        {deletingId === item.id ? (
                          <ActivityIndicator size="small" color="#165072" />
                        ) : (
                          <Play size={18} color="#165072" fill="#165072" />
                        )}
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.listBody}
                        onPress={() => setSelectedVideo(item)}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.listTitle}>فيديو {i + 1}</Text>
                        <Text style={styles.listSub}>{getName(item, i)}</Text>
                      </TouchableOpacity>
                      <View style={styles.actions}>
                        <TouchableOpacity
                          style={styles.editBtn}
                          onPress={() => handleEdit(item)}
                          activeOpacity={0.7}
                        >
                          <Pencil size={14} color="#E8A020" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.deleteBtn}
                          onPress={() => handleDelete(item)}
                          activeOpacity={0.7}
                        >
                          <Trash2 size={14} color="#DC2626" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))
                )}
              </>
            )}

            {activeTab === "files" && (
              <>
                <View style={styles.sectionRow}>
                  <TouchableOpacity
                    style={[styles.addBtn, styles.addBtnFile]}
                    activeOpacity={0.8}
                    onPress={() => handleOpenAdd("file")}
                  >
                    <FileText size={13} color="#fff" />
                    <Text style={styles.addBtnText}>إضافة ملف</Text>
                  </TouchableOpacity>
                  <Text style={styles.sectionTitle}>ملفات الجلسة</Text>
                </View>
                {files.length === 0 ? (
                  <EmptyState label="لا توجد ملفات" />
                ) : (
                  files.map((item, i) => (
                    <View key={item.id} style={styles.listItem}>
                      <View style={styles.listIconCircle}>
                        {deletingId === item.id ? (
                          <ActivityIndicator size="small" color="#165072" />
                        ) : (
                          <FileText size={18} color="#0088FF" />
                        )}
                      </View>
                      <TouchableOpacity
                        style={styles.listBody}
                        onPress={() => openLink(item.link)}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.listTitle}>{getName(item, i)}</Text>
                        <Text style={styles.listSub}>PDF</Text>
                      </TouchableOpacity>
                      <View style={styles.actions}>
                        <TouchableOpacity
                          style={styles.previewBtn}
                          onPress={() => openLink(item.link)}
                          activeOpacity={0.7}
                        >
                          <ExternalLink size={14} color="#165072" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.editBtn}
                          onPress={() => handleEdit(item)}
                          activeOpacity={0.7}
                        >
                          <Pencil size={14} color="#E8A020" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.deleteBtn}
                          onPress={() => handleDelete(item)}
                          activeOpacity={0.7}
                        >
                          <Trash2 size={14} color="#DC2626" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))
                )}
              </>
            )}

            {activeTab === "exams" && (
              <>
                <View style={styles.sectionRow}>
                  <TouchableOpacity
                    style={[styles.addBtn, styles.addBtnExam]}
                    activeOpacity={0.8}
                    onPress={() => handleOpenAdd("exam_link")}
                  >
                    <ClipboardList size={13} color="#fff" />
                    <Text style={styles.addBtnText}>إضافة امتحان</Text>
                  </TouchableOpacity>
                  <Text style={styles.sectionTitle}>روابط الامتحانات</Text>
                </View>
                {exams.length === 0 ? (
                  <EmptyState label="لا توجد امتحانات" />
                ) : (
                  exams.map((item, i) => (
                    <View key={item.id} style={styles.listItem}>
                      <View style={styles.listIconCircle}>
                        {deletingId === item.id ? (
                          <ActivityIndicator size="small" color="#165072" />
                        ) : (
                          <ClipboardList size={18} color="#27C840" />
                        )}
                      </View>
                      <TouchableOpacity
                        style={styles.listBody}
                        onPress={() => openLink(item.link)}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.listTitle}>امتحان {i + 1}</Text>
                        <Text style={styles.listSub}>رابط خارجي</Text>
                      </TouchableOpacity>
                      <View style={styles.actions}>
                        <TouchableOpacity
                          style={styles.previewBtn}
                          onPress={() => openLink(item.link)}
                          activeOpacity={0.7}
                        >
                          <ExternalLink size={14} color="#165072" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.editBtn}
                          onPress={() => handleEdit(item)}
                          activeOpacity={0.7}
                        >
                          <Pencil size={14} color="#E8A020" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.deleteBtn}
                          onPress={() => handleDelete(item)}
                          activeOpacity={0.7}
                        >
                          <Trash2 size={14} color="#DC2626" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))
                )}
              </>
            )}
          </View>

          {/* Quick Info Card */}
          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <Info size={16} color="#fff" />
              <Text style={styles.infoHeaderText}>معلومات سريعة</Text>
            </View>
            <View style={styles.infoRow}>
              <InfoStat
                icon={<Video size={22} color="#fff" />}
                count={videos.length}
                label="فيديو"
              />
              <InfoStat
                icon={<FileText size={22} color="#fff" />}
                count={files.length}
                label="ملف"
              />
              <InfoStat
                icon={<ClipboardList size={22} color="#fff" />}
                count={exams.length}
                label="امتحان"
              />
            </View>
          </View>

          <View style={{ height: 32 }} />
        </ScrollView>
      )}

      {/* Add Modal */}
      <Modal
        visible={!!addType}
        transparent
        animationType="fade"
        onRequestClose={() => setAddType(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              {addType === "video"
                ? "إضافة فيديو"
                : addType === "exam_link"
                  ? "إضافة امتحان"
                  : "إضافة ملف"}
            </Text>

            <Text style={styles.modalLabel}>الاسم (اختياري)</Text>
            <TextInput
              style={styles.modalInput}
              value={addName}
              onChangeText={setAddName}
              placeholder="اسم المحتوى"
              textAlign="right"
            />

            {addType === "file" || addType === "pdf" ? (
              <>
                {/* Toggle: link vs upload */}
                <View style={styles.modeToggle}>
                  <TouchableOpacity
                    style={[
                      styles.modeBtn,
                      addFileMode === "upload" && styles.modeBtnActive,
                    ]}
                    onPress={() => {
                      setAddFileMode("upload");
                      setAddLink("");
                      setPickedFileName(null);
                    }}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.modeBtnText,
                        addFileMode === "upload" && styles.modeBtnTextActive,
                      ]}
                    >
                      رفع ملف
                    </Text>
                    <FolderOpen
                      size={14}
                      color={addFileMode === "upload" ? "#fff" : "#555"}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.modeBtn,
                      addFileMode === "link" && styles.modeBtnActive,
                    ]}
                    onPress={() => {
                      setAddFileMode("link");
                      setAddLink("");
                      setPickedFileName(null);
                    }}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.modeBtnText,
                        addFileMode === "link" && styles.modeBtnTextActive,
                      ]}
                    >
                      رابط
                    </Text>
                    <Link
                      size={14}
                      color={addFileMode === "link" ? "#fff" : "#555"}
                    />
                  </TouchableOpacity>
                </View>

                {addFileMode === "upload" ? (
                  <TouchableOpacity
                    style={styles.uploadBox}
                    onPress={handlePickFile}
                    activeOpacity={0.8}
                  >
                    <FolderOpen size={28} color="#0088FF" />
                    <Text style={styles.uploadBoxText}>
                      {pickedFileName ?? "اضغط لاختيار ملف"}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <>
                    <Text style={styles.modalLabel}>رابط الملف</Text>
                    <TextInput
                      style={styles.modalInput}
                      value={addLink}
                      onChangeText={setAddLink}
                      placeholder="https://..."
                      keyboardType="url"
                      autoCapitalize="none"
                      textAlign="right"
                    />
                  </>
                )}
              </>
            ) : addType === "video" ? (
              <>
                {/* Video type toggle */}
                <View style={styles.modeToggle}>
                  <TouchableOpacity
                    style={[
                      styles.modeBtn,
                      addVideoType === "recording" && styles.modeBtnActive,
                    ]}
                    onPress={() => {
                      setAddVideoType("recording");
                      setAddLink("");
                      setAddSelectedRecording(null);
                    }}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.modeBtnText,
                        addVideoType === "recording" &&
                          styles.modeBtnTextActive,
                      ]}
                    >
                      تسجيل موجود
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.modeBtn,
                      addVideoType === "manual_link" && styles.modeBtnActive,
                    ]}
                    onPress={() => {
                      setAddVideoType("manual_link");
                      setAddLink("");
                      setAddSelectedRecording(null);
                    }}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.modeBtnText,
                        addVideoType === "manual_link" &&
                          styles.modeBtnTextActive,
                      ]}
                    >
                      رابط يدوي
                    </Text>
                  </TouchableOpacity>
                </View>

                {addVideoType === "recording" ? (
                  recordings.length === 0 ? (
                    <View style={styles.noRecordings}>
                      <Text style={styles.noRecordingsText}>
                        لا توجد تسجيلات متاحة
                      </Text>
                    </View>
                  ) : (
                    <ScrollView
                      style={styles.recordingsList}
                      nestedScrollEnabled
                      showsVerticalScrollIndicator={false}
                    >
                      {recordings.map((rec) => {
                        const url =
                          rec.source === "zon-net"
                            ? rec.play_url
                            : (rec.download_url ?? rec.play_url);
                        const isSelected = addSelectedRecording?.id === rec.id;
                        return (
                          <TouchableOpacity
                            key={rec.id}
                            style={[
                              styles.recordingItem,
                              isSelected && styles.recordingItemActive,
                            ]}
                            activeOpacity={0.8}
                            onPress={() => {
                              setAddSelectedRecording(rec);
                              setAddLink(url ?? "");
                            }}
                          >
                            <View style={styles.recordingInfo}>
                              <Text
                                style={styles.recordingName}
                                numberOfLines={1}
                              >
                                {rec.name}
                              </Text>
                              {rec.date && (
                                <Text style={styles.recordingMeta}>
                                  {new Date(rec.date).toLocaleDateString(
                                    "ar-EG",
                                  )}
                                  {rec.duration
                                    ? `  •  ${Math.floor(rec.duration)}د`
                                    : ""}
                                </Text>
                              )}
                            </View>
                            <View
                              style={[
                                styles.sourceBadge,
                                rec.source === "zon-net"
                                  ? styles.sourceBadgeGreen
                                  : rec.source === "live"
                                    ? styles.sourceBadgePurple
                                    : styles.sourceBadgeBlue,
                              ]}
                            >
                              <Text style={styles.sourceBadgeText}>
                                {rec.source === "zon-net"
                                  ? "Zon-Net"
                                  : rec.source === "live"
                                    ? "Live"
                                    : "ZAMN"}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>
                  )
                ) : (
                  <>
                    <Text style={styles.modalLabel}>رابط الفيديو</Text>
                    <TextInput
                      style={styles.modalInput}
                      value={addLink}
                      onChangeText={setAddLink}
                      placeholder="https://..."
                      keyboardType="url"
                      autoCapitalize="none"
                      textAlign="right"
                    />
                  </>
                )}
              </>
            ) : (
              <>
                <Text style={styles.modalLabel}>الرابط</Text>
                <TextInput
                  style={styles.modalInput}
                  value={addLink}
                  onChangeText={setAddLink}
                  placeholder="https://..."
                  keyboardType="url"
                  autoCapitalize="none"
                  textAlign="right"
                />
              </>
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setAddType(null)}
                disabled={isAdding}
              >
                <Text style={styles.modalCancelText}>إلغاء</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveBtn}
                onPress={handleSaveAdd}
                disabled={
                  isAdding ||
                  (addType === "file" && addFileMode === "upload"
                    ? !pickedFileUri
                    : !addLink.trim())
                }
                activeOpacity={0.85}
              >
                {isAdding ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.modalSaveText}>إضافة</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Modal */}
      <Modal
        visible={!!editingItem}
        transparent
        animationType="fade"
        onRequestClose={() => setEditingItem(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>تعديل المحتوى</Text>

            <Text style={styles.modalLabel}>الاسم</Text>
            <TextInput
              style={styles.modalInput}
              value={editName}
              onChangeText={setEditName}
              placeholder="اسم المحتوى"
              textAlign="right"
            />

            <Text style={styles.modalLabel}>الرابط</Text>
            <TextInput
              style={styles.modalInput}
              value={editLink}
              onChangeText={setEditLink}
              placeholder="https://..."
              keyboardType="url"
              autoCapitalize="none"
              textAlign="right"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setEditingItem(null)}
                disabled={isSaving}
              >
                <Text style={styles.modalCancelText}>إلغاء</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveBtn}
                onPress={handleSaveEdit}
                disabled={isSaving}
                activeOpacity={0.85}
              >
                {isSaving ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.modalSaveText}>حفظ</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function EmptyState({ label }: { label: string }) {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyText}>{label}</Text>
    </View>
  );
}

function InfoStat({
  icon,
  count,
  label,
}: {
  icon: React.ReactNode;
  count: number;
  label: string;
}) {
  return (
    <View style={styles.infoStat}>
      {icon}
      <Text style={styles.infoCount}>{count}</Text>
      <Text style={styles.infoLabel}>{label}</Text>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: "#165072",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontFamily: "Alex_700",
    color: "#111",
    textAlign: "center",
  },

  // Player
  playerBox: {
    marginHorizontal: "auto",
    marginTop: 12,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#1A2B38",
    justifyContent: "center",
    aspectRatio: 16 / 9,
  },
  playerPlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  playCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.4)",
  },
  playerHint: {
    fontSize: 13,
    fontFamily: "Alex_400",
    color: "rgba(255,255,255,0.7)",
  },

  // Video meta
  videoMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  videoName: {
    fontSize: 14,
    fontFamily: "Alex_600",
    color: "#111",
    textAlign: "right",
  },
  openBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#E8A020",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 24,
  },
  openBtnText: { fontSize: 12, fontFamily: "Alex_600", color: "#fff" },

  // Tabs
  tabs: {
    flexDirection: "row-reverse",
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  tab: {
    flex: 1,
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 12,
  },
  tabActive: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderStyle: "dashed",
    backgroundColor: "#f9f9f9",
  },
  tabIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#7473AA",
    alignItems: "center",
    justifyContent: "center",
  },
  tabLabel: {
    fontSize: 11,
    fontFamily: "Alex_500",
    color: "#333",
    textAlign: "right",
  },
  tabCount: { fontSize: 10, fontFamily: "Alex_400", color: "#888" },

  // List
  listSection: { paddingHorizontal: 12, paddingTop: 12 },
  sectionTitle: {
    fontSize: 13,
    fontFamily: "Alex_600",
    color: "#111",
    textAlign: "right",
  },
  listItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    gap: 12,
  },
  listItemActive: {
    borderWidth: 1.5,
    borderColor: "#E8A020",
    backgroundColor: "#FFF8EE",
  },
  listIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#B8CFDC60",
    alignItems: "center",
    justifyContent: "center",
  },
  listBody: { flex: 1, alignItems: "flex-end" },
  listTitle: { fontSize: 13, fontFamily: "Alex_600", color: "#111" },
  listSub: {
    fontSize: 11,
    fontFamily: "Alex_400",
    color: "#888",
    marginTop: 2,
  },

  // Info card
  infoCard: {
    marginHorizontal: 12,
    marginTop: 20,
    borderRadius: 16,
    backgroundColor: "#165072",
    padding: 20,
  },
  infoHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 6,
    marginBottom: 16,
  },
  infoHeaderText: { fontSize: 14, fontFamily: "Alex_600", color: "#fff" },
  infoRow: { flexDirection: "row", justifyContent: "space-around" },
  infoStat: { alignItems: "center", gap: 4 },
  infoCount: { fontSize: 22, fontFamily: "Alex_700", color: "#fff" },
  infoLabel: {
    fontSize: 12,
    fontFamily: "Alex_400",
    color: "rgba(255,255,255,0.7)",
  },

  // Section row
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  // Add buttons
  addRow: {
    flexDirection: "row-reverse",
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  addBtn: {
    // flex: 1,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#165072",
  },
  addBtnFile: { backgroundColor: "#0088FF" },
  addBtnExam: { backgroundColor: "#27C840" },
  addBtnText: { fontSize: 12, fontFamily: "Alex_600", color: "#fff" },

  // Actions
  actions: { flexDirection: "row", gap: 6 },
  previewBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    alignItems: "center",
    justifyContent: "center",
  },
  editBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFF8EE",
    borderWidth: 1,
    borderColor: "#E8A020",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    alignItems: "center",
    justifyContent: "center",
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  modalCard: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: "Alex_700",
    color: "#111",
    textAlign: "center",
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: 13,
    fontFamily: "Alex_500",
    color: "#555",
    textAlign: "right",
    marginBottom: 6,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: "Alex_400",
    color: "#111",
    backgroundColor: "#FBFBFB",
    marginBottom: 14,
  },
  modalActions: { flexDirection: "row", gap: 10, marginTop: 4 },
  modalCancelBtn: {
    flex: 1,
    height: 46,
    borderRadius: 23,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
  },
  modalCancelText: { fontSize: 14, fontFamily: "Alex_600", color: "#555" },
  modalSaveBtn: {
    flex: 1,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#165072",
    alignItems: "center",
    justifyContent: "center",
  },
  modalSaveText: { fontSize: 14, fontFamily: "Alex_600", color: "#fff" },

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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    backgroundColor: "#F9FAFB",
  },
  modeBtnActive: { backgroundColor: "#0088FF" },
  modeBtnText: { fontSize: 13, fontFamily: "Alex_500", color: "#555" },
  modeBtnTextActive: { color: "#fff" },
  uploadBox: {
    borderWidth: 1.5,
    borderColor: "#0088FF",
    borderStyle: "dashed",
    borderRadius: 12,
    paddingVertical: 28,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#EFF6FF",
    marginBottom: 14,
  },
  uploadBoxText: { fontSize: 13, fontFamily: "Alex_500", color: "#0088FF" },

  // Misc
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  errorText: {
    fontSize: 14,
    fontFamily: "Alex_400",
    color: "#DC2626",
    textAlign: "center",
  },
  retryBtn: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#165072",
  },
  retryText: { fontSize: 13, fontFamily: "Alex_600", color: "#fff" },
  empty: { alignItems: "center", paddingVertical: 40 },
  emptyText: { fontSize: 13, fontFamily: "Alex_400", color: "#aaa" },

  // Recordings picker
  recordingsList: {
    maxHeight: 220,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    marginBottom: 14,
  },
  recordingItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    gap: 8,
  },
  recordingItemActive: { backgroundColor: "#EFF6FF" },
  recordingInfo: { flex: 1, alignItems: "flex-end" },
  recordingName: {
    fontSize: 13,
    fontFamily: "Alex_500",
    color: "#111",
    textAlign: "right",
  },
  recordingMeta: {
    fontSize: 11,
    fontFamily: "Alex_400",
    color: "#888",
    marginTop: 2,
  },
  sourceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  sourceBadgeBlue: { backgroundColor: "#DBEAFE" },
  sourceBadgeGreen: { backgroundColor: "#DCFCE7" },
  sourceBadgePurple: { backgroundColor: "#EDE9FE" },
  sourceBadgeText: { fontSize: 10, fontFamily: "Alex_600", color: "#374151" },
  noRecordings: {
    paddingVertical: 24,
    alignItems: "center",
    marginBottom: 14,
  },
  noRecordingsText: { fontSize: 13, fontFamily: "Alex_400", color: "#aaa" },
});
