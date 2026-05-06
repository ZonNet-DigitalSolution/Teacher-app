import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import "react-native-reanimated";
import { Provider, useDispatch, useSelector } from "react-redux";
import "../global.css";

import { GlobalAlert } from "@/components/Ui/GlobalAlert";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAppDispatch } from "@/hooks/store-hooks";
import { AppDispatch, RootState, store } from "@/store";
import { initializeAuth } from "@/store/auth";
import { showAlert } from "@/store/alert";
import { registerAlertGateway } from "@/services/alertGateway";

SplashScreen.preventAutoHideAsync();

// ─── Route Guard ─────────────────────────────────────────────────────────────
/**
 * Runs on every render.  Once the auth state is initialized (hydrated from
 * secure storage), it redirects the user to the correct part of the app:
 *   • Not authenticated → (auth)/login
 *   • Authenticated     → (tabs)
 */
function AuthGuard() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const segments = useSegments();

  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
  const isInitialized = useSelector((s: RootState) => s.auth.isInitialized);

  // Hydrate auth from secure storage on first mount
  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  // Redirect once we know the auth status
  useEffect(() => {
    if (!isInitialized) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (isAuthenticated && inAuthGroup) {
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
/**
 * Wires the alert gateway once so axios interceptors and service-layer code
 * can push alerts into the Redux store without circular imports.
 */
function AlertGatewayRegistrar() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    registerAlertGateway((payload) => dispatch(showAlert(payload)));
  }, [dispatch]);

  return null;
}

// ─── Inner Layout (has access to Redux store) ─────────────────────────────────
function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const isInitialized = useSelector((s: RootState) => s.auth.isInitialized);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AlertGatewayRegistrar />
      <AuthGuard />
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
        </Stack>
      )}
      {/* Global alert overlay — rendered above everything, including modals */}
      <GlobalAlert />
      <StatusBar style="auto" backgroundColor="transparent" translucent />
    </ThemeProvider>
  );
}

// ─── Root Layout (provides Redux store) ──────────────────────────────────────
export const unstable_settings = {
  anchor: "(auth)",
  initialRouteName: "(auth)",
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
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

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

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
