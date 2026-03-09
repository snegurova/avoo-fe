import { Pressable, View } from 'react-native';

import { colors } from '@avoo/design-tokens';
import { userHooks, utils } from '@avoo/hooks';

import { Avatar } from '@/shared/Avatar/Avatar';
import { CustomBottomSheet } from '@/shared/CustomBottomSheet/CustomBottomSheet';
import { MaterialCommunityIcons, MaterialIcons } from '@/shared/icons';
import { ProfileMenu } from '@/shared/ProfileMenu/ProfileMenu';

export default function DefaultRightContent() {
  const { visualProfileInfo } = userHooks.useGetUserProfile();
  const {
    value: isProfileMenuVisible,
    enable: handleOpenProfile,
    disable: handleCloseProfile,
  } = utils.useBooleanState(false);

  return (
    <View className='flex-row items-center gap-lg'>
      <Pressable className='w-11 h-11 justify-center items-center'>
        <MaterialCommunityIcons name='share-variant-outline' size={24} />
      </Pressable>
      <Pressable className='w-11 h-11 justify-center items-center'>
        <MaterialIcons name='notifications-none' size={24} />
      </Pressable>
      <Pressable className='w-11 h-11 justify-center items-center' onPress={handleOpenProfile}>
        <Avatar
          uri={visualProfileInfo?.avatarUrl || null}
          name={visualProfileInfo?.name || ''}
          size={40}
          backgroundColor={colors.primary[200]}
        />
      </Pressable>
      <CustomBottomSheet visible={isProfileMenuVisible} onClose={handleCloseProfile} snapToContent>
        <ProfileMenu onClose={handleCloseProfile} />
      </CustomBottomSheet>
    </View>
  );
}
