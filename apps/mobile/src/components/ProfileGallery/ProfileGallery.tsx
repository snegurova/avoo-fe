import { View, Text, FlatList, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { userHooks } from '@avoo/hooks';
import { SectionHeader } from '@/shared/SectionHeader/SectionHeader';
import { RootScreens } from '@/types/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const ProfileGallery = () => {
  const userMedia = userHooks.useGetUserMedia();
  const navigation = useNavigation<NavigationProp>();

  const handleEdit = () => {
    navigation.navigate(RootScreens.GalleryScreen);
  };

  return (
    <View className='px-5 py-4 border-t border-gray-200'>
      <SectionHeader title='Gallery' onEdit={handleEdit} />

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
            <Pressable onPress={handleEdit}>
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
