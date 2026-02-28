'use client';

import { useRouter } from 'next/navigation';
import { scheduleHooks } from '@avoo/hooks';
import { AppRoutes } from '@/_routes/routes';
import { SectionHeader } from '@/_components/SectionHeader/SectionHeader';
import { localizationHooks } from '@/_hooks/localizationHooks';

export const ProfileSchedule = () => {
  const { data: schedulesData } = scheduleHooks.useGetSchedulesInfinite({ limit: 10 });
  const schedules = schedulesData?.pages[0]?.data;
  const hasSchedules = Array.isArray(schedules) && schedules.length > 0;
  const router = useRouter();

  const handleNavigate = () => {
    router.push(localizationHooks.useWithLocale(AppRoutes.WorkingHours));
  };

  return (
    <div className='px-5 py-4 border-t border-gray-200'>
      <SectionHeader title='Working hours' onEdit={handleNavigate} />

      {!hasSchedules && (
        <p className='text-sm text-slate-500'>
          Set up your working hours{' '}
          <button onClick={handleNavigate} className='text-blue-600 underline'>
            Calendar Settings
          </button>
        </p>
      )}

      {hasSchedules && (
        <div className='space-y-2'>
          {schedules.map((item, index) => (
            <div key={index} className='flex items-center justify-between'>
              <span className='text-base text-slate-900'>{item.name}</span>
              <span className='text-base text-slate-700'>{item.pattern}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
