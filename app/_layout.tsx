import { AppLoadingScreen } from "@/components/Ui/AppLoadingScreen";
import { GlobalAlert } from "@/components/Ui/GlobalAlert";
import { useAlertGateway } from "@/hooks/use-alert-gateway";
import { useAuthGuard } from "@/hooks/use-auth-guard";
import { usePushNotifications } from "@/hooks/use-push-notifications";
import { RootState, store } from "@/store";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { Provider, useSelector } from "react-redux";
import "../global.css";

SplashScreen.preventAutoHideAsync();

// ─── Inner Layout ─────────────────────────────────────────────────────────────
function RootLayoutNav() {
  const isInitialized = useSelector((s: RootState) => s.auth.isInitialized);

  useAuthGuard();
  useAlertGateway();
  usePushNotifications();

  if (!isInitialized) return <AppLoadingScreen />;

  return (
    <>
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
        <Stack.Screen name="meeting-view" />
      </Stack>
      <GlobalAlert />
      <StatusBar style="auto" />
    </>
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
    if (!appReady) return;
    SplashScreen.hideAsync();
  }, [appReady]);

  if (!appReady) return null;

  return (
    <Provider store={store}>
      <RootLayoutNav />
    </Provider>
  );
}
