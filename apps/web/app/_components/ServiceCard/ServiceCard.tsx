import { useTranslations } from 'next-intl';

import { IconButton } from '@mui/material';
import { tv } from 'tailwind-variants';

import { currencyUtils, timeUtils } from '@avoo/shared';
import { useApiStatusStore } from '@avoo/store';

import IconLink from '@/_components/IconLink/IconLink';
import DeleteIcon from '@/_icons/DeleteIcon';
import EditSquareIcon from '@/_icons/EditSquareIcon';
import ShareIcon from '@/_icons/ShareIcon';

type Props = {
  id: number;
  name: string;
  durationMinutes: number;
  price: number;
  currency: string;
  isActive: boolean;
  isSelected: boolean;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
};

export default function ServiceCard(props: Props) {
  const t = useTranslations('private.components.ServiceCard.ServiceCard');
  const { id, name, durationMinutes, price, currency, isActive, isSelected, onDelete, onEdit } =
    props;

  const isPending = useApiStatusStore((state) => state.isPending);

  const wrapper = tv({
    base: 'relative border border-gray-200 rounded-lg overflow-hidden',
    variants: {
      isActive: {
        true: '',
        false: 'bg-gray-100',
      },
      isSelected: {
        true: 'bg-primary-50',
        false: '',
      },
    },
  });

  const statusIndicator = tv({
    base: 'absolute left-0 top-0 h-full w-2 rounded-l-lg',
    variants: {
      isActive: {
        true: 'bg-primary-200',
        false: 'bg-gray-300',
      },
    },
  });

  return (
    <div className={wrapper({ isActive, isSelected })}>
      <span className={statusIndicator({ isActive })} />
      <div className='flex items-center justify-between px-4 py-3'>
        <div>
          <h3 className='text-base font-medium'>{name}</h3>
          <div className='flex items-center gap-2'>
            <p className='text-sm text-gray-700'>{timeUtils.convertDuration(durationMinutes)}</p>
            <span className='hidden lg:inline text-sm text-gray-700'>
              | {currencyUtils.formatNamePrice(price, currency)}
            </span>
          </div>
        </div>
        <div className='flex items-center gap-3'>
          <span className='font-regular font-weight-400 lg:hidden'>
            {currencyUtils.formatPrice(price, currency)}
          </span>
          <div className='hidden lg:flex items-center gap-0'>
            <IconButton
              aria-label={t('editSm')}
              onClick={() => onEdit(id)}
              loading={isPending}
              disabled={isPending}
            >
              <EditSquareIcon className='transition-colors' />
            </IconButton>
            <IconLink
              href={'#'}
              icon={<ShareIcon className='transition-colors' />}
              label={t('shareService')}
            />
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
    </div>
  );
}
