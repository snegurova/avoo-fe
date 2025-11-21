import { View, Text, useWindowDimensions, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SectionHeader } from '@/shared/SectionHeader/SectionHeader';
import { RootScreens } from '@/types/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const ProfilePosts = () => {
  const { width } = useWindowDimensions();
  const padding = 20;
  const gap = 8;
  const containerWidth = width - padding * 2;
  const itemWidth = (containerWidth - gap * 2) / 3;
  const navigation = useNavigation<NavigationProp>();

  const handleEdit = () => {
    navigation.navigate(RootScreens.PostsScreen);
  };

  return (
    <View className='px-5 py-4'>
      <SectionHeader title='Posts' onEdit={handleEdit} />

      <View className='items-center justify-center py-8'>
        <View
          className='bg-gray-200 rounded-lg mb-4'
          style={{ width: itemWidth, height: itemWidth }}
        />
        <Text className='text-base font-semibold text-slate-900 mb-2'>No recent Posts</Text>
        <Text className='text-sm text-slate-500 text-center mb-2'>
          Make new post and promote your service
        </Text>
        <Pressable onPress={handleEdit}>
          <Text className='text-sm text-blue-600 underline'>Add post</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default ProfilePosts;
