import {
  AlertTriangle,
  CheckCircle,
  Info,
  X,
  XCircle,
} from 'lucide-react-native';
import React, { useCallback, useEffect, useRef } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { alertCallbackRegistry, dismissAlert, selectAlertQueue } from '@/store/alert';
import { Colors } from '@/constants/colors';
import { useAppDispatch, useAppSelector } from '@/hooks/store-hooks';
import type { Alert, AlertButtonStyle, AlertType } from '@/types/alert.types';

// ─── Per-type visual config ───────────────────────────────────────────────────

interface TypeConfig {
  color: string;
  bgColor: string;
  borderColor: string;
  Icon: React.ComponentType<{ size: number; color: string; strokeWidth?: number }>;
}

const TYPE_CONFIG: Record<AlertType, TypeConfig> = {
  success: {
    color: Colors.success,
    bgColor: Colors.successBg,
    borderColor: Colors.success + '50',
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
    borderColor: Colors.warning + '50',
    Icon: AlertTriangle,
  },
  info: {
    color: Colors.info,
    bgColor: Colors.infoBg,
    borderColor: Colors.info + '50',
    Icon: Info,
  },
};

// ─── Button style helper ──────────────────────────────────────────────────────

function resolveButtonColors(
  btnStyle: AlertButtonStyle | undefined,
  typeColor: string,
): { bg: string; text: string; border: string } {
  switch (btnStyle) {
    case 'danger':
      return { bg: Colors.error, text: '#ffffff', border: Colors.error };
    case 'secondary':
      return { bg: 'transparent', text: Colors.textSecondary, border: Colors.border };
    case 'primary':
    default:
      return { bg: typeColor, text: '#ffffff', border: typeColor };
  }
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface AlertCardProps {
  alert: Alert;
  onDismiss: () => void;
}

// ─── AlertCard (inner) ────────────────────────────────────────────────────────

function AlertCard({ alert, onDismiss }: AlertCardProps) {
  const config = TYPE_CONFIG[alert.type];
  const { Icon } = config;

  const handleConfirm = useCallback(() => {
    const callbacks = alertCallbackRegistry.get(alert.id);
    callbacks?.confirm?.();
    onDismiss();
  }, [alert.id, onDismiss]);

  const handleCancel = useCallback(() => {
    const callbacks = alertCallbackRegistry.get(alert.id);
    callbacks?.cancel?.();
    onDismiss();
  }, [alert.id, onDismiss]);

  const hasButtons = !!(alert.confirmAction || alert.cancelAction);

  return (
    <View
      style={[
        styles.card,
        { borderColor: config.borderColor },
      ]}
      accessibilityRole="alert"
      accessibilityLiveRegion="assertive"
    >
      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={[styles.iconWrap, { backgroundColor: config.bgColor }]}>
          <Icon size={22} color={config.color} strokeWidth={2} />
        </View>

        {alert.title ? (
          <Text style={styles.title} numberOfLines={2}>
            {alert.title}
          </Text>
        ) : null}

        {/* Close button — only shown when there are no explicit action buttons */}
        {!hasButtons && (
          <Pressable
            onPress={onDismiss}
            style={styles.closeBtn}
            hitSlop={8}
            accessibilityLabel="Close alert"
            accessibilityRole="button"
          >
            <X size={18} color={Colors.textSecondary} strokeWidth={2} />
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
                  { color: resolveButtonColors(alert.cancelAction.style, config.color).text },
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
                resolveButtonStyle(alert.confirmAction!.style ?? 'primary', config.color),
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
                      alert.confirmAction.style ?? 'primary',
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
    </View>
  );
}

function resolveButtonStyle(
  btnStyle: AlertButtonStyle | undefined,
  typeColor: string,
): object {
  const colors = resolveButtonColors(btnStyle, typeColor);
  return {
    backgroundColor: colors.bg,
    borderColor: colors.border,
  };
}

// ─── GlobalAlert (root) ───────────────────────────────────────────────────────

export function GlobalAlert() {
  const dispatch = useAppDispatch();
  const queue = useAppSelector(selectAlertQueue);
  const current: Alert | undefined = queue[0];

  // Animation values
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardTranslateY = useRef(new Animated.Value(24)).current;

  // Track the last displayed alert so we re-trigger enter animation per item.
  const lastIdRef = useRef<string | null>(null);

  // ── Enter animation ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!current || current.id === lastIdRef.current) return;

    lastIdRef.current = current.id;

    // Reset to starting values before animating in.
    overlayOpacity.setValue(0);
    cardOpacity.setValue(0);
    cardTranslateY.setValue(24);

    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 240,
        useNativeDriver: true,
      }),
      Animated.spring(cardTranslateY, {
        toValue: 0,
        damping: 22,
        stiffness: 280,
        useNativeDriver: true,
      }),
    ]).start();

    // Announce to screen readers.
    if (current.title) {
      AccessibilityInfo.announceForAccessibility(`${current.title}. ${current.message}`);
    } else {
      AccessibilityInfo.announceForAccessibility(current.message);
    }
  }, [current?.id]);

  // ── Auto-dismiss ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!current?.autoDismiss) return;
    const timer = setTimeout(handleDismiss, current.autoDismiss);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.id]);

  // ── Dismiss with exit animation ────────────────────────────────────────────
  const handleDismiss = useCallback(() => {
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
    ]).start(() => {
      // Clean up callbacks before removing from queue.
      if (current) {
        alertCallbackRegistry.remove(current.id);
      }
      dispatch(dismissAlert());
    });
  }, [current, dispatch, overlayOpacity, cardOpacity, cardTranslateY]);

  // Don't render the Modal at all when the queue is empty.
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
      {/* Overlay — tapping it dismisses only when no confirm action is present */}
      <Animated.View
        style={[styles.overlay, { opacity: overlayOpacity }]}
        pointerEvents="box-none"
      >
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={current.confirmAction ? undefined : handleDismiss}
          accessibilityElementsHidden
          importantForAccessibility="no"
        />

        {/* Card */}
        <Animated.View
          style={[
            styles.cardWrap,
            {
              opacity: cardOpacity,
              transform: [{ translateY: cardTranslateY }],
            },
          ]}
        >
          <AlertCard alert={current} onDismiss={handleDismiss} />

          {/* Queue badge */}
          {queue.length > 1 && (
            <View style={styles.queueBadge}>
              <Text style={styles.queueBadgeText}>{queue.length - 1} more</Text>
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
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  cardWrap: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },

  card: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.14,
        shadowRadius: 20,
      },
      android: {
        elevation: 12,
      },
    }),
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },

  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.2,
  },

  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },

  message: {
    fontSize: 14,
    lineHeight: 21,
    color: Colors.textSecondary,
    marginBottom: 4,
  },

  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },

  btn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },

  btnPressed: {
    opacity: 0.82,
  },

  btnText: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.1,
  },

  queueBadge: {
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 20,
  },

  queueBadgeText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '500',
  },
});
