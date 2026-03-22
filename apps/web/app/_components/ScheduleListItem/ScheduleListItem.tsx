import { useLocale, useTranslations } from 'next-intl';

import { IconButton } from '@mui/material';
import { tv } from 'tailwind-variants';

import { MasterWithRelationsEntityResponse } from '@avoo/axios/types/apiTypes';
import { useApiStatusStore } from '@avoo/store';

import Avatar, { AvatarSize } from '@/_components/Avatar/Avatar';
import DeleteIcon from '@/_icons/DeleteIcon';
import EditSquareIcon from '@/_icons/EditSquareIcon';
import GroupIcon from '@/_icons/GroupIcon';
import { formatLocalizedDate } from '@/_utils/intlFormatters';

type Props = {
  id: number;
  name: string;
  startAt: Date;
  endAt: Date | null;
  master: MasterWithRelationsEntityResponse | null;
  isActive: boolean;
  isSelected: boolean;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
};

export default function ScheduleListItem(props: Props) {
  const t = useTranslations('private.components.ScheduleListItem.ScheduleListItem');
  const locale = useLocale();
  const { id, name, startAt, endAt, master, isActive, isSelected, onDelete, onEdit } = props;

  const isPending = useApiStatusStore((state) => state.isPending);

  const convertDate = (date: Date | null) => {
    if (!date) return t('ongoing');
    return formatLocalizedDate(date, locale);
  };

  const scheduleVariants = tv({
    base: 'flex flex-col border border-gray-200 rounded-lg p-4 gap-3 lg:grid lg:grid-cols-[2fr_1.2fr_1.2fr_1.2fr_72px] px-6 py-4 text-sm font-regular hover:bg-primary-50 lg:border-0 lg:rounded-none',
    variants: {
      isActive: {
        true: '',
        false: 'bg-gray-100',
      },
      isSelected: {
        true: 'bg-primary-100',
        false: '',
      },
    },
  });

  return (
    <div className={scheduleVariants({ isActive, isSelected })}>
      <div className='flex flex-col md:flex-row md:justify-between gap-2 lg:contents'>
        <div className='flex flex-col justify-center'>
          <h3 className='font-medium'>{name}</h3>
        </div>
        <div className='flex flex-col justify-center'>
          {master ? (
            <div className='flex items-center gap-2 flex-row'>
              <Avatar src={master.avatarPreviewUrl} name={master.name} size={AvatarSize.Small} />
              <span>{master.name}</span>
            </div>
          ) : (
            <span className='flex items-center gap-2 flex-row'>
              <GroupIcon />
              <span>{t('allMasters')}</span>
            </span>
          )}
        </div>
      </div>
      <span className='lg:hidden bg-primary-100 w-full h-[1px]'></span>

      <div className='flex flex-col gap-2 md:flex-row lg:contents'>
        <div className='flex flex-row justify-between md:justify-start gap-2 lg:flex-col lg:justify-center'>
          <p className='lg:hidden text-sm text-gray-500'>{t('startDate')}</p>
          <p className='text-sm text-gray-700 font-medium lg:font-normal'>{convertDate(startAt)}</p>
        </div>

        <div className='flex flex-row justify-between md:justify-start gap-2 lg:flex-col lg:justify-center'>
          <p className='lg:hidden text-sm text-gray-500'>{t('endDate')}</p>
          <p className='text-sm text-gray-700 font-medium lg:font-normal'>{convertDate(endAt)}</p>
        </div>
      </div>
      <div className='hidden lg:flex items-center me-2'>
        <IconButton
          aria-label={t('editSm')}
          onClick={() => onEdit(id)}
          loading={isPending}
          disabled={isPending}
        >
          <EditSquareIcon className='transition-colors' />
        </IconButton>
        <IconButton
          aria-label={t('deleteSm')}
          onClick={() => {
            onDelete(id);
          }}
          loading={isPending}
          disabled={isPending}
        >
          <DeleteIcon className='transition-colors' />
        </IconButton>
      </div>
    </div>
  );
}
