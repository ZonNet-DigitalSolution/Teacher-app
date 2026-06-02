import {
  AlertTriangle,
  CheckCircle,
  Info,
  X,
  XCircle,
} from "lucide-react-native";
import React, { useCallback, useEffect, useRef } from "react";
import {
  AccessibilityInfo,
  Animated,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Colors } from "@/constants/colors";
import { useAppDispatch, useAppSelector } from "@/hooks/store-hooks";
import {
  alertCallbackRegistry,
  dismissAlert,
  selectAlertQueue,
} from "@/store/alert";
import type { Alert, AlertButtonStyle, AlertType } from "@/types/alert.types";

// ─── Per-type visual config ───────────────────────────────────────────────────

interface TypeConfig {
  color: string;
  bgColor: string;
  borderColor: string;
  Icon: React.ComponentType<{
    size: number;
    color: string;
    strokeWidth?: number;
  }>;
}

const TYPE_CONFIG: Record<AlertType, TypeConfig> = {
  success: {
    color: Colors.success,
    bgColor: Colors.successBg,
    borderColor: Colors.success + "40",
    Icon: CheckCircle,
  },
  error: {
    color: Colors.error,
    bgColor: Colors.errorBg,
    borderColor: Colors.errorBorder,
    Icon: XCircle,
  },
  warning: {
    color: Colors.warning,
    bgColor: Colors.warningBg,
    borderColor: Colors.warning + "50",
    Icon: AlertTriangle,
  },
  info: {
    color: Colors.info,
    bgColor: Colors.infoBg,
    borderColor: Colors.info + "50",
    Icon: Info,
  },
};

// ─── Button helpers ───────────────────────────────────────────────────────────

function resolveButtonColors(
  btnStyle: AlertButtonStyle | undefined,
  typeColor: string,
): { bg: string; text: string; border: string } {
  switch (btnStyle) {
    case "danger":
      return { bg: Colors.error, text: "#ffffff", border: Colors.error };
    case "secondary":
      return {
        bg: "transparent",
        text: Colors.textSecondary,
        border: Colors.border,
      };
    case "primary":
    default:
      return { bg: typeColor, text: "#ffffff", border: typeColor };
  }
}

function resolveButtonStyle(
  btnStyle: AlertButtonStyle | undefined,
  typeColor: string,
): object {
  const { bg, border } = resolveButtonColors(btnStyle, typeColor);
  return { backgroundColor: bg, borderColor: border };
}

// ─── Auto-dismiss progress bar ───────────────────────────────────────────────

function ProgressBar({
  duration,
  color,
  alertId,
}: {
  duration: number;
  color: string;
  alertId: string;
}) {
  const width = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    width.setValue(1);
    const anim = Animated.timing(width, {
      toValue: 0,
      duration,
      useNativeDriver: false,
    });
    anim.start();
    return () => anim.stop();
  }, [alertId, duration, width]);

  return (
    <View style={pbStyles.track}>
      <Animated.View
        style={[
          pbStyles.fill,
          {
            backgroundColor: color,
            width: width.interpolate({
              inputRange: [0, 1],
              outputRange: ["0%", "100%"],
            }),
          },
        ]}
      />
    </View>
  );
}

const pbStyles = StyleSheet.create({
  track: {
    height: 3,
    backgroundColor: Colors.border,
    borderRadius: 2,
    marginTop: 16,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 2,
  },
});

// ─── AlertCard ────────────────────────────────────────────────────────────────

interface AlertCardProps {
  alert: Alert;
  onDismiss: () => void;
}

