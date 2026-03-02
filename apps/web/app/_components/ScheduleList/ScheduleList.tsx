import { useEffect, useRef, useState } from 'react';

import { IconButton, Typography, useMediaQuery } from '@mui/material';

import { ScheduleEntity } from '@avoo/axios/types/apiTypes';
import { scheduleHooks } from '@avoo/hooks';
import { useApiStatusStore } from '@avoo/store';

import AsideModal from '@/_components/AsideModal/AsideModal';
import ConfirmationDialog from '@/_components/ConfirmationDialog/ConfirmationDialog';
import ScheduleListItem from '@/_components/ScheduleListItem/ScheduleListItem';
import ScheduleUpdateForm from '@/_components/ScheduleUpdateForm/ScheduleUpdateForm';
import { useToast } from '@/_hooks/useToast';
import DeleteIcon from '@/_icons/DeleteIcon';

type Props = {
  hasMore: boolean;
  schedules: ScheduleEntity[] | null;
  incrementPage: () => void;
};

export default function ScheduleList(props: Props) {
  const { schedules, incrementPage, hasMore } = props;
  const toast = useToast();
  const listRef = useRef<HTMLUListElement>(null);
  const isMobileOrTablet = useMediaQuery('(max-width: 1023px)');

  const isPending = useApiStatusStore((state) => state.isPending);

  const { deleteScheduleMutationAsync } = scheduleHooks.useDeleteSchedule();
  const { selectedSchedule, setSelectedSchedule } = scheduleHooks.useScheduleControls();

  const [scheduleIdToDelete, setScheduleIdToDelete] = useState<number | null>(null);

  const handleOpenDeleteDialog = (id: number) => {
    setScheduleIdToDelete(id);
  };
  const handleCloseDeleteDialog = () => {
    setScheduleIdToDelete(null);
    setSelectedSchedule(null);
  };
  const handleConfirmDelete = async () => {
    handleCloseDeleteDialog();
    if (!scheduleIdToDelete) return;
    try {
      await deleteScheduleMutationAsync(scheduleIdToDelete);
      toast.success('Schedule deleted successfully');
    } catch {
      toast.error('Failed to delete schedule');
    }
  };

  useEffect(() => {
    const el = listRef.current;
    if (!el || !hasMore) return;
    if (el.scrollHeight <= el.clientHeight) {
      incrementPage();
    }
  }, [schedules?.length, hasMore]);

  const handleScheduleClick = (schedule: ScheduleEntity) => {
    if (!isMobileOrTablet) {
      return;
    }
    setSelectedSchedule(schedule);
  };

  return (
    <>
      <div className='hidden lg:grid grid-cols-[2fr_1.2fr_1.2fr_1.2fr_72px] gap-3 p-6 mb-8 text-sm text-black font-semibold bg-primary-50'>
        <div>Schedule name</div>
        <div>Applies to</div>
        <div>Start date</div>
        <div>End date</div>
        <div>Actions</div>
      </div>
      <div className='overflow-y-auto'>
        <ul className='flex flex-col gap-2 lg:block lg:divide-y lg:divide-gray-200' ref={listRef}>
          {schedules?.map((schedule) => (
            <li key={schedule.id} onClick={() => handleScheduleClick(schedule)}>
              <ScheduleListItem
                id={schedule.id}
                name={schedule.name}
                startAt={new Date(schedule.startAt)}
                endAt={schedule.endAt ? new Date(schedule.endAt) : null}
                master={schedule.master}
                isActive={new Date(schedule.startAt) <= new Date()}
                isSelected={selectedSchedule?.id === schedule.id}
                onDelete={() => handleOpenDeleteDialog(schedule.id)}
                onEdit={() => {
                  setSelectedSchedule(schedule);
                }}
              />
            </li>
          ))}
        </ul>
      </div>

      <ConfirmationDialog
        open={!!scheduleIdToDelete}
        onClose={handleCloseDeleteDialog}
        title='Delete schedule'
        content='This will permanently delete the schedule and remove it from all assigned masters. This action cannot be undone.'
        cancelText='Cancel'
        confirmText='Delete'
        onCancel={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        loading={isPending}
      />
      <AsideModal open={!!selectedSchedule} handleClose={() => setSelectedSchedule(null)}>
        {selectedSchedule && (
          <div className='w-full h-full overflow-y-auto'>
            <div className='sticky top-[-1] flex items-center justify-between py-2 bg-white z-2'>
              <Typography variant='h1'>Schedule</Typography>
              <div className='flex flex-row gap-4 lg:hidden'>
                <div className='bg-primary-50 w-10 h-10 rounded-lg flex items-center justify-center'>
                  <IconButton
                    aria-label='delete'
                    onClick={() => {
                      handleOpenDeleteDialog(selectedSchedule.id);
                    }}
                    loading={isPending}
                    disabled={isPending}
                  >
                    <DeleteIcon className='transition-colors' />
                  </IconButton>
                </div>
              </div>
            </div>
            <ScheduleUpdateForm
              schedule={selectedSchedule}
              onCancel={() => setSelectedSchedule(null)}
            />
          </div>
        )}
      </AsideModal>
    </>
  );
}
