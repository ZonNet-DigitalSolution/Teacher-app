import { API_ENDPOINTS } from "@/constants/endpoints";
import { api } from "@/services/api";
import Constants from "expo-constants";
import * as Device from "expo-device";
import type * as NotificationsType from "expo-notifications";
import type { ImperativeRouter } from "expo-router";
import { Platform } from "react-native";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const N = (): typeof NotificationsType => require("expo-notifications");

// ─── Constants ────────────────────────────────────────────────────────────────

const CHANNEL_ID = "private_sessions";
const PRIVATE_SESSION_ACTIONS = new Set([
  "new_booking",
  "teacher_assigned",
  "trial_request_new",
  "test_push",
]);

// ─── Types ────────────────────────────────────────────────────────────────────

export type TestPushResponse = {
  success?: boolean;
  message?: string;
  data?: { device_count?: number; sent_count?: number };
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isExpoGo(): boolean {
  return Constants.appOwnership === "expo";
}

function getProjectId(): string | undefined {
  const extra = Constants.expoConfig?.extra as { eas?: { projectId?: string } } | undefined;
  return Constants.easConfig?.projectId ?? extra?.eas?.projectId;
}

function getAppVersion(): string {
  return Constants.expoConfig?.version ?? "1.0.0";
}

function shouldOpenPrivateSessions(data: Record<string, unknown>): boolean {
  const actionType = (data.action_type ?? data.actionType ?? data.action) as string | undefined;
  return (
    data.type === "private_session" &&
    !!actionType &&
    PRIVATE_SESSION_ACTIONS.has(actionType)
  );
}

async function ensurePrivateSessionsChannel(): Promise<void> {
  if (Platform.OS !== "android") return;
  await N().setNotificationChannelAsync(CHANNEL_ID, {
    name: "Private sessions",
    importance: N().AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: "#D18C2D",
  });
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function configureForegroundNotifications(): void {
  if (isExpoGo()) return;
  N().setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
}

export async function registerForPushNotifications(): Promise<string | null> {
  if (isExpoGo()) return null;

  await ensurePrivateSessionsChannel();

  const { status: currentStatus } = await N().getPermissionsAsync();
  const finalStatus =
    currentStatus === "granted"
      ? currentStatus
      : (await N().requestPermissionsAsync()).status;

  if (finalStatus !== "granted") return null;

  const projectId = getProjectId();
  if (!projectId) return null;

  const { data: expoPushToken } = await N().getExpoPushTokenAsync({ projectId });

  await api.post(API_ENDPOINTS.NOTIFICATIONS.REGISTER_DEVICE, {
    fcm_token: expoPushToken,
    device_type: Platform.OS === "ios" ? "ios" : "android",
    device_name: Device.deviceName ?? Device.modelName ?? "Teacher device",
    platform_version: Device.osVersion ?? String(Platform.Version),
    app_version: getAppVersion(),
  });

  return expoPushToken;
}

export function registerNotificationResponseHandler(
  router: ImperativeRouter,
): () => void {
  if (isExpoGo()) return () => undefined;

  const subscription = N().addNotificationResponseReceivedListener((response) => {
    const data = (response.notification.request.content.data ?? {}) as Record<string, unknown>;
    if (shouldOpenPrivateSessions(data)) {
      router.push("/(tabs)/private?tab=new");
    }
  });

  return () => subscription.remove();
}

export async function sendTestPushNotification(): Promise<TestPushResponse> {
  await registerForPushNotifications();

  const { data } = await api.post<TestPushResponse>(API_ENDPOINTS.NOTIFICATIONS.TEST_PUSH, {
    title: "اختبار إشعار",
    body: "ده إشعار تجربة على موبايل المدرس",
  });

  return data;
}
