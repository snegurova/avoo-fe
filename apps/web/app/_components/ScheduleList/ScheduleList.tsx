import { useApiStatusStore } from '@avoo/store';
import ConfirmationDialog from '../ConfirmationDialog/ConfirmationDialog';
import { useEffect, useRef, useState } from 'react';
import { useToast } from '@/_hooks/useToast';
import { ScheduleEntity } from '@avoo/axios/types/apiTypes';
import ScheduleListItem from '../ScheduleListItem/ScheduleListItem';

type Props = {
  hasMore: boolean;
  schedules: ScheduleEntity[] | null;
  incrementPage: () => void;
};

export default function ScheduleList(props: Props) {
  const { schedules, incrementPage, hasMore } = props;
  const toast = useToast();
  const listRef = useRef<HTMLUListElement>(null);

  const isPending = useApiStatusStore((state) => state.isPending);

  const [scheduleIdToDelete, setScheduleIdToDelete] = useState<number | null>(null);

  const handleOpenDeleteDialog = (id: number) => {
    setScheduleIdToDelete(id);
  };
  const handleCloseDeleteDialog = () => {
    setScheduleIdToDelete(null);
  };
  const handleConfirmDelete = async () => {
    handleCloseDeleteDialog();
    if (!scheduleIdToDelete) return;
    try {
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

  return (
    <>
      <div>
        <div className='grid grid-cols-[2fr_1.2fr_1.2fr_1.2fr_72px] gap-3 p-6 mb-8 text-sm text-black font-semibold bg-primary-50'>
          <div>Schedule name</div>
          <div>Applies to</div>
          <div>Start date</div>
          <div>End date</div>
          <div>Actions</div>
        </div>
        <ul className='divide-y divide-gray-200' ref={listRef}>
          {schedules?.map((schedule) => (
            <li key={schedule.id}>
              <ScheduleListItem
                id={schedule.id}
                name={schedule.name}
                startAt={new Date(schedule.startAt)}
                endAt={schedule.endAt ? new Date(schedule.endAt) : null}
                master={schedule.master}
                isActive={new Date(schedule.startAt) <= new Date()}
                onDelete={() => handleOpenDeleteDialog(schedule.id)}
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
    </>
  );
}
