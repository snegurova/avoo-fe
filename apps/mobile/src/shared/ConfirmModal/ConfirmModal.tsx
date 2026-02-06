import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { colors } from '@avoo/design-tokens';
import { MaterialIcons } from '../icons';

type Props = {
  visible: boolean;
  onClose: () => void;
  title: string;
  description: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  onConfirmText?: string;
  onCancelText?: string;
};


export const ConfirmModal = (props: Props) => {
  const { visible, onClose, title, description, onConfirm, onCancel, onConfirmText = 'Confirm', onCancelText = 'Cancel' } = props;

  const handleCancel = () => {
    onCancel?.();
    onClose();
  };
  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType='fade' onRequestClose={onClose} >
      <Pressable
        className='flex-1 bg-black/50 justify-center items-center p-xl'
        onPress={handleCancel}
      >
        <View className='bg-white rounded-xl px-11 py-14 w-full max-w-[400px]'>
          <Pressable
            className='absolute top-md right-md z-10'
            onPress={handleCancel}
            hitSlop={12}
          >
            <MaterialIcons name='close' size={24} color={colors.black} />
          </Pressable>

          <Text variant='titleMedium' className='mb-6'>
            {title}
          </Text>
          <Text variant='bodyMedium' className='mb-8' >
            {description}
          </Text>

          <View className='flex-row gap-md'>
            <Pressable
              className='py-md rounded-lg items-center justify-center bg-white border border-gray-200 px-xl'
              onPress={handleCancel}
            >
              <Text variant='titleMedium' style={styles.secondaryButtonText}>{onCancelText}</Text>
            </Pressable>
            <Pressable
              className='flex-1 py-md rounded-lg items-center justify-center bg-black'
              onPress={handleConfirm}
            >
              <Text variant='titleMedium' style={styles.primaryButtonText}>{onConfirmText}</Text>
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  secondaryButtonText: {
    color: colors.primary[900],
  },
  primaryButtonText: {
    color: colors.white,
  },
});
