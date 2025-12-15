'use client';

import { useState } from 'react';
import { scheduleHooks } from '@avoo/hooks';
import { SectionHeader } from '@/_components/SectionHeader/SectionHeader';
import { AuthGuard } from '@/_components/AuthGuard/AuthGuard';
import { ScheduleEditModal } from '@/_components/ScheduleEditModal/ScheduleEditModal';
import { ScheduleAddModal } from '@/_components/ScheduleAddModal/ScheduleAddModal';
import { routerHooks } from '@/_hooks/routerHooks';
import { Button, IconButton } from '@mui/material';
import ArrowReturnBackIcon from '@/_icons/ArrowReturnBackIcon';
import InfinityIcon from '@/_icons/InfinityIcon';
import { colors } from '@avoo/design-tokens';

const toDisplayDate = (date: Date) => {
  const result = new Date(date);
  return result.toLocaleDateString();
};

export default function WorkingHoursPage() {
  const [activeScheduleId, setActiveScheduleId] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const schedules = scheduleHooks.useGetSchedules();
  const hasSchedules = schedules?.items && schedules.items.length > 0;
  const currentDate = new Date();
  const activeSchedule = schedules?.items.filter(
    (schedule) => !schedule?.endAt || new Date(schedule.endAt) >= currentDate,
  );
  const hasActiveSchedule = activeSchedule && activeSchedule.length > 0;
  const handleBackClick = routerHooks.useHandleNavigateToHomeClick();

  const wh = activeSchedule?.[0]?.workingHours[0];
  const breaks = wh?.breaks[0];
  return (
    <AuthGuard>
      <div className='container mx-auto p-4 max-w-4xl'>
        <IconButton onClick={handleBackClick}>
          <ArrowReturnBackIcon />
        </IconButton>
        <SectionHeader title='Working hours' />
        <div className='bg-white border border-gray-200 rounded-lg p-6'>
          {hasActiveSchedule && (
            <>
              <h3 className='font-bold'>Working hours(Active)</h3>
              {activeSchedule.map((schedule) => (
                <div key={schedule.id} className='mt-4 space-y-2 border border-gray-200 p-2'>
                  <div className='flex justify-between'>
                    <h5 className='font-bold text-sm'>{schedule.name}</h5>
                    <span className='bg-gray-200 px-2 py-1 rounded flex items-center gap-2'>
                      {toDisplayDate(new Date(schedule.startAt))} {'-'}
                      {schedule.endAt ? (
                        toDisplayDate(new Date(schedule.endAt))
                      ) : (
                        <InfinityIcon fill={colors.gray['500']} />
                      )}
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
                      color='secondary'
                      variant='outlined'
                      onClick={() => setActiveScheduleId(schedule.id)}
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
              {activeScheduleId && (
                <ScheduleEditModal
                  scheduleId={activeScheduleId}
                  isOpen={!!activeScheduleId}
                  onClose={() => setActiveScheduleId(null)}
                />
              )}
            </>
          )}

          {hasSchedules ? (
            <div className='flex justify-end mt-4'>
              <Button color='secondary' variant='contained' onClick={() => setIsAddModalOpen(true)}>
                Add new schedule
              </Button>
            </div>
          ) : (
            <>
              <p>No schedules found</p>
              <div className='flex justify-end mt-4'>
                <Button
                  color='secondary'
                  variant='contained'
                  onClick={() => setIsAddModalOpen(true)}
                >
                  Setup
                </Button>
              </div>
            </>
          )}
          <ScheduleAddModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
        </div>
      </div>
    </AuthGuard>
  );
}
