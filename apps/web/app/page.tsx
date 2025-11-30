'use client';

import { AuthGuard } from '@/_components/AuthGuard/AuthGuard';
import { ProfileInfo } from '@/_components/ProfileInfo/ProfileInfo';
import { ProfileMaster } from '@/_components/ProfileMaster/ProfileMaster';
import { ProfilePosts } from '@/_components/ProfilePosts/ProfilePosts';
import { ProfileGallery } from '@/_components/ProfileGallery/ProfileGallery';
import { ProfileSchedule } from '@/_components/ProfileSchedule/ProfileSchedule';
import { Button, ButtonIntent, ButtonFit } from '@/_components/Button/Button';
import { authHooks } from '@avoo/hooks';

export default function Page() {
  const { logoutMutation } = authHooks.useLogout();

  const handleLogout = () => {
    logoutMutation();
  };

  return (
    <AuthGuard>
      <div className='container mx-auto p-4 max-w-4xl space-y-6'>
        <h1 className='text-3xl font-bold mb-6'>Profile</h1>
        <Button onClick={handleLogout} fit={ButtonFit.Fill} intent={ButtonIntent.Primary}>
          Logout
        </Button>
        <ProfileInfo />
        <ProfileMaster />
        <ProfilePosts />
        <ProfileGallery />
        <ProfileSchedule />
      </div>
    </AuthGuard>
  );
}
