'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Avatar, { AvatarSize } from '@/_components/Avatar/Avatar';
import { Typography } from '@mui/material';
import { Exception } from '@avoo/axios/types/apiTypes';
import { colors, typography } from '@avoo/design-tokens';
import dayjs from 'dayjs';
import EditSquareIcon from '@/_icons/EditSquareIcon';
import DeleteIcon from '@/_icons/DeleteIcon';
import DoNotDisturbIcon from '@/_icons/DoNotDisturbIcon';
import ScheduleIcon from '@/_icons/ScheduleIcon';
import { masterHooks, exceptionHooks } from '@avoo/hooks';
import { useToast } from '@/_hooks/useToast';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
import { IconButton } from '@/_components/IconButton/IconButton';

type Props = {
  item: Exception;
  onEdit?: (item: Exception) => void;
};

const TimeOffListItem = ({ item, onEdit }: Props) => {
  const masters = masterHooks.useGetMastersProfileInfo()?.items;
  const toast = useToast();
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const foundMaster = masters?.find((m) => m.id === item.masterId);
  const masterLabel = foundMaster?.name ?? item.masterId ?? item.userId ?? '—';

  const { mutate: deleteException, isPending: isDeletePending } = exceptionHooks.useDeleteException(
    () => {
      toast.info('Time off was deleted!');
      setIsDeleteConfirmOpen(false);
    },
  );

  const getModeLabel = (type?: string) => {
    const typeStr = String(type ?? '').toUpperCase();
    if (!typeStr) return 'Time off';
    switch (typeStr) {
      case 'PERSONAL_WORKING':
      case 'HOLIDAY_WORKING':
      case 'VACATION_WORKING':
      case 'OTHER_WORKING':
        return 'Working time';
      default:
        return 'Time off';
    }
  };

  const modeLabel = getModeLabel(item.type);

  const from = dayjs(item.dateFrom);
  const to = dayjs(item.dateTo);
  const sameDay = from.isSame(to, 'day');
  const wholeDay = item.startTimeMinutes === 0 && item.endTimeMinutes === 1440;

  const minsToTime = (mins?: number) => {
    if (mins == null) return '';
    if (mins === 1440) return '24:00';
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  const formatDay = (d: dayjs.Dayjs) => d.format('ddd D. MMM');

  const noteRef = useRef<HTMLDivElement | null>(null);
  const [isNoteTruncated, setIsNoteTruncated] = useState(false);

  useEffect(() => {
    const el = noteRef.current;
    if (!el) {
      setIsNoteTruncated(false);
      return;
    }

    const check = () => {
      setIsNoteTruncated(el.scrollWidth > el.clientWidth + 1);
    };

    check();

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(check);
      resizeObserver.observe(el);
    }

    return () => {
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, [item.note]);

  const handleOpenDetails = useCallback(() => {
    onEdit?.(item);
  }, [onEdit, item]);

  const handleDeleteClick = useCallback(() => {
    setIsDeleteConfirmOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    deleteException(item.id);
  }, [deleteException, item.id]);

  const renderDateRange = () => {
    if (sameDay) {
      return wholeDay ? (
        <span>{formatDay(from)}</span>
      ) : (
        <span>
          {minsToTime(item.startTimeMinutes)} - {minsToTime(item.endTimeMinutes)}, {formatDay(from)}
        </span>
      );
    }
    return wholeDay ? (
      <div>
        <div>from {formatDay(from)}</div>
        <div>to {formatDay(to)}</div>
      </div>
    ) : (
      <div>
        <div>
          from {minsToTime(item.startTimeMinutes)} {formatDay(from)}
        </div>
        <div>
          to {minsToTime(item.endTimeMinutes)} {formatDay(to)}
        </div>
      </div>
    );
  };

  return (
    <div className='bg-white rounded-lg lg:rounded-none p-4 lg:py-6 lg:px-8 border border-gray-200 lg:border-l-0 lg:border-r-0'>
      <button
        type='button'
        className='flex flex-col md:flex-row gap-3 items-start md:items-center w-full lg:hidden cursor-pointer text-left'
        onClick={handleOpenDetails}
        aria-label={`Open ${String(masterLabel)} details`}
      >
        <div className='w-full md:w-[464px] flex items-start md:items-center gap-4'>
          <div className='flex-shrink-0 self-center'>
            <Avatar
              name={String(masterLabel)}
              size={AvatarSize.Large}
              bgColor={colors.primary[200]}
            />
          </div>

          <div className='flex-1'>
            <Typography
              component='div'
              className='break-words whitespace-normal'
              sx={{
                fontFamily: typography.fontFamily.sans,
                fontSize: typography.fontSize.lg,
                fontWeight: typography.fontWeight.bold,
                color: colors.gray[900],
              }}
            >
              {masterLabel}
            </Typography>

            <div className='text-sm text-gray-700 mt-1'>{renderDateRange()}</div>

            <div className='md:hidden'>
              <div className='w-full h-px my-3' style={{ backgroundColor: colors.primary[100] }} />
              <div className='text-sm text-gray-500 flex items-center gap-2'>
                {modeLabel === 'Time off' ? (
                  <DoNotDisturbIcon className='w-4 h-4 text-red-600' />
                ) : (
                  <ScheduleIcon className='w-4 h-4 text-green-600' />
                )}
                <span>{modeLabel}</span>
              </div>
              <div className='text-sm text-gray-600 mt-1 truncate max-w-[125px]'>
                {item.note ?? '—'}
              </div>
            </div>
          </div>
        </div>

        <div className='hidden md:flex md:flex-col md:w-auto lg:w-1/5'>
          <div className='mt-3 md:mt-0 md:flex md:flex-col'>
            <div className='text-sm text-gray-500 flex items-center gap-2'>
              {modeLabel === 'Time off' ? (
                <DoNotDisturbIcon className='w-4 h-4 text-red-600' />
              ) : (
                <ScheduleIcon className='w-4 h-4 text-green-600' />
              )}
              <span>{modeLabel}</span>
            </div>

            <div className='text-sm text-gray-600 mt-1 truncate max-w-[125px]'>
              {item.note ?? '—'}
            </div>
          </div>
        </div>
      </button>

      <div className='hidden lg:flex items-center gap-3 w-full min-w-0'>
        <div className='flex items-center gap-3 w-1/5'>
          <Avatar
            name={String(masterLabel)}
            size={AvatarSize.Large}
            bgColor={colors.primary[200]}
          />
          <div>
            <Typography
              component='div'
              className='break-words whitespace-normal'
              sx={{
                fontFamily: typography.fontFamily.sans,
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.medium,
                color: colors.gray[700],
              }}
            >
              {masterLabel}
            </Typography>
          </div>
        </div>

        <div className='w-1/5 text-sm text-gray-700 break-words whitespace-normal flex items-center gap-2'>
          {modeLabel === 'Time off' ? (
            <DoNotDisturbIcon className='w-4 h-4 text-red-600' />
          ) : (
            <ScheduleIcon className='w-4 h-4 text-green-600' />
          )}
          <span>{modeLabel}</span>
        </div>
        <div className='w-1/5 text-sm text-gray-700 break-words whitespace-normal'>
          {renderDateRange()}
        </div>
        <div className='w-1/5 text-sm text-gray-600'>
          <div className={`relative group ${isNoteTruncated ? 'cursor-pointer' : ''}`}>
            <div ref={noteRef} className='truncate max-w-[125px]'>
              {item.note ?? '—'}
            </div>
            {item.note && isNoteTruncated ? (
              <div className='hidden lg:block absolute left-0 top-full mt-2 w-[225px] p-4 border border-gray-200 rounded-[8px] bg-white text-sm text-gray-700 z-20 break-words whitespace-normal opacity-0 transform -translate-y-1 scale-95 lg:group-hover:opacity-100 lg:group-hover:translate-y-0 lg:group-hover:scale-100 transition-all duration-200 ease-out pointer-events-none lg:group-hover:pointer-events-auto'>
                {item.note}
              </div>
            ) : null}
          </div>
        </div>
        <div className='w-12 flex items-center gap-2'>
          <IconButton
            icon={<EditSquareIcon />}
            ariaLabel='Edit time off'
            onClick={handleOpenDetails}
            className='flex items-center justify-center p-2.5'
          />
          <IconButton
            icon={<DeleteIcon />}
            ariaLabel='Delete'
            onClick={handleDeleteClick}
            className='flex items-center justify-center p-2.5'
          />
        </div>
      </div>

      <ConfirmationModal
        isOpen={isDeleteConfirmOpen}
        onCancel={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title='Delete time off'
        description='Are you sure you want to permanently delete this schedule exception? This action cannot be undone.'
        confirmText='Delete time off'
        submitDisabled={isDeletePending}
      />
    </div>
  );
};

export default TimeOffListItem;
