import { useMemo } from 'react';
import { useTranslations } from 'next-intl';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';

import { DATE_PICKER_FORMAT, VALUE_DATE_FORMAT } from '@avoo/constants';
import { scheduleHooks } from '@avoo/hooks';

import { localizationHooks } from '@/_hooks/localizationHooks';
import CloseIcon from '@/_icons/CloseIcon';

type Props = {
  conflictIds: number[];
  newScheduleData: {
    newScheduleName: string;
    startAt: string;
  };
  open: boolean;
  onClose: () => void;
  handleConfirm: () => void;
  onCurrentStartDateUpdate: (newStartDate: string) => void;
  onCurrentEndDateUpdate: (newEndDate: string) => void;
};

const slotProps = {
  paper: {
    sx: {
      width: '100%',
      paddingY: {
        xs: 1,
        md: 3,
        xl: 4,
      },
      paddingX: {
        xs: 1,
        md: 2,
        xl: 4,
      },
      maxWidth: {
        xs: '100%',
        lg: 700,
        xl: 768,
      },
    },
  },
};

export const ConflictScheduleDialog = (props: Props) => {
  const {
    conflictIds,
    newScheduleData: { newScheduleName, startAt },
    open,
    onClose,
    handleConfirm,
    onCurrentStartDateUpdate,
  } = props;

  const conflictId = conflictIds[0];
  const t = useTranslations('private.components.ScheduleAddForm.ConflictScheduleDialog');
  const locale = localizationHooks.useGetLocale();

  const { schedule: oldSchedule } = scheduleHooks.useGetScheduleById(conflictId);
  const { handleUpdateScheduleEndAtAsync } = scheduleHooks.useUpdateScheduleEndAt(conflictId);

  const resolution = useMemo(() => {
    if (!oldSchedule) return null;

    const newStart = dayjs(startAt);
    const oldStart = dayjs(oldSchedule.startAt);
    const oldEnd = oldSchedule.endAt ? dayjs(oldSchedule.endAt) : null;

    const minOldEnd = oldStart.add(1, 'day');

    if (newStart.isAfter(minOldEnd, 'day')) {
      return {
        type: 'TRUNCATE_OLD' as const,
        proposedOldEndDate: newStart.subtract(1, 'day'),
      };
    }

    const proposedOldEnd = oldEnd ? oldEnd : minOldEnd;
    const proposedNewStart = proposedOldEnd.add(1, 'day');

    return {
      type: 'PUSH_NEW' as const,
      proposedNewStartDate: proposedNewStart,
      needsOldScheduleCap: !oldEnd,
      proposedOldEndDate: !oldEnd ? proposedOldEnd : null,
    };
  }, [oldSchedule, startAt]);

  const handleUpdateOldSchedule = async () => {
    if (resolution?.type !== 'TRUNCATE_OLD') return;

    await handleUpdateScheduleEndAtAsync({
      endAt: resolution.proposedOldEndDate.format(VALUE_DATE_FORMAT),
    });
    handleConfirm();
    onClose();
  };

  const handleUpdateNewSchedule = async () => {
    if (resolution?.type !== 'PUSH_NEW') return;

    if (resolution.needsOldScheduleCap && resolution.proposedOldEndDate) {
      await handleUpdateScheduleEndAtAsync({
        endAt: resolution.proposedOldEndDate.format(VALUE_DATE_FORMAT),
      });
    }

    onCurrentStartDateUpdate(resolution.proposedNewStartDate.format(VALUE_DATE_FORMAT));
    handleConfirm();
    onClose();
  };

  const formatDate = (date: dayjs.Dayjs | string | null | undefined, fallback = t('ongoing')) => {
    if (!date) return fallback;
    return dayjs(date).locale(locale).format(DATE_PICKER_FORMAT);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth={false} slotProps={slotProps}>
      <IconButton onClick={onClose} sx={{ position: 'absolute', top: 4, right: 4, zIndex: 10 }}>
        <CloseIcon />
      </IconButton>

      <DialogContent>
        <Typography variant='h6'>{t('scheduleConflictDetected')}</Typography>

        {!oldSchedule || !resolution ? (
          <Typography className='mt-4'>{t('loadingConflictDetails')}</Typography>
        ) : resolution.type === 'PUSH_NEW' ? (
          <>
            <div className='mb-6 mt-4 text-black tracking-[0.04em]'>
              {t('youAlreadyHaveAScheduleThatConflictsWithTheStartDate')}{' '}
              <b>{formatDate(startAt)}</b>. {t('wouldYouLikeToUpdateTheNewSchedulesStartDate')}{' '}
              <b>{formatDate(resolution.proposedNewStartDate)}</b>{' '}
              {t('soItCanStartAfterTheCurrentOneEnds')}
            </div>

            <div className='bg-primary-50 p-4 rounded-lg text-sm'>
              <Typography variant='body1' className='text-gray-500 mb-1'>
                {t('existingSchedule')}
              </Typography>
              <div>
                {t('name')}: <span className='font-medium'>{oldSchedule.name}</span>
              </div>
              <div>
                {t('startDate')}:{' '}
                <span className='ml-2 text-gray-500'>{formatDate(oldSchedule.startAt)}</span>
              </div>
              <div>
                {t('endDate')}:
                {resolution.needsOldScheduleCap ? (
                  <>
                    <span className='ml-2 text-gray-500 line-through'>{t('ongoing')}</span>
                    <span className='ml-2 text-primary-600 font-medium'>
                      {formatDate(resolution.proposedOldEndDate)}
                    </span>
                  </>
                ) : (
                  <span className='ml-2 text-gray-500'>{formatDate(oldSchedule.endAt)}</span>
                )}
              </div>
              <div className='h-[1px] bg-primary-100 my-4 w-full' />
              <Typography variant='body1' className='text-gray-500 mb-1'>
                {t('newSchedule')}
              </Typography>
              <div>
                {t('name')}: <span className='font-medium'>{newScheduleName}</span>
              </div>
              <div>
                {t('startDate')}:
                <span className='ml-2 text-red-500 line-through'>{formatDate(startAt)}</span>
                <span className='ml-2 text-green-500 font-medium'>
                  {formatDate(resolution.proposedNewStartDate)}
                </span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className='mb-6 mt-4 text-black tracking-[0.04em]'>
              {t('thisNewScheduleStartsOn')} <b>{formatDate(startAt)}</b>,{' '}
              {t('butYourCurrentScheduleEndsOn')} <b>{formatDate(oldSchedule.endAt)}</b>.{' '}
              {t('wouldYouLikeToEndTheCurrentScheduleEarly')}{' '}
              <b>{formatDate(resolution.proposedOldEndDate)}</b> {t('soTheNewOneCanBegin')}
            </div>

            <div className='bg-primary-50 p-4 rounded-lg text-sm'>
              <Typography variant='body1' className='text-gray-500 mb-1'>
                {t('existingSchedule')}
              </Typography>
              <div>
                {t('name')}: <span className='font-medium'>{oldSchedule.name}</span>
              </div>
              <div>
                {t('endDate')}:
                <span className='ml-2 text-gray-500 line-through'>
                  {formatDate(oldSchedule.endAt)}
                </span>
                <span className='ml-2 text-primary-600 font-medium'>
                  {formatDate(resolution.proposedOldEndDate)}
                </span>
              </div>

              <div className='h-[1px] bg-primary-100 my-4 w-full' />
              <Typography variant='body1' className='text-gray-500 mb-1'>
                {t('newSchedule')}
              </Typography>
              <div>
                {t('name')}: <span className='font-medium'>{newScheduleName}</span>
              </div>
              <div>
                {t('startDate')}:{' '}
                <span className='ml-2 text-black font-medium'>{formatDate(startAt)}</span>
              </div>
            </div>
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, px: 3, flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
        {resolution?.type === 'PUSH_NEW' ? (
          <Button variant='contained' color='secondary' fullWidth onClick={handleUpdateNewSchedule}>
            {t('updateNewStartDateAndSave')}
          </Button>
        ) : (
          <Button variant='contained' color='secondary' fullWidth onClick={handleUpdateOldSchedule}>
            {t('updatePreviousScheduleAndSave')}
          </Button>
        )}
        <Button
          variant='outlined'
          color='secondary'
          fullWidth
          sx={{ ml: '0 !important' }}
          onClick={onClose}
        >
          {t('editDatesManually')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
