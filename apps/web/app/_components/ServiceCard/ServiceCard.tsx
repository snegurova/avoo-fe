import { useLocale, useTranslations } from 'next-intl';

import { IconButton } from '@mui/material';
import { tv } from 'tailwind-variants';

import { userHooks } from '@avoo/hooks';
import { useApiStatusStore } from '@avoo/store';

import { localizationHooks } from '@/_hooks/localizationHooks';
import { useToast } from '@/_hooks/useToast';
import DeleteIcon from '@/_icons/DeleteIcon';
import EditSquareIcon from '@/_icons/EditSquareIcon';
import ShareIcon from '@/_icons/ShareIcon';
import { AppRoutes } from '@/_routes/routes';
import { formatLocalizedCurrency, formatLocalizedDuration } from '@/_utils/intlFormatters';

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

export default function ServiceCard(props: Props) {
  const t = useTranslations('private.components.ServiceCard.ServiceCard');
  const locale = useLocale();
  const { id, name, durationMinutes, price, currency, isActive, isSelected, onDelete, onEdit } =
    props;
  const toast = useToast();
  const { userId } = userHooks.useGetUserProfile();
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const link = `${baseUrl}${localizationHooks.useWithLocale(AppRoutes.PublicSalon)}/${userId}${AppRoutes.PublicOrderCreate}?serviceId=${id}`;

  const isPending = useApiStatusStore((state) => state.isPending);

  const onShareClick = () => {
    navigator.clipboard.writeText(link);
    toast.info(t('copiedToClipboard'));
  };

  return (
    <div className={wrapper({ isActive, isSelected })}>
      <span className={statusIndicator({ isActive })} />
      <div className='flex items-center justify-between px-4 py-3'>
        <div>
          <h3 className='text-base font-medium'>{name}</h3>
          <div className='flex items-center gap-2'>
            <p className='text-sm text-gray-700'>
              {formatLocalizedDuration(durationMinutes, locale)}
            </p>
            <span className='hidden lg:inline text-sm text-gray-700'>
              | {formatLocalizedCurrency(price, currency, locale, 'name')}
            </span>
          </div>
        </div>
        <div className='flex items-center gap-3'>
          <span className='font-regular font-weight-400 lg:hidden'>
            {formatLocalizedCurrency(price, currency, locale)}
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

            <IconButton
              aria-label={t('shareService')}
              onClick={onShareClick}
              disabled={isPending}
              loading={isPending}
            >
              <ShareIcon className='transition-colors' />
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
    </div>
  );
}
