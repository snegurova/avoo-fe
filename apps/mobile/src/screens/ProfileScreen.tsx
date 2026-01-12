import Layout from '@/shared/Layout/Layout';
import ProfileInfo from '@/components/ProfileInfo/ProfileInfo';
import { ProfilePosts } from '@/components/ProfilePosts/ProfilePosts';
import { ProfileGallery } from '@/components/ProfileGallery/ProfileGallery';
import { ProfileMaster } from '@/components/ProfileMaster/ProfileMaster';
import { ProfileSchedule } from '@/components/ProfileSchedule/ProfileSchedule';

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
