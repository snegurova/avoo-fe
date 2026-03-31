import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Portal } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@avoo/design-tokens';
import { useApiStatusStore } from '@avoo/store';

import { MaterialIcons } from '@/shared/icons';

enum NotificationPopUpVariant {
  ERROR = 'error',
  SUCCESS = 'success',
}

const DURATION = 4000;

export function NotificationPopUp() {
  const errorMessage = useApiStatusStore((s) => s.errorMessage);
  const isError = useApiStatusStore((s) => s.isError);
  const successMessage = useApiStatusStore((s) => s.successMessage);
  const isSuccess = useApiStatusStore((s) => s.isSuccess);

  const hasError = isError && !!errorMessage;
  const hasSuccess = isSuccess && !!successMessage;
  const visible = hasError || hasSuccess;

  const [variant, setVariant] = useState<NotificationPopUpVariant | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { bottom } = useSafeAreaInsets();

  const message = variant === NotificationPopUpVariant.ERROR ? errorMessage : successMessage;

  const dismiss = () => {
    Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
      if (variant === NotificationPopUpVariant.ERROR) {
        useApiStatusStore.getState().clearError();
      } else if (variant === NotificationPopUpVariant.SUCCESS) {
        useApiStatusStore.getState().clearSuccess();
      }
      setVariant(null);
    });
  };

  useEffect(() => {
    if (hasError) {
      setVariant(NotificationPopUpVariant.ERROR);
    } else if (hasSuccess) {
      setVariant(NotificationPopUpVariant.SUCCESS);
    }
  }, [hasError, hasSuccess]);

  useEffect(() => {
    if (visible) {
      if (timerRef.current) clearTimeout(timerRef.current);
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }).start();
      timerRef.current = setTimeout(dismiss, DURATION);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [visible]);

  if (!variant) return null;

  const backgroundColor =
    variant === NotificationPopUpVariant.ERROR ? colors.red[800] : colors.green[600];
  const iconName = variant === NotificationPopUpVariant.ERROR ? 'close' : 'check-circle';

  return (
    <Portal>
      <View
        style={[StyleSheet.absoluteFill, { zIndex: 9999, elevation: 9999 }]}
        pointerEvents='box-none'
      >
        <Animated.View style={[styles.snackbar, { backgroundColor, bottom: bottom + 16, opacity }]}>
          <Text style={styles.message}>{message}</Text>
          <Pressable onPress={dismiss} hitSlop={12}>
            <MaterialIcons name={iconName} size={20} color={colors.white} />
          </Pressable>
        </Animated.View>
      </View>
    </Portal>
  );
}

const styles = StyleSheet.create({
  snackbar: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  message: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    marginRight: 12,
  },
});
