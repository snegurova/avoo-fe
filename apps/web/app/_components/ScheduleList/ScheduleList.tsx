import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

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
  const t = useTranslations('private.components.ScheduleList.ScheduleList');
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
      toast.success(t('deleteSuccess'));
    } catch {
      toast.error(t('deleteError'));
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
      <div className='overflow-y-auto'>
        <ul className='flex flex-col gap-2 lg:block lg:divide-y lg:divide-gray-200' ref={listRef}>
          {schedules && schedules.length !== 0 ? (
            schedules.map((schedule) => (
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
            ))
          ) : isPending ? (
            <Typography variant='h1' className='text-center'>
              {t('loading')}
            </Typography>
          ) : (
            <Typography variant='h1' className='text-center'>
              {t('noSchedulesFound')}
            </Typography>
          )}
        </ul>
      </div>

      <ConfirmationDialog
        open={!!scheduleIdToDelete}
        onClose={handleCloseDeleteDialog}
        title={t('deleteSchedule')}
        content={t('deleteContent')}
        cancelText={t('cancel')}
        confirmText={t('delete')}
        onCancel={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        loading={isPending}
      />
      <AsideModal open={!!selectedSchedule} handleClose={() => setSelectedSchedule(null)}>
        {selectedSchedule && (
          <div className='w-full h-full overflow-y-auto'>
            <div className='sticky top-[-1] flex items-center justify-between py-2 bg-white z-2'>
              <Typography variant='h1'>{t('schedule')}</Typography>
              <div className='flex flex-row gap-4 lg:hidden'>
                <div className='bg-primary-50 w-10 h-10 rounded-lg flex items-center justify-center'>
                  <IconButton
                    aria-label={t('deleteSm')}
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
