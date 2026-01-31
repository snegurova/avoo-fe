import React, { useMemo } from 'react';
import { OrderStatus } from '@avoo/hooks/types/orderStatus';
import { Order, Service } from '@avoo/axios/types/apiTypes';
import ServiceElement from '@/_components/ServiceElement/ServiceElement';
import CustomerElement from '@/_components/CustomerElement/CustomerElement';
import { Button, ButtonFit, ButtonIntent } from '@/_components/Button/Button';
import { timeUtils } from '@avoo/shared';
import { useApiStatusStore } from '@avoo/store';

type Props = {
  order: Order;
  onEdit: () => void;
  timeAgo: string;
  endTime: number | null;
};

export default function OrderView(props: Props) {
  const { order, onEdit, timeAgo, endTime } = props;

  const isPending = useApiStatusStore((state) => state.isPending);

  const serviceData = useMemo((): Service | null => {
    if (!order.service) return null;
    const service = { ...order.service, durationMinutes: order.duration };

    return service;
  }, [order]);

  return (
    <>
      <div className='flex flex-col gap-8 '>
        <div className='flex flex-col gap-2'>
          <div className='flex items-center justify-between gap-6 pr-6'>
            <span className='text-2xl font-medium tracking-wider'>
              {timeUtils.getHumanDate(order.date)}
            </span>
            <span className='text-gray-500 text-xs leading-none'>{timeAgo}</span>
          </div>
          <span className='text-sm tracking-wider'>
            {timeUtils.getTime(order.date)}
            {endTime && ` - ${timeUtils.getTimeFromMinutes(endTime)}`}
          </span>
        </div>
        <div className='flex flex-col gap-3'>
          <h3 className='font-medium tracking-wider'>Service</h3>
          {serviceData && <ServiceElement item={serviceData} isCard master={order.master} />}
          {order.notes && typeof order.notes === 'string' && (
            <p className='text-xs text-gray-500'>Note: {order.notes}</p>
          )}
        </div>
        <div className='flex flex-col gap-3'>
          <h3 className='font-medium tracking-wider'>Client</h3>
          {order.customer && <CustomerElement item={order.customer} isCard />}
          {order.customer.notes && (
            <p className='text-xs text-gray-500'>Note: {order.customer.notes}</p>
          )}
        </div>
      </div>
      {order.status === OrderStatus.CONFIRMED && (
        <div className='sticky bottom-0 pt-8 bg-white'>
          <Button
            loading={isPending}
            fit={ButtonFit.Fill}
            intent={ButtonIntent.Secondary}
            onClick={onEdit}
          >
            Edit
          </Button>
        </div>
      )}
    </>
  );
}
