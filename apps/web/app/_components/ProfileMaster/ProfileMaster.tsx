'use client';

import { useRouter } from 'next/navigation';
import { masterHooks } from '@avoo/hooks';
import { routes } from '@/_routes/routes';
import { SectionHeader } from '@/_components/SectionHeader/SectionHeader';
import { Avatar } from '@/_components/Avatar/Avatar';

export const ProfileMaster = () => {
  const mastersInfo = masterHooks.useGetMastersProfileInfo();
  const router = useRouter();

  const handleNavigate = () => {
    router.push(routes.Masters);
  };

  return (
    <div className='px-5 py-4'>
      <SectionHeader title='Masters' onEdit={handleNavigate} />
      <div className='flex flex-wrap gap-4'>
        {mastersInfo?.map((master) => (
          <div key={master.id} className='w-[30%]'>
            <Avatar name={master.name ?? 'No name'} size='medium' />
          </div>
        ))}
      </div>
    </div>
  );
};
