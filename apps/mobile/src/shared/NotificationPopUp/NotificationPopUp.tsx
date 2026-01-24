import { Snackbar as PaperSnackbar, Text } from 'react-native-paper';
import { MaterialIcons } from '@/shared/icons';
import { colors } from '@avoo/design-tokens';
import { useApiStatusStore } from '@avoo/store';
import { StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';

enum NotificationPopUpVariant {
  ERROR = 'error',
  SUCCESS = 'success',
}

export function NotificationPopUp() {
  const errorMessage = useApiStatusStore((s) => s.errorMessage);
  const isError = useApiStatusStore((s) => s.isError);
  const successMessage = useApiStatusStore((s) => s.successMessage);
  const isSuccess = useApiStatusStore((s) => s.isSuccess);

  const hasError = isError && !!errorMessage;
  const hasSuccess = isSuccess && !!successMessage;
  const visible = hasError || hasSuccess;

  const [variant, setVariant] = useState<NotificationPopUpVariant | null>(null);
  
  const message =
    variant === NotificationPopUpVariant.ERROR
      ? errorMessage
      : successMessage;

  useEffect(() => {
    if (hasError) {
      setVariant(NotificationPopUpVariant.ERROR);
    } else if (hasSuccess) {
      setVariant(NotificationPopUpVariant.SUCCESS);
    }
  }, [hasError, hasSuccess]);

  const handleDismiss = () => {
    if (variant === NotificationPopUpVariant.ERROR) {
      useApiStatusStore.getState().clearError();
    } else if (variant === NotificationPopUpVariant.SUCCESS) {
      useApiStatusStore.getState().clearSuccess();
    }
  };

  if (!variant) return null;

  const backgroundColor =
    variant === NotificationPopUpVariant.ERROR ? colors.red[800] : colors.green[600];
  const iconName = variant === NotificationPopUpVariant.ERROR ? 'close' : 'check-circle';

  return (
    <PaperSnackbar
      visible={visible}
      onDismiss={handleDismiss}
      duration={4000}
      style={{ backgroundColor }}
      icon={({ size, color }) => (
        <MaterialIcons name={iconName} size={size} color={color} />
      )}
      onIconPress={handleDismiss}
    >
      <Text variant='titleMedium' style={styles.notificationText}>
        {message}
      </Text>
    </PaperSnackbar>
  );
}

const styles = StyleSheet.create({
  notificationText: {
    color: colors.white,
  },
});
