import React, { useMemo } from 'react';
import { OrderStatus } from '@avoo/hooks/types/orderStatus';
import { Order, Service } from '@avoo/axios/types/apiTypes';
import ServiceElement from '@/_components/ServiceElement/ServiceElement';
import CustomerElement from '@/_components/CustomerElement/CustomerElement';
import { Button, ButtonFit, ButtonIntent } from '@/_components/Button/Button';
import { timeUtils } from '@avoo/shared';
import { useApiStatusStore } from '@avoo/store';
import CombinationElement from '@/_components/CombinationElement/CombinationElement';

type Props = {
  order: Order;
  onEdit: () => void;
  timeAgo: string;
  endTime: string | null;
  isOutOfSchedule?: boolean;
};

export default function OrderView(props: Props) {
  const { order, onEdit, timeAgo, endTime, isOutOfSchedule } = props;
  const isPending = useApiStatusStore((state) => state.isPending);

  const serviceData = useMemo((): Service | null => {
    if (!order.service) return null;
    return { ...order.service, durationMinutes: order.duration };
  }, [order]);

  const combinationData = useMemo(() => {
    if (!order.combination) return null;
    return { ...order.combination, durationMinutes: order.duration };
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
          <div className='flex gap-5 items-center'>
            <span className='text-sm tracking-wider'>
              {timeUtils.getTime(order.date)}
              {endTime && ` - ${endTime}`}
            </span>
            {isOutOfSchedule && (
              <div className='relative before:content-[""] before:absolute before:w-px before:top-0.5 before:bottom-0.5 before:bg-black before:-left-2.5'>
                <span className='text-[10px] font-medium text-white leading-none px-1.5 py-1 flex items-center justify-center rounded-2xl capitalize bg-red-800'>
                  Out of schedule
                </span>
              </div>
            )}
          </div>
        </div>
        <div className='flex flex-col gap-3'>
          <h3 className='font-medium tracking-wider'>Service</h3>
          {serviceData && <ServiceElement item={serviceData} isCard master={order.master} />}
          {combinationData && (
            <CombinationElement item={combinationData} isCard master={order.master} />
          )}
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
