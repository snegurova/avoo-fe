import { Pressable } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { RootScreens, RootNavigationProp } from '@/types/navigation';
import Dropdown, { MenuItem } from '@/shared/Dropdown/Dropdown';
import { Ionicons } from '@expo/vector-icons';

export default function DefaultTitle() {
  const navigation = useNavigation<RootNavigationProp>();
  const theme = useTheme();

  const defaultItems: MenuItem[] = [
    { label: 'New Post', onPress: () => navigation.navigate(RootScreens.AddPostScreen) },
    { label: 'Add Booking', onPress: () => navigation.navigate(RootScreens.AddBookingScreen) },
  ];

  return (
    <Dropdown
      trigger={(isOpen) => (
        <Pressable className="flex-row items-center justify-center min-w-[109px] h-[44px] bg-black rounded-xl px-md py-xs gap-lg">
          <Text variant="labelMedium" style={{ color: theme.colors.onPrimary }}>
            Add
          </Text>
          <Ionicons name={isOpen ? 'chevron-up' : 'chevron-down'} size={16} color={theme.colors.onPrimary} />
        </Pressable>
      )}
      items={defaultItems}
    />
  );
}

