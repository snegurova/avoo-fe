import { useBottomSheetStore } from '@/store/useBottomSheetStore';
import { colors, radius } from '@avoo/design-tokens';
import { Pressable, StyleSheet, View } from 'react-native';
import { MaterialIcons } from '../icons';

type Props = {
  showCloseButton: boolean;
  handleConfirm: () => void;
};

export const BottomSheetHeader = ({ showCloseButton, handleConfirm }: Props) => {
  const hasButtons = showCloseButton || handleConfirm;
  const handleCloseBottomSheet = useBottomSheetStore((state) => state.handleCloseBottomSheet);

  return (
    <View style={[styles.handleWrap, !hasButtons && styles.handleWrapMinimal]}>
      {hasButtons && (
        <View style={styles.buttonsContainer}>
          {showCloseButton && (
            <Pressable onPress={handleCloseBottomSheet} style={styles.button} hitSlop={8}>
              <MaterialIcons name='close' size={30} color={colors.white} />
            </Pressable>
          )}
          {handleConfirm && (
            <Pressable onPress={handleConfirm} style={styles.button} hitSlop={8}>
              <MaterialIcons name='check' size={30} color={colors.white} />
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  handleWrap: {
    paddingBottom: 8,
    position: 'relative',
  },
  handleWrapMinimal: {
    paddingBottom: 12,
  },
  indicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.gray[300],
    alignSelf: 'center',
    marginBottom: 12,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  button: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    backgroundColor: colors.primary[400],
    alignItems: 'center',
    justifyContent: 'center',
  },
});
