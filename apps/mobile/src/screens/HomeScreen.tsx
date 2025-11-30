import { Pressable } from 'react-native';
import { Layout } from '@/shared/Layout';
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
      <ProfileInfo />
      <ProfilePosts />
      <ProfileGallery />
      <ProfileMaster />
      <ProfileSchedule />
    </Layout>
  );
};
