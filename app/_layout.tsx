import { useFonts } from "expo-font";
import {
  DarkTheme,
  DefaultTheme,
  Stack,
  ThemeProvider,
  useRouter,
  useSegments,
} from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import "react-native-reanimated";
import { Provider, useSelector } from "react-redux";
import "../global.css";

import { GlobalAlert } from "@/components/Ui/GlobalAlert";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAppDispatch } from "@/hooks/store-hooks";
import { RootState, store } from "@/store";
import { initializeAuth } from "@/store/auth";
import { showAlert } from "@/store/alert";
import { registerAlertGateway } from "@/services/alertGateway";
import {
  configureForegroundNotifications,
  registerForPushNotifications,
  registerNotificationResponseHandler,
} from "@/services/pushNotificationsService";

function logStartup(message: string, details?: unknown) {
  if (!__DEV__) return;
  if (details === undefined) {
    console.log(`[startup] ${message}`);
  } else {
    console.log(`[startup] ${message}`, details);
  }
}

function warnStartup(message: string, error?: unknown) {
  if (!__DEV__) return;
  console.warn(`[startup] ${message}`, error);
}

SplashScreen.preventAutoHideAsync()
  .then(() => logStartup("native splash auto-hide prevented"))
  .catch((error) => warnStartup("preventAutoHideAsync failed", error));

// ─── Route Guard ─────────────────────────────────────────────────────────────
function AuthGuard() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const segments = useSegments();
  const didInitializeAuth = useRef(false);

  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
  const isInitialized = useSelector((s: RootState) => s.auth.isInitialized);

  useEffect(() => {
    if (didInitializeAuth.current) return;
    didInitializeAuth.current = true;

    logStartup("auth initialization started");
    dispatch(initializeAuth())
      .unwrap()
      .then(() => logStartup("auth initialization completed"))
      .catch((error) => warnStartup("auth initialization failed; continuing unauthenticated", error));
  }, [dispatch]);

  useEffect(() => {
    if (!isInitialized) return;

    const inAuthGroup = segments[0] === "(auth)";
    logStartup("route guard evaluated", { isAuthenticated, isInitialized, segments, inAuthGroup });

    if (!isAuthenticated && !inAuthGroup) {
      logStartup("redirecting to login");
      router.replace("/(auth)/login");
    } else if (isAuthenticated && inAuthGroup) {
      logStartup("redirecting to tabs");
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, isInitialized, segments, router]);

  return null;
}

// ─── Loading Splash ───────────────────────────────────────────────────────────
function AppLoadingScreen() {
  return (
    <View style={styles.loadingScreen}>
      <ActivityIndicator size="large" color="#E8A020" />
    </View>
  );
}

// ─── Alert Gateway Registration ───────────────────────────────────────────────
function AlertGatewayRegistrar() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    registerAlertGateway((payload) => dispatch(showAlert(payload)));
  }, [dispatch]);

  return null;
}

function PushNotificationRegistrar() {
  const router = useRouter();
  const didRegisterPushToken = useRef(false);
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
  const isInitialized = useSelector((s: RootState) => s.auth.isInitialized);

  useEffect(() => {
    let isMounted = true;
    let cleanup: (() => void) | null = null;

    configureForegroundNotifications().catch((error) =>
      warnStartup("foreground notification setup failed", error),
    );

    registerNotificationResponseHandler(router)
      .then((removeListener) => {
        if (isMounted) {
          cleanup = removeListener;
        } else {
          removeListener();
        }
      })
      .catch((error) => warnStartup("notification response listener setup failed", error));

    return () => {
      isMounted = false;
      cleanup?.();
    };
  }, [router]);

  useEffect(() => {
    if (!isInitialized) return;

    if (!isAuthenticated) {
      didRegisterPushToken.current = false;
      return;
    }

    if (didRegisterPushToken.current) return;
    didRegisterPushToken.current = true;

    registerForPushNotifications()
      .then((token) => {
        if (token) {
          logStartup("push token registered");
        } else {
          didRegisterPushToken.current = false;
        }
      })
      .catch((error) => {
        didRegisterPushToken.current = false;
        warnStartup("push token registration failed", error);
      });
  }, [isAuthenticated, isInitialized]);

  return null;
}

// ─── Inner Layout ─────────────────────────────────────────────────────────────
function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const isInitialized = useSelector((s: RootState) => s.auth.isInitialized);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AlertGatewayRegistrar />
      <AuthGuard />
      <PushNotificationRegistrar />
      {!isInitialized ? (
        <AppLoadingScreen />
      ) : (
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="modal" options={{ presentation: "modal" }} />
          <Stack.Screen name="group-chat" />
          <Stack.Screen name="add-content" />
          <Stack.Screen name="session-content" />
          <Stack.Screen name="add-sessions" />
          <Stack.Screen name="hall" />
          <Stack.Screen name="reviews" />
          <Stack.Screen name="guide" />
          <Stack.Screen name="library" />
          <Stack.Screen name="notifications" />
          <Stack.Screen name="meeting-lobby" />
          <Stack.Screen name="meeting-room" />
        </Stack>
      )}
      <GlobalAlert />
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

// ─── Root Layout ──────────────────────────────────────────────────────────────
export const unstable_settings = {
  anchor: "(auth)",
  initialRouteName: "(auth)",
};

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Alex_100: require("../assets/fonts/Alexandria-Thin.ttf"),
    Alex_200: require("../assets/fonts/Alexandria-ExtraLight.ttf"),
    Alex_300: require("../assets/fonts/Alexandria-Light.ttf"),
    Alex_400: require("../assets/fonts/Alexandria-Regular.ttf"),
    Alex_500: require("../assets/fonts/Alexandria-Medium.ttf"),
    Alex_600: require("../assets/fonts/Alexandria-SemiBold.ttf"),
    Alex_700: require("../assets/fonts/Alexandria-Bold.ttf"),
    Alex_800: require("../assets/fonts/Alexandria-ExtraBold.ttf"),
    Alex_900: require("../assets/fonts/Alexandria-Black.ttf"),
  });
  const appReady = fontsLoaded || !!fontError;

  useEffect(() => {
    logStartup("root layout mounted");
  }, []);

  useEffect(() => {
    if (!appReady) return;
    if (fontError) {
      warnStartup("font loading failed; showing app with fallback fonts", fontError);
    } else {
      logStartup("fonts loaded");
    }
    SplashScreen.hideAsync()
      .then(() => logStartup("native splash hidden"))
      .catch((error) => warnStartup("hideAsync failed", error));
  }, [appReady, fontError]);

  if (!appReady) return null;

  return (
    <Provider store={store}>
      <RootLayoutNav />
    </Provider>
  );
}

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    backgroundColor: "#FFFCF0",
    alignItems: "center",
    justifyContent: "center",
  },
});
