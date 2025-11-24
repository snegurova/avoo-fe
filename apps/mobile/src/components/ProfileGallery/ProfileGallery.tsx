import { View, Text, FlatList, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { userHooks } from '@avoo/hooks';
import { SectionHeader } from '@/shared/SectionHeader/SectionHeader';
import { RootNavigationProp, RootScreens } from '@/types/navigation';


export const ProfileGallery = () => {
  const userMedia = userHooks.useGetUserMedia();
  const navigation = useNavigation<RootNavigationProp>();

  const handleNavigate = () => {
    navigation.navigate(RootScreens.GalleryScreen);
  };

  return (
    <View className='px-5 py-4 border-t border-gray-200'>
      <SectionHeader title='Gallery' onEdit={handleNavigate} />

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={userMedia?.items}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ gap: 12, paddingHorizontal: 0, flex: 1 }}
        ListEmptyComponent={
          <View className='items-center justify-center py-8 flex-1'>
            <Text className='text-sm text-slate-500 text-center mb-2'>
              Show clients your place and service
            </Text>
            <Pressable onPress={handleNavigate}>
              <Text className='text-sm text-blue-600 underline' >Add gallery</Text>
            </Pressable>
          </View>
        }
        renderItem={() => <View className='bg-gray-200 rounded-lg w-20 h-20' />}
      />
    </View>
  );
};

export default ProfileGallery;
