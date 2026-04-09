import { useTranslations } from 'next-intl';

import dayjs from 'dayjs';
import { tv } from 'tailwind-variants';

import { Customer, MasterWithRelationsEntity } from '@avoo/axios/types/apiTypes';
import { OrderStatus } from '@avoo/hooks/types/orderStatus';

import Avatar, { AvatarSize } from '@/_components/Avatar/Avatar';
import OrderStatusChip from '@/_components/OrderStatusChip/OrderStatusChip';
import { localizationHooks } from '@/_hooks/localizationHooks';

type Props = {
  id: number;
  name: string;
  date: string;
  client: Customer;
  status: OrderStatus;
  master: MasterWithRelationsEntity;
  isSelected?: boolean;
  variant?: 'default' | 'compact';
};

export default function OrderListItem(props: Props) {
  const { name, date, client, status, master, isSelected = false, variant = 'default' } = props;
  const locale = localizationHooks.useGetLocale();
  const t = useTranslations('private.components.OrderListItem.OrderListItem');

  const wrapper = tv({
    base: 'flex flex-col w-full border border-gray-200 rounded-lg p-3 gap-2 hover:cursor-pointer hover:bg-primary-50',
    variants: {
      isSelected: {
        true: 'bg-primary-50',
      },
      variant: {
        default: '',
        compact: 'text-sm p-2 gap-1',
      },
    },
  });

  return (
    <div className={wrapper({ isSelected, variant })}>
      <div className='flex justify-between gap-2 font-medium'>
        <span>{dayjs(date).locale(locale).format('HH:mm ddd DD MMM')}</span>
        <span className={`${variant === 'compact' ? 'hidden' : 'hidden md:block'}`}>|</span>
        <span className={`${variant === 'compact' ? 'hidden' : 'hidden md:block'}`}>{name}</span>
        <div className='ml-auto'>
          <OrderStatusChip status={status} />
        </div>
      </div>
      <div className={`${variant === 'compact' ? 'font-medium' : 'font-medium md:hidden'}`}>
        <span>{name}</span>
      </div>
      <div
        className={`flex flex-col gap-2 ${variant === 'compact' ? '' : 'md:flex-row md:items-center md:justify-between'}`}
      >
        <div className='flex items-center gap-2'>
          <div
            className={`flex flex-row w-full justify-between ${variant === 'compact' ? '' : 'md:hidden'}`}
          >
            <span>{t('client')}:</span>
            <div className='flex flex-row items-center gap-2 min-w-0'>
              <span className='font-medium truncate'>{client.name}</span>
              <span className='text-gray-500'>{client.phone}</span>
            </div>
          </div>
          <div
            className={`${variant === 'compact' ? 'hidden' : 'hidden md:flex gap-2 items-center'}`}
          >
            <Avatar src={null} name={client.name} size={AvatarSize.Small} />
            <span>{client.name}</span>
            <span>{client.phone}</span>
          </div>
        </div>
        <div className='flex items-center gap-2 flex-row justify-between'>
          <span className='text-gray-500'>{t('master')}:</span>
          <div className='flex items-center gap-2 min-w-0'>
            <Avatar src={master.avatarPreviewUrl} name={master.name} size={AvatarSize.Small} />
            <span className='truncate'>{master.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
