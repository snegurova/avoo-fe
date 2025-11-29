import { View, Pressable } from 'react-native';
import { Layout } from '@/shared/Layout';
import Avatar from '@/components/Avatar/Avatar';
import ProfileInfo from '@/components/ProfileInfo/ProfileInfo';
import { MaterialIcons } from '@/shared/icons';
import { ProfilePosts } from '@/components/ProfilePosts/ProfilePosts';
import { ProfileGallery } from '@/components/ProfileGallery/ProfileGallery';
import { ProfileMaster } from '@/components/ProfileMaster/ProfileMaster';
import { ProfileSchedule } from '@/components/ProfileSchedule/ProfileSchedule';

export const HomeScreen = () => {
  const leftContent = (
    <Pressable>
      <MaterialIcons name='menu' size={24} color='black' />
    </Pressable>
  );

  const rightContent = (
    <Pressable>
      <MaterialIcons name='settings' size={24} color='black' />
    </Pressable>
  );

  return (
    <Layout title='AVOO' leftContent={leftContent} rightContent={rightContent} hasBottomTab={true}>
      <View className='items-center justify-center p-6'>
        <Avatar size={80} iconName='person' iconColor='black' iconSize={40} editable={true} />
      </View>
      <ProfileInfo />
      <ProfilePosts />
      <ProfileGallery />
      <ProfileMaster />
      <ProfileSchedule />
    </Layout>
  );
};
