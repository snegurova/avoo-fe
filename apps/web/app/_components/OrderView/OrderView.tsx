import React, { useMemo } from 'react';
import { useLocale, useTranslations } from 'next-intl';

import { Order, Service } from '@avoo/axios/types/apiTypes';
import { OrderScheduleStatus, OrderStatus } from '@avoo/hooks/types/orderStatus';
import { timeUtils } from '@avoo/shared';
import { useApiStatusStore } from '@avoo/store';

import { Button, ButtonFit, ButtonIntent } from '@/_components/Button/Button';
import CombinationElement from '@/_components/CombinationElement/CombinationElement';
import CustomerElement from '@/_components/CustomerElement/CustomerElement';
import OrderStatusChip from '@/_components/OrderStatusChip/OrderStatusChip';
import ServiceElement from '@/_components/ServiceElement/ServiceElement';
import { formatLocalizedHumanDate } from '@/_utils/intlFormatters';

type Props = {
  order: Order;
  onEdit: () => void;
  timeAgo: string;
  endTime: string | null;
  isOutOfSchedule?: boolean;
  showStatus?: boolean;
};

export default function OrderView(props: Props) {
  const t = useTranslations('private.components.OrderView.OrderView');
  const locale = useLocale();
  const { order, onEdit, timeAgo, endTime, isOutOfSchedule, showStatus } = props;
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
              {formatLocalizedHumanDate(order.date, locale)}
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
                <OrderStatusChip status={OrderScheduleStatus.OUT_OF_SCHEDULE} />
              </div>
            )}
            {showStatus && (
              <div className='relative before:content-[""] before:absolute before:w-px before:top-0.5 before:bottom-0.5 before:bg-black before:-left-2.5'>
                <OrderStatusChip status={order.status} />
              </div>
            )}
          </div>
        </div>
        <div className='flex flex-col gap-3'>
          <h3 className='font-medium tracking-wider'>{t('service')}</h3>
          {serviceData && <ServiceElement item={serviceData} isCard master={order.master} />}
          {combinationData && (
            <CombinationElement item={combinationData} isCard master={order.master} />
          )}
          {order.notes && typeof order.notes === 'string' && (
            <p className='text-xs text-gray-500'>{t('noteWithValue', { note: order.notes })}</p>
          )}
        </div>
        <div className='flex flex-col gap-3'>
          <h3 className='font-medium tracking-wider'>{t('client')}</h3>
          {order.customer && <CustomerElement item={order.customer} isCard />}
          {order.customer.notes && (
            <p className='text-xs text-gray-500'>
              {t('noteWithValue', { note: order.customer.notes })}
            </p>
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
            {t('edit')}
          </Button>
        </div>
      )}
    </>
  );
}
