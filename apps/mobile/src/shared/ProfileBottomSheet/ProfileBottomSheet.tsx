import { View, Pressable } from 'react-native';
import { Avatar } from '@/shared/Avatar/Avatar';
import { colors } from '@avoo/design-tokens';
import { authHooks, userHooks } from '@avoo/hooks';
import { Text } from 'react-native-paper';
import { useGlobalBottomSheet } from '@/shared/GlobalBottomSheet';
import { RootNavigationProp, RootScreens } from '@/types/navigation';
import { useNavigation } from '@react-navigation/native';

export const ProfileBottomSheet = () => {
  const { close } = useGlobalBottomSheet();
  const navigation = useNavigation<RootNavigationProp>();
  const { visualProfileInfo } = userHooks.useGetUserProfile();

  const { logoutMutation } = authHooks.useLogout();

  const handleLogout = () => {
    logoutMutation();
    close();
  };

  const handleNavigate = () => {
    close();
    navigation.navigate(RootScreens.ProfileScreen);
  };

  return (
    <View className='px-5 py-4'>
      <View className='flex-row gap-4 mb-6'>
        <Avatar
          uri={visualProfileInfo?.avatarUrl || null}
          name={visualProfileInfo?.name || ''}
          size={80}
          backgroundColor={colors.primary[200]}
        />
        <View className='flex-1'>
          <Text className='text-lg font-semibold mt-3'>{visualProfileInfo?.name || 'User'}</Text>
          <Text className='text-sm text-gray-600 mt-1'>{visualProfileInfo?.email || ''}</Text>
        </View>
      </View>

      <Pressable className='py-3 border-t border-primary-100' onPress={handleNavigate}>
        <Text variant='titleSmall' style={{ lineHeight: 16, color: colors.gray[700] }}>Profile</Text>
      </Pressable>
      <Pressable className='py-3'>
        <Text variant='titleSmall' style={{ lineHeight: 16, color: colors.gray[700] }}>Account settings</Text>
      </Pressable>
      <Pressable className='py-3'>
        <Text variant='titleSmall' style={{ lineHeight: 16, color: colors.gray[700] }}>Security settings</Text>
      </Pressable>
      <Pressable className='py-3 border-t border-primary-100'>
        <Text variant='titleSmall' style={{ lineHeight: 16, color: colors.gray[700] }}>Terms of serrvice</Text>
      </Pressable>
      <Pressable className='py-3'>
        <Text variant='titleSmall' style={{ lineHeight: 16, color: colors.gray[700] }}>Privacy policy</Text>
      </Pressable>
      <Pressable className='py-3 border-t border-primary-100'>
        <Text variant='titleSmall' style={{ lineHeight: 16, color: colors.gray[700] }}>Help and support</Text>
      </Pressable>
      <Pressable className='py-3' onPress={handleLogout}>
        <Text variant='titleSmall' style={{ lineHeight: 16, color: colors.red[500] }}>Logout</Text>
      </Pressable>
    </View>
  );
};

