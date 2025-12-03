'use client';

import { useRouter } from 'next/navigation';
import { appRoutes } from '@/_routes/routes';
import { userHooks } from '@avoo/hooks';
import { ProfileLanguages } from '@/_components/ProfileLanguages/ProfileLanguages';
import { ProfileCertificates } from '@/_components/ProfileCertificates/ProfileCertificates';
import AvatarUpload from '@/_components/Avatar/AvatarUpload';
import { IconButton } from '@/_components/IconButton/IconButton';
import { useApiStatusStore } from '@avoo/store';

export const ProfileInfo = () => {
  const router = useRouter();
  const { visualProfileInfo, visualLanguages } = userHooks.useGetUserProfile();
  const { handleUpdateAvatar } = userHooks.usePatchUserProfileAvatar();
  const isPending = useApiStatusStore((state) => state.isPending);

  const handleNavigate = () => {
    router.push(appRoutes.EditProfile);
  };

  const handleImageSelect = (file: File) => {
    handleUpdateAvatar(file);
  };

  return (
    <>
      <div className='flex justify-center mb-4'>
        <AvatarUpload
          imageUri={visualProfileInfo.avatarPreviewUrl}
          onImageSelected={handleImageSelect}
          isLoading={isPending}
        />
      </div>
      <div className='bg-white border border-blue-500 rounded-xl p-4 mx-5 mb-4 relative'>
        <div className='absolute top-4 right-4'>
          <IconButton icon='✏️' onClick={handleNavigate} ariaLabel='Edit Profile' />
        </div>
        <div className='pr-8'>
          <h2 className='text-2xl font-bold text-slate-900 mb-2'>{visualProfileInfo.name}</h2>
          <p className='text-sm text-slate-500 leading-5 mb-4'>{visualProfileInfo.description}</p>
          <h3 className='text-base font-semibold text-slate-900 mb-2 mt-4'>
            {visualProfileInfo.name}
          </h3>
          <p className='text-sm text-slate-500 mb-1'>{visualProfileInfo.address}</p>
          <p className='text-sm text-slate-500 mb-1'>{visualProfileInfo.email}</p>
          <p className='text-sm text-slate-500 mb-1'>{visualProfileInfo.phone}</p>
        </div>
      </div>

      <ProfileLanguages languages={visualLanguages} />
      <ProfileCertificates />
    </>
  );
};
