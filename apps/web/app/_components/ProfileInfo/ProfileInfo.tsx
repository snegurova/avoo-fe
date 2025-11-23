'use client';

import { useRouter } from 'next/navigation';
import { routes } from '@/_routes/routes';
import { userHooks } from '@avoo/hooks';
import { ProfileLanguages } from '@/_components/ProfileLanguages/ProfileLanguages';
import { ProfileCertificates } from '@/_components/ProfileCertificates/ProfileCertificates';
import { Avatar, AvatarSize } from '@/_components/Avatar/Avatar';
import { IconButton } from '@/_components/IconButton/IconButton';

export const ProfileInfo = () => {
  const router = useRouter();
  const { visualProfileInfo, visualLanguages } = userHooks.useGetUserProfile();

  const handleNavigate = () => {
    router.push(routes.EditProfile);
  };

  return (
    <>
      <div className='flex justify-center mb-4'>
        <Avatar name={visualProfileInfo.name} size={AvatarSize.Large} />
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
