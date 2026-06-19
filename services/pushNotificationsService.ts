import { API_ENDPOINTS } from "@/constants/endpoints";
import { api } from "@/services/api";
import type { ImperativeRouter } from "expo-router";
import { Platform } from "react-native";

type NotificationData = Record<string, unknown>;

const PRIVATE_SESSIONS_CHANNEL_ID = "private_sessions";
const PRIVATE_SESSION_ACTIONS = new Set(["new_booking", "teacher_assigned", "test_push"]);

async function loadConstants() {
  const constantsModule = await import("expo-constants");
  return constantsModule.default;
}

async function loadNotificationsIfSupported() {
  const Constants = await loadConstants();

  if (Constants.appOwnership === "expo") {
    if (__DEV__) {
      console.warn("[push] Expo Go does not support remote push notifications in this SDK.");
    }
    return null;
  }

  return import("expo-notifications");
}

function getProjectId(Constants: Awaited<ReturnType<typeof loadConstants>>): string | undefined {
  const extra = Constants.expoConfig?.extra as { eas?: { projectId?: string } } | undefined;
  return Constants.easConfig?.projectId ?? extra?.eas?.projectId;
}

function getAppVersion(Constants: Awaited<ReturnType<typeof loadConstants>>): string {
  return Constants.expoConfig?.version ?? "1.0.0";
}

function shouldOpenPrivateSessions(data: NotificationData): boolean {
  const type = data.type;
  const actionType = data.action_type ?? data.actionType;

  return (
    type === "private_session" &&
    typeof actionType === "string" &&
    PRIVATE_SESSION_ACTIONS.has(actionType)
  );
}

async function ensurePrivateSessionsChannel() {
  if (Platform.OS !== "android") return;

  const Notifications = await loadNotificationsIfSupported();
  if (!Notifications) return;

  await Notifications.setNotificationChannelAsync(PRIVATE_SESSIONS_CHANNEL_ID, {
    name: "Private sessions",
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: "#D18C2D",
  });
}

export async function configureForegroundNotifications(): Promise<void> {
  const Notifications = await loadNotificationsIfSupported();
  if (!Notifications) return;

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

export async function registerForPushNotifications(): Promise<string | null> {
  const Constants = await loadConstants();
  const Notifications = await loadNotificationsIfSupported();
  if (!Notifications) return null;

  const Device = await import("expo-device");
  if (!Device.isDevice) {
    if (__DEV__) {
      console.warn("[push] Push notifications require a physical device.");
    }
    return null;
  }

  await ensurePrivateSessionsChannel();

  const currentPermissions = await Notifications.getPermissionsAsync();
  let finalStatus = currentPermissions.status;

  if (currentPermissions.status !== "granted") {
    const requestedPermissions = await Notifications.requestPermissionsAsync();
    finalStatus = requestedPermissions.status;
  }

  if (finalStatus !== "granted") {
    if (__DEV__) {
      console.warn("[push] Notification permission was not granted.");
    }
    return null;
  }

  const projectId = getProjectId(Constants);
  const tokenResponse = await Notifications.getExpoPushTokenAsync(
    projectId ? { projectId } : undefined,
  );
  const expoPushToken = tokenResponse.data;

  await api.post(API_ENDPOINTS.NOTIFICATIONS.REGISTER_DEVICE, {
    fcm_token: expoPushToken,
    device_type: Platform.OS === "ios" ? "ios" : "android",
    device_name: Device.deviceName ?? Device.modelName ?? "Teacher device",
    platform_version: Device.osVersion ?? String(Platform.Version),
    app_version: getAppVersion(Constants),
  });

  return expoPushToken;
}

export async function registerNotificationResponseHandler(
  router: ImperativeRouter,
): Promise<() => void> {
  const Notifications = await loadNotificationsIfSupported();
  if (!Notifications) return () => undefined;

  const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
    const data = response.notification.request.content.data ?? {};
    if (shouldOpenPrivateSessions(data)) {
      router.push("/(tabs)/private?tab=new");
    }
  });

  return () => subscription.remove();
}

export async function sendTestPushNotification(): Promise<void> {
  await api.post(API_ENDPOINTS.NOTIFICATIONS.TEST_PUSH, {
    title: "اختبار إشعار",
    body: "ده إشعار تجربة على موبايل المدرس",
  });
}
