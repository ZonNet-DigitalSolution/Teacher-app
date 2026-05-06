import {
  CalendarIcon,
  LobbyClockIcon,
  LobbyStudentsIcon,
} from "@/components/MeetingLobby/SessionIcons";
import { SessionInfoCard } from "@/components/MeetingLobby/SessionInfoCard";
import { Colors } from "@/constants/colors";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useMemo } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function MeetingLobbyScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    subject?: string;
    date?: string;
    time?: string;
    group?: string;
    lessonId?: string;
  }>();

  const session = useMemo(
    () => ({
      subject: params.subject ?? "الحصة",
      date: params.date ?? "—",
      time: params.time ?? "—",
      group: params.group ?? "—",
      lessonId: params.lessonId ?? "0",
    }),
    [params],
  );

  const infoRows = useMemo(
    () => [
      { icon: <CalendarIcon />, label: "التاريخ", value: session.date },
      { icon: <LobbyClockIcon />, label: "الوقت", value: session.time },
      { icon: <LobbyStudentsIcon />, label: "المجموعة", value: session.group },
    ],
    [session],
  );

  const handleJoin = useCallback(() => {
    router.replace({
      pathname: "/meeting-room",
      params: {
        subject: session.subject,
        date: session.date,
        time: session.time,
        lessonId: session.lessonId,
      },
    });
  }, [router, session]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.center}>
        <View style={styles.header}>
          <Image
            source={require("@/assets/images/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <Image
          source={require("@/assets/images/lobby-books.png")}
          style={styles.illustration}
          resizeMode="contain"
        />
        <SessionInfoCard subject={session.subject} rows={infoRows} />
      </View>

      <TouchableOpacity
        style={styles.joinBtn}
        onPress={handleJoin}
        activeOpacity={0.85}
      >
        <Text style={styles.joinText}>انضم للدرس</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F6F6F6" },
  header: {
    paddingBottom: 40,
    marginTop: -40,
  },
  logo: { height: 100 },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  illustration: {
    width: 90,
    height: 90,
    marginBottom: -30,
    zIndex: 4,
  },
  joinBtn: {
    marginHorizontal: 24,
    marginBottom: 32,
    backgroundColor: Colors.primary,
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: "center",
  },
  joinText: {
    fontFamily: "Alex_700",
    fontSize: 16,
    color: "#fff",
  },
});
