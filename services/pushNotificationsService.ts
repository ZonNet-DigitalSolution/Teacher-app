import { API_ENDPOINTS } from "@/constants/endpoints";
import { api } from "@/services/api";
import type { ImperativeRouter } from "expo-router";
import { Platform } from "react-native";

type NotificationData = Record<string, unknown>;
type RegisterOptions = {
  throwOnFailure?: boolean;
};

type TestPushResponse = {
  success?: boolean;
  message?: string;
  data?: {
    device_count?: number;
    sent_count?: number;
  };
};

const PRIVATE_SESSIONS_CHANNEL_ID = "private_sessions";
const PRIVATE_SESSION_ACTIONS = new Set([
  "new_booking",
  "teacher_assigned",
  "trial_request_new",
  "test_push",
]);

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

function failRegistration(message: string, options: RegisterOptions): null {
  if (__DEV__) {
    console.warn(`[push] ${message}`);
  }
  if (options.throwOnFailure) {
    throw new Error(message);
  }
  return null;
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

export async function registerForPushNotifications(
  options: RegisterOptions = {},
): Promise<string | null> {
  const Constants = await loadConstants();

  if (Constants.appOwnership === "expo") {
    return failRegistration(
      "Expo Go لا يدعم remote push notifications. استخدم Development Build.",
      options,
    );
  }

  const Notifications = await import("expo-notifications");

  const Device = await import("expo-device");
  if (!Device.isDevice) {
    return failRegistration("Push notifications تحتاج موبايل حقيقي، وليس emulator.", options);
  }

  await ensurePrivateSessionsChannel();

  const currentPermissions = await Notifications.getPermissionsAsync();
  let finalStatus = currentPermissions.status;

  if (currentPermissions.status !== "granted") {
    const requestedPermissions = await Notifications.requestPermissionsAsync();
    finalStatus = requestedPermissions.status;
  }

  if (finalStatus !== "granted") {
    return failRegistration("صلاحية الإشعارات غير مفعلة لهذا التطبيق.", options);
  }

  const projectId = getProjectId(Constants);
  if (!projectId) {
    return failRegistration("Expo projectId غير موجود في إعدادات التطبيق.", options);
  }

  const tokenResponse = await Notifications.getExpoPushTokenAsync(
    { projectId },
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

export async function sendTestPushNotification(): Promise<TestPushResponse> {
  await registerForPushNotifications({ throwOnFailure: true });

  const response = await api.post<TestPushResponse>(API_ENDPOINTS.NOTIFICATIONS.TEST_PUSH, {
    title: "اختبار إشعار",
    body: "ده إشعار تجربة على موبايل المدرس",
  });

  return response.data;
}
