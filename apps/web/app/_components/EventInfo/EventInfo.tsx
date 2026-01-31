import React from 'react';
import { PrivateEvent } from '@avoo/axios/types/apiTypes';
import { timeUtils } from '@avoo/shared';
import ServiceElement from '@/_components/ServiceElement/ServiceElement';
import CustomerElement from '@/_components/CustomerElement/CustomerElement';
import { Button, ButtonFit, ButtonIntent } from '@/_components/Button/Button';
import { useApiStatusStore } from '@avoo/store';

type Props = {
  event: PrivateEvent;
};

export default function EventInfo(props: Props) {
  const { event } = props;

  const isPending = useApiStatusStore((state) => state.isPending);

  return (
    <div className='min-w-92.5 flex flex-col gap-8'>
      <div className='flex flex-col gap-2'>
        <div className='flex items-center justify-between gap-6'>
          <span className='text-2xl font-medium tracking-wider'>
            {timeUtils.getHumanDate(event.start)}
          </span>
          <span className='text-gray-500 text-xs leading-none'></span>
        </div>
        <span className='text-sm tracking-wider'>
          {timeUtils.getTime(event.start)}-{timeUtils.getTime(event.end)}
        </span>
      </div>
      <div className='flex flex-col gap-3'>
        <h3 className='font-medium tracking-wider'>Service</h3>
        <ServiceElement
          item={{
            id: event.id,
            name: event.title,
            durationMinutes: event.duration,
            price: event.price,
          }}
          isCard
        />
        {event.notes && typeof event.notes === 'string' && (
          <p className='text-xs text-gray-500'>Note: {event.notes}</p>
        )}
      </div>
      <div className='flex flex-col gap-3'>
        <h3 className='font-medium tracking-wider'>Client</h3>
        <CustomerElement item={{ name: event.customerName }} isCard />
      </div>

      <Button
        loading={isPending}
        fit={ButtonFit.Fill}
        intent={ButtonIntent.Secondary}
        onClick={() => {}}
      >
        Edit
      </Button>
    </div>
  );
}
