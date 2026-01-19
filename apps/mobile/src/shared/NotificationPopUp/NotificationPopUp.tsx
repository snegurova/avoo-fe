import { Snackbar as PaperSnackbar, Text } from 'react-native-paper';
import { MaterialIcons } from '@/shared/icons';
import { colors } from '@avoo/design-tokens';
import { useApiStatusStore } from '@avoo/store';
import { StyleSheet } from 'react-native';

enum NotificationPopUpVariant {
  ERROR = 'error',
  SUCCESS = 'success',
}

export function NotificationPopUp() {
  const errorMessage = useApiStatusStore((state) => state.errorMessage);
  const isError = useApiStatusStore((state) => state.isError);
  const successMessage = useApiStatusStore((state) => state.successMessage);
  const isSuccess = useApiStatusStore((state) => state.isSuccess);

  const hasError = isError && !!errorMessage;
  const hasSuccess = isSuccess && !!successMessage;
  const visible = hasError || hasSuccess;
  const message = hasError ? errorMessage : successMessage;
  const variant = hasError ? NotificationPopUpVariant.ERROR : NotificationPopUpVariant.SUCCESS;

  const handleDismiss = () => {
    if (hasError) {
      useApiStatusStore.getState().clearError();
    } else if (hasSuccess) {
      useApiStatusStore.getState().clearSuccess();
    }
  };

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
