import { View, Pressable } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@/shared/icons';
import { Avatar } from '@/shared/Avatar/Avatar';
import { colors } from '@avoo/design-tokens';
import { userHooks } from '@avoo/hooks';
import { useBottomSheetStore, BottomSheetType } from '@/store/useBottomSheetStore';

export default function DefaultRightContent() {
  const { visualProfileInfo } = userHooks.useGetUserProfile();
  const handleOpenBottomSheet = useBottomSheetStore((state) => state.handleOpenBottomSheet);

  const handleOpenProfile = () => {
    handleOpenBottomSheet(BottomSheetType.PROFILE, {
      enableDynamicSizing: true,
    });
  };

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
    </View>
  );
}
