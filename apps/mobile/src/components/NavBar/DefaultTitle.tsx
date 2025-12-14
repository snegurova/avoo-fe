import { Text, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootScreens, RootNavigationProp } from '@/types/navigation';
import { colors, spacing, radius, typography } from '@avoo/design-tokens';
import Dropdown, { MenuItem } from '@/shared/Dropdown/Dropdown';
import { Ionicons } from '@expo/vector-icons';

export default function DefaultTitle() {
  const navigation = useNavigation<RootNavigationProp>();

  const defaultItems: MenuItem[] = [
    { label: 'New Post', onPress: () => navigation.navigate(RootScreens.AddPostScreen) },
    { label: 'Add Booking', onPress: () => navigation.navigate(RootScreens.AddBookingScreen) },
  ];

  return (
    <Dropdown
      trigger={(isOpen) => (
        <Pressable style={styles.defaultButton}>
          <Text style={styles.defaultButtonText}>Add</Text>
          <Ionicons name={isOpen ? 'chevron-up' : 'chevron-down'} size={16} color={colors.white} />
        </Pressable>
      )}
      items={defaultItems}
    />
  );
}

const styles = StyleSheet.create({
  defaultButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 109,
    height: 44,
    backgroundColor: colors.black,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    gap: spacing.xs,
  },
  defaultButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    marginRight: spacing.xs,
  },
});

