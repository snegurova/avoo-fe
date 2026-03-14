'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { userHooks } from '@avoo/hooks';
import { useApiStatusStore } from '@avoo/store';

import { AvatarSize, AvatarUpload } from '@/_components/AvatarUpload/AvatarUpload';
import { Button, ButtonFit, ButtonRadius, ButtonSize } from '@/_components/Button/Button';
import { SectionHeader } from '@/_components/SectionHeader/SectionHeader';
import { localizationHooks } from '@/_hooks/localizationHooks';
import AddPhotoIcon from '@/_icons/AddPhotoIcon';
import CallIcon from '@/_icons/CallIcon';
import MailIcon from '@/_icons/MailIcon';
import PinDropIcon from '@/_icons/PinDropIcon';
import { AppRoutes } from '@/_routes/routes';

export const ProfileInfo = () => {
  const router = useRouter();
  const { visualProfileInfo, userId } = userHooks.useGetUserProfile();
  const isPending = useApiStatusStore((state) => state.isPending);
  const editProfilePath = localizationHooks.useWithLocale(AppRoutes.EditProfile);
  const publicSalonPath = localizationHooks.useWithLocale(AppRoutes.PublicSalon);

  const handleNavigateToEditProfile = useCallback(() => {
    router.push(editProfilePath);
  }, [router, editProfilePath]);

  const handleNavigate = useCallback(() => {
    handleNavigateToEditProfile();
  }, [handleNavigateToEditProfile]);

  const handleNavigateToPreview = useCallback(() => {
    if (!userId) return;

    router.push(`${publicSalonPath}/${userId}`);
  }, [publicSalonPath, router, userId]);

  const { handleUpdateProfileAvatar } = userHooks.useUpdateProfileAvatar();

  return (
    <div className='flex flex-col md:flex-row md:items-start md:gap-16'>
      <div className='mt-6 md:mt-0 mb-8 md:mb-0 flex flex-col items-center gap-4 relative  md:shrink-0'>
        <AvatarUpload
          imageUri={visualProfileInfo.avatarUrl}
          isLoading={isPending}
          onAvatarSave={handleUpdateProfileAvatar}
          size={AvatarSize.PROFILE}
          framed
          showEditIcon
          placeholderIcon={<AddPhotoIcon width={56} height={56} />}
          confirmSave
        />

        <Button
          fit={ButtonFit.Inline}
          radius={ButtonRadius.Full}
          size={ButtonSize.Small}
          onClick={handleNavigateToPreview}
          disabled={!userId}
          className='w-[168px] h-9 min-w-[168px] px-0 py-0 border-0 bg-primary-100 text-[16px] font-medium text-primary-800 shadow-none hover:bg-primary-200 hover:shadow-none focus:bg-primary-200 focus:ring-0 focus:ring-offset-0 focus:shadow-none active:bg-primary-200'
        >
          Profile Preview
        </Button>
      </div>

      <div className='flex flex-col gap-6 grow min-w-0'>
        <div>
          <SectionHeader
            title={visualProfileInfo.name ?? ''}
            onEdit={handleNavigate}
            headingSize='text-2xl'
          />
          <p className='text-sm text-slate-500 leading-5 mb-4'>{visualProfileInfo.headline}</p>
        </div>
        <div className='xl:flex xl:items-center xl:gap-10'>
          <p className='text-sm text-slate-500 mb-2 xl:mb-0 flex items-center gap-2'>
            <PinDropIcon width={16} height={16} className='text-slate-500 shrink-0' />
            <span>{visualProfileInfo.address}</span>
          </p>
          <p className='text-sm text-slate-500 mb-2 xl:mb-0 flex items-center gap-2'>
            <MailIcon width={16} height={16} className='text-slate-500 shrink-0' />
            <span>{visualProfileInfo.email}</span>
          </p>
          <p className='text-sm text-slate-500 mb-2 xl:mb-0 flex items-center gap-2'>
            <CallIcon width={16} height={16} className='text-slate-500 shrink-0' />
            <span>{visualProfileInfo.phone}</span>
          </p>
        </div>

        {visualProfileInfo.description && (
          <div className='mb-6'>
            <h3 className='text-base font-medium text-slate-900 mb-1'>About</h3>
            <p className='text-sm text-slate-600'>{visualProfileInfo.description}</p>
          </div>
        )}
      </div>
    </div>
  );
};
