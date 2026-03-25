import { useTranslations } from 'next-intl';

import { useMediaQuery } from '@mui/material';
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
  isSelected: boolean;
};

export default function OrderListItem(props: Props) {
  const { name, date, client, status, master, isSelected } = props;
  const locale = localizationHooks.useGetLocale();
  const t = useTranslations('private.components.OrderListItem.OrderListItem');

  const isMobile = useMediaQuery('(max-width:767px)');

  const wrapper = tv({
    base: 'flex flex-col w-full border border-gray-200 rounded-lg p-3 gap-2 hover:cursor-pointer hover:bg-primary-50',
    variants: {
      isSelected: {
        true: 'bg-primary-50',
      },
    },
  });

  return (
    <div className={wrapper({ isSelected })}>
      <div className='flex justify-between'>
        <div className='flex gap-2 font-medium'>
          <span>{dayjs(date).locale(locale).format('HH:mm ddd DD MMM')}</span>
          <span>|</span>
          <span>{name}</span>
        </div>
        <OrderStatusChip status={status} />
      </div>
      <div className='flex justify-between'>
        <div className='flex items-center gap-2 flex-row'>
          {isMobile ? (
            <span>
              {t('client')}: {client.phone}
            </span>
          ) : (
            <>
              <Avatar src={null} name={client.name} size={AvatarSize.Small} />
              <span>{client.name}</span>
              <span>{client.phone}</span>
            </>
          )}
        </div>
        <div className='flex items-center gap-2 flex-row'>
          <Avatar src={master.avatarPreviewUrl} name={master.name} size={AvatarSize.Small} />
          <span>{master.name}</span>
        </div>
      </div>
    </div>
  );
}
