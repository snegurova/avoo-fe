import { currencyUtils, timeUtils } from '@avoo/shared';
import IconLink from '../IconLink/IconLink';
import ShareIcon from '@/_icons/ShareIcon';
import DeleteIcon from '@/_icons/DeleteIcon';
import EditSquareIcon from '@/_icons/EditSquareIcon';
import ContentCopyIcon from '@/_icons/ContentCopyIcon';
import { IconButton } from '@mui/material';
import { useApiStatusStore } from '@avoo/store';

type Props = {
  id: number;
  name: string;
  durationMinutes: number;
  price: number;
  currency: string;
  onDelete: (id: number) => void;
};

export default function ServiceCard(props: Props) {
  const { id, name, durationMinutes, price, currency, onDelete } = props;

  const isPending = useApiStatusStore((state) => state.isPending);

  return (
    <div className='relative border border-gray-200 rounded-lg overflow-hidden'>
      <span className='absolute left-0 top-0 h-full w-2 bg-primary-200 rounded-l-lg' />

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
          <span className='text-bold'>ID:{id}</span>
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
              icon={<ContentCopyIcon className='transition-colors' />}
              label='Copy Service'
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