function AlertCard({ alert, onDismiss }: AlertCardProps) {
  const config = TYPE_CONFIG[alert.type];
  const { Icon } = config;

  const handleConfirm = useCallback(() => {
    alertCallbackRegistry.get(alert.id)?.confirm?.();
    onDismiss();
  }, [alert.id, onDismiss]);

  const handleCancel = useCallback(() => {
    alertCallbackRegistry.get(alert.id)?.cancel?.();
    onDismiss();
  }, [alert.id, onDismiss]);

  const hasButtons = !!(alert.confirmAction || alert.cancelAction);
  // Critical = user must choose; no passive dismiss allowed
  const isCritical = !!(alert.confirmAction && !alert.cancelAction);

  return (
    <View
      style={[
        styles.card,
        { borderColor: config.borderColor, borderTopColor: config.color },
      ]}
      accessibilityRole="alert"
      accessibilityLiveRegion="assertive"
    >
      {/* ── Header ── */}
      <View style={styles.header}>
        <View>
          {alert.title ? (
            <>
              <View
                style={[styles.iconWrap, { backgroundColor: config.bgColor }]}
              >
                <Icon size={22} color={config.color} strokeWidth={2} />
              </View>
              <Text style={styles.title} numberOfLines={2}>
                {alert.title}
              </Text>
            </>
          ) : null}
        </View>

        {/* Close button hidden only for critical confirms (confirm-only, no cancel) */}
        {!isCritical && (
          <Pressable
            onPress={hasButtons ? handleCancel : onDismiss}
            style={({ pressed }) => [
              styles.closeBtn,
              pressed && styles.closeBtnPressed,
            ]}
            hitSlop={8}
            accessibilityLabel="Dismiss"
            accessibilityRole="button"
          >
            <X size={16} color={Colors.textSecondary} strokeWidth={2.5} />
          </Pressable>
        )}
      </View>

      {/* ── Message ── */}
      <Text style={styles.message}>{alert.message}</Text>

      {/* ── Action buttons ── */}
      {hasButtons && (
        <View style={styles.buttonRow}>
          {alert.cancelAction && (
            <Pressable
              onPress={handleCancel}
              style={({ pressed }) => [
                styles.btn,
                resolveButtonStyle(alert.cancelAction!.style, config.color),
                pressed && styles.btnPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel={alert.cancelAction.label}
            >
              <Text
                style={[
                  styles.btnText,
                  {
                    color: resolveButtonColors(
                      alert.cancelAction.style,
                      config.color,
                    ).text,
                  },
                ]}
              >
                {alert.cancelAction.label}
              </Text>
            </Pressable>
          )}

          {alert.confirmAction && (
            <Pressable
              onPress={handleConfirm}
              style={({ pressed }) => [
                styles.btn,
                resolveButtonStyle(
                  alert.confirmAction!.style ?? "primary",
                  config.color,
                ),
                pressed && styles.btnPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel={alert.confirmAction.label}
            >
              <Text
                style={[
                  styles.btnText,
                  {
                    color: resolveButtonColors(
                      alert.confirmAction.style ?? "primary",
                      config.color,
                    ).text,
                  },
                ]}
              >
                {alert.confirmAction.label}
              </Text>
            </Pressable>
          )}
        </View>
      )}

      {/* ── Auto-dismiss progress bar ── */}
      {!!alert.autoDismiss && (
        <ProgressBar
          duration={alert.autoDismiss}
          color={config.color}
          alertId={alert.id}
        />
      )}
    </View>
  );
}

// ─── GlobalAlert (root) ───────────────────────────────────────────────────────

export function GlobalAlert() {
  const dispatch = useAppDispatch();
  const queue = useAppSelector(selectAlertQueue);
  const current: Alert | undefined = queue[0];

  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardTranslateY = useRef(new Animated.Value(30)).current;
  const cardScale = useRef(new Animated.Value(0.92)).current;
  const swipeTranslateY = useRef(new Animated.Value(0)).current;

  const lastIdRef = useRef<string | null>(null);
  const isDismissingRef = useRef(false);
  // Stable ref so PanResponder always calls the latest handleDismiss
  const handleDismissRef = useRef<() => void>(() => {});

  // ── Enter animation ────────────────────────────────────────────────────────
  const currentId = current?.id;
  const currentTitle = current?.title;
  const currentMessage = current?.message;

  useEffect(() => {
    if (!currentId || currentId === lastIdRef.current) return;
    lastIdRef.current = currentId;
    isDismissingRef.current = false;

    overlayOpacity.setValue(0);
    cardOpacity.setValue(0);
    cardTranslateY.setValue(30);
    cardScale.setValue(0.92);
    swipeTranslateY.setValue(0);

    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.spring(cardTranslateY, {
        toValue: 0,
        damping: 22,
        stiffness: 300,
        useNativeDriver: true,
      }),
      Animated.spring(cardScale, {
        toValue: 1,
        damping: 22,
        stiffness: 300,
        useNativeDriver: true,
      }),
    ]).start();

    AccessibilityInfo.announceForAccessibility(
      currentTitle
        ? `${currentTitle}. ${currentMessage}`
        : (currentMessage ?? ""),
    );
  }, [
    currentId,
    currentTitle,
    currentMessage,
    cardOpacity,
    cardScale,
    cardTranslateY,
    overlayOpacity,
    swipeTranslateY,
  ]);

  // ── Auto-dismiss ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!current?.autoDismiss) return;
    const timer = setTimeout(
      () => handleDismissRef.current(),
      current.autoDismiss,
    );
    return () => clearTimeout(timer);
  }, [current?.id]);

  // ── Dismiss with exit animation ────────────────────────────────────────────
  const handleDismiss = useCallback(() => {
    if (isDismissingRef.current) return;
    isDismissingRef.current = true;
    // Capture now — safe even if `current` changes during the 180ms animation
    const alertId = current?.id;

    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(cardOpacity, {
        toValue: 0,
        duration: 160,
        useNativeDriver: true,
      }),
      Animated.timing(cardTranslateY, {
        toValue: 16,
        duration: 160,
        useNativeDriver: true,
      }),
      Animated.spring(cardScale, {
        toValue: 0.94,
        damping: 20,
        stiffness: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (alertId) alertCallbackRegistry.remove(alertId);
      dispatch(dismissAlert());
    });
  }, [
    current?.id,
    dispatch,
    overlayOpacity,
    cardOpacity,
    cardTranslateY,
    cardScale,
  ]);

  // Keep ref in sync every render so PanResponder always calls the latest
  handleDismissRef.current = handleDismiss;

  // ── Swipe-up-to-dismiss gesture ────────────────────────────────────────────
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, { dy }) => dy < -8,
      onPanResponderMove: (_, { dy }) => {
        if (dy < 0) swipeTranslateY.setValue(dy);
      },
      onPanResponderRelease: (_, { dy, vy }) => {
        if (dy < -60 || vy < -0.8) {
          Animated.timing(swipeTranslateY, {
            toValue: -300,
            duration: 200,
            useNativeDriver: true,
          }).start(() => handleDismissRef.current());
        } else {
          Animated.spring(swipeTranslateY, {
            toValue: 0,
            damping: 20,
            stiffness: 300,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  if (!current) return null;

  return (
    <Modal
      visible
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleDismiss}
      accessible={false}
    >
      <Animated.View
        style={[styles.overlay, { opacity: overlayOpacity }]}
        pointerEvents="box-none"
      >
        {/* Overlay tap dismisses only when no confirmation is required */}
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={current.confirmAction ? undefined : handleDismiss}
          accessibilityElementsHidden
          importantForAccessibility="no"
        />

        <Animated.View
          style={[
            styles.cardWrap,
            {
              opacity: cardOpacity,
              transform: [
                { translateY: cardTranslateY },
                { translateY: swipeTranslateY },
                { scale: cardScale },
              ],
            },
          ]}
          {...panResponder.panHandlers}
        >
          <AlertCard alert={current} onDismiss={handleDismiss} />

          {queue.length > 1 && (
            <View style={styles.queueBadge}>
              <Text style={styles.queueBadgeText}>
                +{queue.length - 1} more
              </Text>
            </View>
          )}
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  cardWrap: {
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
  },

  card: {
    width: "100%",
    backgroundColor: Colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderTopWidth: 3,
    paddingHorizontal: 20,
    paddingVertical: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#0f172a",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.18,
        shadowRadius: 24,
      },
      android: {
        elevation: 14,
      },
    }),
  },

  header: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    gap: 10,
  },

  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },

  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  closeBtnPressed: {
    opacity: 0.6,
    transform: [{ scale: 0.9 }],
  },

  message: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    color: Colors.textSecondary,
  },

  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },

  btn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },

  btnPressed: {
    opacity: 0.78,
    transform: [{ scale: 0.97 }],
  },

  btnText: {
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: -0.1,
  },

  queueBadge: {
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 5,
    backgroundColor: "rgba(255,255,255,0.22)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },

  queueBadgeText: {
    fontSize: 12,
    color: "#ffffff",
    fontWeight: "600",
  },
});
