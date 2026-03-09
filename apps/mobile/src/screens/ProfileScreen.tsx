import { ProfileGallery } from '@/components/ProfileGallery/ProfileGallery';
import ProfileInfo from '@/components/ProfileInfo/ProfileInfo';
import { ProfileMaster } from '@/components/ProfileMaster/ProfileMaster';
import { ProfilePosts } from '@/components/ProfilePosts/ProfilePosts';
import { ProfileSchedule } from '@/components/ProfileSchedule/ProfileSchedule';
import Layout from '@/shared/Layout/Layout';

export const ProfileScreen = () => {
  return (
    <Layout showBack={true}>
      <ProfileInfo />
      <ProfilePosts />
      <ProfileGallery />
      <ProfileMaster />
      <ProfileSchedule />
    </Layout>
  );
};

export default ProfileScreen;
