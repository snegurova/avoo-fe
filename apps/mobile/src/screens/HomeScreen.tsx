import { View, Pressable } from 'react-native';
import { Layout } from '@/shared/Layout';
import Avatar from '@/components/Avatar/Avatar';
import ProfileInfo from '@/components/ProfileInfo/ProfileInfo';
import { FontAwesome } from '@expo/vector-icons';
import { ProfilePosts } from '@/components/ProfilePosts/ProfilePosts';
import { ProfileGallery } from '@/components/ProfileGallery/ProfileGallery';
import { ProfileMaster } from '@/components/ProfileMaster/ProfileMaster';
import { ProfileSchedule } from '@/components/ProfileSchedule/ProfileSchedule';

export const HomeScreen = () => {
  const leftContent = (
    <Pressable>
      <FontAwesome name='bars' size={24} color='black' />
    </Pressable>
  );

  const rightContent = (
    <Pressable>
      <FontAwesome name='gear' size={24} color='black' />
    </Pressable>
  );

  return (
    <Layout title='AVOO' leftContent={leftContent} rightContent={rightContent} hasBottomTab={true}>
      <View className='items-center justify-center p-6'>
        <Avatar size={80} iconName='user' iconColor='black' iconSize={40} editable={true} />
      </View>
      <ProfileInfo />
      <ProfilePosts />
      <ProfileGallery />
      <ProfileMaster />
      <ProfileSchedule />
    </Layout>
  );
};
