import { ActivityIndicator, Pressable } from 'react-native';
import { Suspense } from 'react';
import { Layout } from '@/shared/Layout';
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
      <Suspense fallback={<ActivityIndicator size='large' className='p-6' />}>
        <ProfileInfo />
      </Suspense>
      <ProfilePosts />
      <ProfileGallery />
      <ProfileMaster />
      <ProfileSchedule />
    </Layout>
  );
};
