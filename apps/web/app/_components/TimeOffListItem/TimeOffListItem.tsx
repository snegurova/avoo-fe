'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';

import { Typography } from '@mui/material';
import dayjs from 'dayjs';

import type { Exception } from '@avoo/axios/types/apiTypes';
import { colors, typography } from '@avoo/design-tokens';
import { exceptionHooks, exceptionUtils } from '@avoo/hooks';

import Avatar, { AvatarSize } from '@/_components/Avatar/Avatar';
import { IconButton } from '@/_components/IconButton/IconButton';
import { useToast } from '@/_hooks/useToast';
import DeleteIcon from '@/_icons/DeleteIcon';
import DoNotDisturbIcon from '@/_icons/DoNotDisturbIcon';
import EditSquareIcon from '@/_icons/EditSquareIcon';
import ScheduleIcon from '@/_icons/ScheduleIcon';
import { formatLocalizedWeekdayDayMonth } from '@/_utils/intlFormatters';

import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';

type Props = {
  item: Exception;
  onEdit?: (item: Exception) => void;
};

const TimeOffListItem = ({ item, onEdit }: Props) => {
  const t = useTranslations('private.components.TimeOffListItem.TimeOffListItem');
  const locale = useLocale();
  const toast = useToast();
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const { mutate: deleteException, isPending: isDeletePending } = exceptionHooks.useDeleteException(
    () => {
      toast.info(t('deleteInfo'));
      setIsDeleteConfirmOpen(false);
    },
  );

  const getModeLabel = (type?: string) => {
    const typeStr = String(type ?? '').toUpperCase();
    if (!typeStr) return t('timeOff');
    switch (typeStr) {
      case 'PERSONAL_WORKING':
      case 'HOLIDAY_WORKING':
      case 'VACATION_WORKING':
      case 'OTHER_WORKING':
        return t('workingTime');
      default:
        return t('timeOff');
    }
  };

  const modeLabel = getModeLabel(item.type);

  const from = dayjs(item.dateFrom);
  const to = exceptionUtils.normalizeExceptionEndDate(item.dateFrom, item.dateTo);
  const sameDay = from.isSame(to, 'day');
  const wholeDay = item.startTimeMinutes === 0 && item.endTimeMinutes === 1440;

  const minsToTime = (mins?: number) => {
    if (mins == null) return '';
    if (mins === 1440) return '24:00';
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  const formatDay = (d: dayjs.Dayjs) => formatLocalizedWeekdayDayMonth(d.toDate(), locale);

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
        <div>
          {t('from')} {formatDay(from)}
        </div>
        <div>
          {t('to')} {formatDay(to)}
        </div>
      </div>
    ) : (
      <div>
        <div>
          {t('from')} {minsToTime(item.startTimeMinutes)} {formatDay(from)}
        </div>
        <div>
          {t('to')} {minsToTime(item.endTimeMinutes)} {formatDay(to)}
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
        aria-label={t('openDetails', { name: String(item.master.name) })}
      >
        <div className='w-full md:w-[464px] flex items-start md:items-center gap-4'>
          <div className='flex-shrink-0 self-center'>
            <Avatar
              name={item.master.name}
              size={AvatarSize.Large}
              src={item.master.avatarPreviewUrl}
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
              {item.master.name}
            </Typography>

            <div className='text-sm text-gray-700 mt-1'>{renderDateRange()}</div>

            <div className='md:hidden'>
              <div className='w-full h-px my-3' style={{ backgroundColor: colors.primary[100] }} />
              <div className='text-sm text-gray-500 flex items-center gap-2'>
                {modeLabel === t('timeOff') ? (
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
              {modeLabel === t('timeOff') ? (
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
            name={item.master.name}
            size={AvatarSize.Large}
            src={item.master.avatarPreviewUrl}
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
              {item.master.name}
            </Typography>
          </div>
        </div>

        <div className='w-1/5 text-sm text-gray-700 break-words whitespace-normal flex items-center gap-2'>
          {modeLabel === t('timeOff') ? (
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
            ariaLabel={t('editTimeOff')}
            onClick={handleOpenDetails}
            className='flex items-center justify-center p-2.5'
          />
          <IconButton
            icon={<DeleteIcon />}
            ariaLabel={t('delete')}
            onClick={handleDeleteClick}
            className='flex items-center justify-center p-2.5'
          />
        </div>
      </div>

      <ConfirmationModal
        isOpen={isDeleteConfirmOpen}
        onCancel={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title={t('deleteTimeOff')}
        description={t('deleteConfirmDescription')}
        confirmText={t('deleteTimeOff')}
        submitDisabled={isDeletePending}
      />
    </div>
  );
};

export default TimeOffListItem;
