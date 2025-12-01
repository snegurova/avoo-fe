'use client';

import AppWrapper from '@/_components/AppWrapper/AppWrapper';
import { ProfileInfo } from '@/_components/ProfileInfo/ProfileInfo';
import { ProfileMaster } from '@/_components/ProfileMaster/ProfileMaster';
import { ProfilePosts } from '@/_components/ProfilePosts/ProfilePosts';
import { ProfileGallery } from '@/_components/ProfileGallery/ProfileGallery';
import { ProfileSchedule } from '@/_components/ProfileSchedule/ProfileSchedule';
import { Button, ButtonIntent, ButtonFit } from '@/_components/Button/Button';
import { authHooks } from '@avoo/hooks';

export default function ProfilePage() {
  const { logoutMutation } = authHooks.useLogout();

  const handleLogout = () => {
    logoutMutation();
  };

  return (
    <AppWrapper>
      <div className='py-4 flex flex-col'>
        <div className='px-4'>
          <h1 className='text-3xl font-bold mb-6'>Profile</h1>
        </div>
        <Button onClick={handleLogout} fit={ButtonFit.Fill} intent={ButtonIntent.Primary}>
          Logout
        </Button>
        <div className='overflow-auto px-4'>
          <ProfileInfo />
          <ProfileMaster />
          <ProfilePosts />
          <ProfileGallery />
          <ProfileSchedule />
        </div>
      </div>
    </AppWrapper>
  );
}
