import {
  configureForegroundNotifications,
  registerForPushNotifications,
  registerNotificationResponseHandler,
} from "@/services/pushNotificationsService";
import { RootState } from "@/store";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

export function usePushNotifications() {
  const router = useRouter();
  const didRegisterToken = useRef(false);

  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
  const isInitialized = useSelector((s: RootState) => s.auth.isInitialized);

  useEffect(() => {
    configureForegroundNotifications();
    const removeListener = registerNotificationResponseHandler(router);
    return () => removeListener();
  }, [router]);

  useEffect(() => {
    if (!isInitialized || !isAuthenticated) {
      if (!isAuthenticated) didRegisterToken.current = false;
      return;
    }

    if (didRegisterToken.current) return;
    didRegisterToken.current = true;

    registerForPushNotifications().then((token) => {
      if (!token) didRegisterToken.current = false;
    });
  }, [isAuthenticated, isInitialized]);
}
