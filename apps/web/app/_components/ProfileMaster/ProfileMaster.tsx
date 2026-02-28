'use client';

import { useRouter } from 'next/navigation';
import { masterHooks } from '@avoo/hooks';
import { AppRoutes } from '@/_routes/routes';
import { SectionHeader } from '@/_components/SectionHeader/SectionHeader';
import Avatar, { AvatarSize } from '@/_components/Avatar/Avatar';
import { colors } from '@avoo/design-tokens';
import { localizationHooks } from '@/_hooks/localizationHooks';

export const ProfileMaster = () => {
  const mastersInfo = masterHooks.useGetMastersProfileInfo()?.items;
  const router = useRouter();

  const handleNavigate = () => {
    router.push(localizationHooks.useWithLocale(AppRoutes.Masters));
  };

  return (
    <div className='px-5 py-4'>
      <SectionHeader title='Masters' onEdit={handleNavigate} />
      <div className='flex flex-wrap gap-4'>
        {mastersInfo?.map((master) => (
          <div key={master.id} className='w-[30%] text-center'>
            <div className='mb-2 flex justify-center'>
              <Avatar
                name={master.name ?? 'No name'}
                src={master.avatarPreviewUrl ?? master.avatarUrl}
                size={AvatarSize.Large}
                bgColor={colors.primary[500]}
              />
            </div>
            {master.name && <p className='text-sm font-semibold text-slate-900'>{master.name}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};
