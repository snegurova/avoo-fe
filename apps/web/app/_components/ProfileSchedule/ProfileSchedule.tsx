'use client';

import { useRouter } from 'next/navigation';
import { scheduleHooks } from '@avoo/hooks';
import { routes } from '@/_routes/routes';
import { SectionHeader } from '@/_components/SectionHeader/SectionHeader';

export const ProfileSchedule = () => {
  const schedules = scheduleHooks.useGetSchedules();
  const hasSchedules = schedules?.items && schedules.items.length > 0;
  const router = useRouter();

  const handleNavigate = () => {
    router.push(routes.WorkingHours);
  };

  if (!hasSchedules) {
    return (
      <div className='px-5 py-4 border-t border-gray-200'>
        <SectionHeader title='Working hours' onEdit={handleNavigate} />
        <p className='text-sm text-slate-500'>
          Set up your working hours{' '}
          <button onClick={handleNavigate} className='text-blue-600 underline'>
            Calendar Settings
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className='px-5 py-4 border-t border-gray-200'>
      <SectionHeader title='Working hours' onEdit={handleNavigate} />
      <div className='space-y-2'>
        {schedules.items.map((item, index) => (
          <div key={index} className='flex items-center justify-between'>
            <span className='text-base text-slate-900'>{item.name}</span>
            <span className='text-base text-slate-700'>{item.pattern}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
