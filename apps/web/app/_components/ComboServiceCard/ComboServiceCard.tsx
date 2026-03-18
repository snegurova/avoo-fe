import { useTranslations } from 'next-intl';

import { IconButton } from '@mui/material';
import { tv } from 'tailwind-variants';

import { Service } from '@avoo/axios/types/apiTypes';
import { timeUtils } from '@avoo/shared';
import { useApiStatusStore } from '@avoo/store';

import DeleteIcon from '@/_icons/DeleteIcon';
import EditSquareIcon from '@/_icons/EditSquareIcon';
import SearchActivity from '@/_icons/SearchActivity';

type Props = {
  id: number;
  name: string;
  durationMinutes: number;
  isActive: boolean;
  services: Service[];
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
  isSelected: boolean;
};

export default function ComboServiceCard(props: Props) {
  const t = useTranslations('private.components.ComboServiceCard.ComboServiceCard');
  const { id, name, durationMinutes, isActive, services, onDelete, onEdit, isSelected } = props;

  const isPending = useApiStatusStore((state) => state.isPending);

  const topBar = tv({
    base: 'flex items-center justify-between py-2 px-6 rounded-t-lg',
    variants: {
      isActive: {
        true: 'bg-primary-50',
        false: 'bg-gray-100',
      },
    },
  });

  const wrapper = tv({
    base: 'flex flex-col w-full border border-gray-200 rounded-lg',
    variants: {
      isSelected: {
        true: 'border-primary-400',
        false: '',
      },
    },
  });

  return (
    <div className={wrapper({ isSelected })}>
      <div className={topBar({ isActive })}>
        <span className='font-medium text-base'>{name}</span>
        <span className='bg-primary-100 rounded-lg py-1 px-2 flex items-center justify-center gap-1'>
          <SearchActivity className='w-4 h-4 text-primary-600' />
          <span className='text-xs'>{timeUtils.convertDuration(durationMinutes)}</span>
        </span>
      </div>
      <div className='flex items-center justify-between py-2 px-6'>
        <ul className='flex flex-col md:flex-row gap-4 list-disc list-inside py-2'>
          {services.map((service) => (
            <li key={service.id}>
              <span className='font-medium text-sm'>{service.name}</span>{' '}
              <span className='text-gray-500 line-through text-xs'>
                ({timeUtils.convertDuration(service.durationMinutes)})
              </span>
            </li>
          ))}
        </ul>
        <div className='hidden lg:flex flex-row items-center gap-0'>
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
    </div>
  );
}
