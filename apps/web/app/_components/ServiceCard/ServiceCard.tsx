import { currencyUtils, timeUtils } from '@avoo/shared';
import IconLink from '../IconLink/IconLink';
import ShareIcon from '@/_icons/ShareIcon';
import DeleteIcon from '@/_icons/DeleteIcon';
import EditSquareIcon from '@/_icons/EditSquareIcon';
import { IconButton } from '@mui/material';
import { useApiStatusStore } from '@avoo/store';
import { tv } from 'tailwind-variants';

type Props = {
  id: number;
  name: string;
  durationMinutes: number;
  price: number;
  currency: string;
  isActive: boolean;
  onDelete: (id: number) => void;
};

export default function ServiceCard(props: Props) {
  const { id, name, durationMinutes, price, currency, isActive, onDelete } = props;

  const isPending = useApiStatusStore((state) => state.isPending);

  const wrapper = tv({
    base: 'relative border border-gray-200 rounded-lg overflow-hidden',
    variants: {
      isActive: {
        true: '',
        false: 'bg-gray-100',
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
    <div className={wrapper({ isActive })}>
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
            <IconLink
              href={'#'}
              icon={<EditSquareIcon className='transition-colors' />}
              label='Edit Service'
            />
            <IconLink
              href={'#'}
              icon={<ShareIcon className='transition-colors' />}
              label='Share Service'
            />
            <IconButton
              aria-label='delete'
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
