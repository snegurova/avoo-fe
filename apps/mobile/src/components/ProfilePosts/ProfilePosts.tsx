import { View, Text, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SectionHeader } from '@/shared/SectionHeader/SectionHeader';
import { RootNavigationProp, RootScreens } from '@/types/navigation';
import { PostImage } from '@/components/PostImage/PostImage';


export const ProfilePosts = () => {
  const navigation = useNavigation<RootNavigationProp>();

  const handleNavigate = () => {
    navigation.navigate(RootScreens.PostsScreen);
  };

  return (
    <View className='py-4'>
      <SectionHeader title='Posts' onEdit={handleNavigate} />

      <View className='items-center justify-center py-8'>
        <View className='mb-4'>
          <PostImage />
        </View>
        <Text className='text-base font-semibold text-slate-900 mb-2'>No recent Posts</Text>
        <Text className='text-sm text-slate-500 text-center mb-2'>
          Make new post and promote your service
        </Text>
        <Pressable onPress={handleNavigate}>
          <Text className='text-sm text-blue-600 underline'>Add post</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default ProfilePosts;
