import dayjs from 'dayjs';
import { tv } from 'tailwind-variants';

import { OrderStatus } from '@avoo/axios/types/apiEnums';
import { Customer, MasterWithRelationsEntity } from '@avoo/axios/types/apiTypes';
import { useApiStatusStore } from '@avoo/store';

import Avatar, { AvatarSize } from '@/_components/Avatar/Avatar';
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

  const isPending = useApiStatusStore((state) => state.isPending);

  const orderStatus = tv({
    base: 'h-4 text-[10px] leading-[10px] px-1.5 flex items-center justify-center rounded-2xl capitalize text-white',
    variants: {
      status: {
        CONFIRMED: 'bg-blue-500',
        EXPIRED: 'bg-gray-500',
        PENDING: 'bg-orange-400',
        REJECTED: 'bg-red-500',
        CANCELED: 'bg-gray-400',
        COMPLETED: 'bg-green-700',
      },
      isPending: {
        true: 'opacity-50',
        false: '',
      },
      isSelected: {
        true: 'border-primary-500',
        false: '',
      },
    },
  });

  return (
    <div className='flex flex-col w-full border border-gray-200 rounded-lg p-3 gap-2 hover:cursor-pointer hover:bg-primary-50'>
      <div className='flex justify-between'>
        <div className='flex gap-2 font-medium'>
          <span>{dayjs(date).locale(locale).format('HH:mm ddd DD MMM')}</span>
          <span>|</span>
          <span>{name}</span>
        </div>
        <span className={orderStatus({ status, isSelected, isPending })}>{status}</span>
      </div>
      <div className='flex justify-between'>
        <div className='flex items-center gap-2 flex-row'>
          <Avatar src={null} name={client.name} size={AvatarSize.Small} />
          <span>{client.name}</span>
          <span>{client.phone}</span>
        </div>
        <div className='flex items-center gap-2 flex-row'>
          <Avatar src={master.avatarPreviewUrl} name={master.name} size={AvatarSize.Small} />
          <span>{master.name}</span>
        </div>
      </div>
    </div>
  );
}
