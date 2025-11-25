'use client';

import { SectionHeader } from '@/_components/SectionHeader/SectionHeader';
import { AuthGuard } from '@/_components/AuthGuard/AuthGuard';
import { IconButton } from '@/_components/IconButton/IconButton';
import { navigationHooks } from '@/_hooks/navigationHooks';
import { scheduleHooks } from '@avoo/hooks';
import { useRouter } from 'next/navigation';
import { routes } from '@/_routes/routes';
import { useState } from 'react';
import { Modal } from '@/_components/Modal/Modal';

export default function WorkingHoursPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const schedules = scheduleHooks.useGetSchedules();
  const hasSchedules = schedules?.items && schedules.items.length > 0;
  const currentDate = new Date();
  const activeSchedule = schedules?.items.filter(
    (schedule) => !schedule?.endAt || new Date(schedule.endAt) >= currentDate,
  );
  const hasActiveSchedule = activeSchedule && activeSchedule.length > 0;
  const handleBackClick = navigationHooks.useHandleBackClick();
  const router = useRouter();
  const handleNavigate = () => {
    router.push(routes.WorkingHours);
  };

  const wh = activeSchedule?.[0]?.workingHours[0];
  const breaks = wh?.breaks[0];
  return (
    <AuthGuard>
      <div className='container mx-auto p-4 max-w-4xl'>
        <button
          onClick={() => setIsModalOpen(true)}
          className='mt-4 p-2 bg-blue-500 text-white rounded'
        >
          Open Modal
        </button>
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h2 className='text-xl mb-4'>My Modal Content</h2>
          <p>This is a custom modal built with React Portals.</p>
        </Modal>
        <IconButton icon='⬅' onClick={handleBackClick} ariaLabel='Back' />
        <SectionHeader title='Working hours' />
        <div className='bg-white border border-gray-200 rounded-lg p-6'>
          {hasActiveSchedule && (
            <>
              <h3 className='font-bold'>Working hours(Active)</h3>
              {activeSchedule.map((schedule) => (
                <div key={schedule.id} className='mt-4 space-y-2 border border-gray-200 p-2'>
                  <div className='flex justify-between'>
                    <h5 className='font-bold text-sm'>{schedule.name}</h5>
                    <span className='text-gray-500 bg-gray-200 px-2 py-1 rounded'>
                      {schedule.startAt} - {schedule.endAt}
                    </span>
                  </div>
                  <div className='flex justify-start gap-2'>
                    <p>Mon-Fri[{schedule.pattern}]</p>
                    <p>
                      {wh?.startTimeMinutes} - {wh?.endTimeMinutes}
                    </p>
                  </div>
                  <div className='flex justify-start gap-2'>
                    <p>Lunch breaks </p>
                    <p>{breaks?.breakStartTimeMinutes + ' - ' + breaks?.breakEndTimeMinutes}</p>
                  </div>
                  <div className='flex justify-end'>
                    <button
                      onClick={handleNavigate}
                      className='text-black outline-1 outline-black px-2 py-1 rounded'
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}

          {hasSchedules ? (
            <div className='flex justify-end mt-4'>
              <button onClick={handleNavigate} className='text-white bg-black px-2 py-1 rounded'>
                Add new schedule
              </button>
            </div>
          ) : (
            <>
              <p className='text-gray-500'>No schedules found</p>
              <div className='flex justify-end mt-4'>
                <button
                  onClick={handleNavigate}
                  className='text-black outline-1 outline-black px-2 py-1 rounded'
                >
                  Setup
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
