import { useAppDispatch } from "@/hooks/store-hooks";
import { RootState } from "@/store";
import { initializeAuth } from "@/store/auth";
import { useRouter, useSegments } from "expo-router";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

export function useAuthGuard() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const segments = useSegments();
  const didInitialize = useRef(false);

  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
  const isInitialized = useSelector((s: RootState) => s.auth.isInitialized);

  useEffect(() => {
    if (didInitialize.current) return;
    didInitialize.current = true;
    dispatch(initializeAuth());
  }, [dispatch]);

  useEffect(() => {
    if (!isInitialized) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (isAuthenticated && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, isInitialized, segments, router]);
}
