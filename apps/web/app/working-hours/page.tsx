'use client';

import { SectionHeader } from '@/_components/SectionHeader/SectionHeader';
import { AuthGuard } from '@/_components/AuthGuard/AuthGuard';
import { IconButton } from '@/_components/IconButton/IconButton';
import { navigationHooks } from '@/_hooks/navigationHooks';
import { scheduleHooks } from '@avoo/hooks';
import { useRouter } from 'next/navigation';
import { routes } from '@/_routes/routes';
import { useState } from 'react';
import { ScheduleEditModal } from '@/_components/ScheduleEditModal/ScheduleEditModal';
import { Button, ButtonFit, ButtonIntent } from '@/_components/Button/Button';

export default function WorkingHoursPage() {
  const [activeScheduleId, setActiveScheduleId] = useState<number | null>(null);

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
                    <Button
                      intent={ButtonIntent.Primary}
                      fit={ButtonFit.Inline}
                      onClick={() => setActiveScheduleId(schedule.id)}
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
              <ScheduleEditModal
                scheduleId={activeScheduleId}
                isOpen={true}
                onClose={() => setActiveScheduleId(null)}
              />
            </>
          )}

          {hasSchedules ? (
            <div className='flex justify-end mt-4'>
              <Button intent={ButtonIntent.Primary} fit={ButtonFit.Inline} onClick={handleNavigate}>
                Add new schedule
              </Button>
            </div>
          ) : (
            <>
              <p className='text-gray-500'>No schedules found</p>
              <div className='flex justify-end mt-4'>
                <Button
                  intent={ButtonIntent.Primary}
                  fit={ButtonFit.Inline}
                  onClick={handleNavigate}
                >
                  Setup
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
