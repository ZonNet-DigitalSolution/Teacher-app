import { RootState } from "@/store";
import {
  configureForegroundNotifications,
  registerForPushNotifications,
  registerNotificationResponseHandler,
} from "@/services/pushNotificationsService";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

export function usePushNotifications() {
  const router = useRouter();
  const didRegisterToken = useRef(false);

  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
  const isInitialized = useSelector((s: RootState) => s.auth.isInitialized);

  useEffect(() => {
    let isMounted = true;
    let cleanup: (() => void) | null = null;

    configureForegroundNotifications();

    registerNotificationResponseHandler(router).then((removeListener) => {
      if (isMounted) {
        cleanup = removeListener;
      } else {
        removeListener();
      }
    });

    return () => {
      isMounted = false;
      cleanup?.();
    };
  }, [router]);

  useEffect(() => {
    if (!isInitialized) return;

    if (!isAuthenticated) {
      didRegisterToken.current = false;
      return;
    }

    if (didRegisterToken.current) return;
    didRegisterToken.current = true;

    registerForPushNotifications().then((token) => {
      if (!token) didRegisterToken.current = false;
    }).catch(() => {
      didRegisterToken.current = false;
    });
  }, [isAuthenticated, isInitialized]);
}
