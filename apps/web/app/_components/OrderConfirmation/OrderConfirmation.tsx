import React, { useEffect, useMemo } from 'react';
import { Order, Service } from '@avoo/axios/types/apiTypes';
import { Button, ButtonFit, ButtonIntent, ButtonType } from '@/_components/Button/Button';
import { timeUtils } from '@avoo/shared';
import { useApiStatusStore } from '@avoo/store';
import ServiceElement from '@/_components/ServiceElement/ServiceElement';
import CustomerElement from '@/_components/CustomerElement/CustomerElement';
import { orderHooks } from '@avoo/hooks';
import { Controller } from 'react-hook-form';
import FormCounter from '@/_components/FormCounter/FormCounter';
import { OrderStatus } from '@avoo/hooks/types/orderStatus';
import ErrorIcon from '@/_icons/ErrorIcon';
import FormTextArea from '@/_components/FormTextArea/FormTextArea';

type Props = {
  order: Order;
  timeAgo: string;
  endTime: string | null;
  onClose: () => void;
  refetchCalendar: () => void;
  refetchOrder: () => void;
  isOutOfSchedule?: boolean;
};

export default function OrderConfirmation(props: Props) {
  const { order, timeAgo, endTime, onClose, refetchCalendar, refetchOrder, isOutOfSchedule } =
    props;
  const [error, setError] = React.useState<string | null>(null);
  const isPending = useApiStatusStore((state) => state.isPending);

  const serviceData = useMemo((): Service | null => {
    if (!order.service) return null;
    const service = { ...order.service, durationMinutes: order.duration };

    return service;
  }, [order]);

  const {
    control,
    handleSubmit,
    errors,
    setValue,
    error: apiError,
  } = orderHooks.useUpdateOrder({
    order: {
      duration: order.duration,
      notes: typeof order.notes === 'string' ? order.notes : '',
    },
    id: order.id,
    onSuccess: () => {
      refetchCalendar();
      refetchOrder();
      onClose();
    },
  });

  useEffect(() => {
    if (apiError) {
      type ApiErrorWithResponse = {
        response?: {
          data?: {
            errorMessage?: string;
          };
        };
        message: string;
      };

      const errorMessage =
        typeof apiError === 'object' && 'response' in apiError
          ? (apiError as ApiErrorWithResponse).response?.data?.errorMessage || apiError.message
          : apiError.message;
      setError(errorMessage);
    } else {
      setError(null);
    }
  }, [apiError]);

  return (
    <form className='h-full'>
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
            <div className='relative before:content-[""] before:absolute before:w-px before:top-0.5 before:bottom-0.5 before:bg-black before:-left-2.5 flex gap-2'>
              <span className='text-[10px] font-medium text-white leading-none px-1.5 py-1 flex items-center justify-center rounded-2xl capitalize bg-orange-500'>
                {order.status.toLowerCase()}
              </span>
              {isOutOfSchedule && (
                <span className='text-[10px] font-medium text-white leading-none px-1.5 py-1 flex items-center justify-center rounded-2xl capitalize bg-red-800'>
                  Out of schedule
                </span>
              )}
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-3'>
          <h3 className='font-medium tracking-wider'>Service</h3>
          {serviceData && <ServiceElement item={serviceData} isCard master={order.master} />}

          <div className=''>
            <Controller
              name='notes'
              control={control}
              render={({ field }) => (
                <div className=''>
                  <FormTextArea
                    id='confirmation-notes'
                    name='confirmation-notes'
                    value={field.value || ''}
                    onChange={field.onChange}
                    label='Notes'
                    helperText='Additional information for the master'
                    maxLength={200}
                    error={errors?.notes?.message}
                    classNames={{
                      label: 'block font-medium',
                      textarea:
                        'block w-full text-sm text-black border border-gray-200 p-3 rounded-lg min-h-[70px] focus:outline-none focus:ring-1 focus:ring-purple-800',
                    }}
                  />
                </div>
              )}
            />
          </div>
          <div className='flex flex-col gap-3'>
            <Controller
              name='duration'
              control={control}
              render={({ field }) => (
                <div className=''>
                  <span className='block mb-1 text-sm tracking-wider font-medium'>
                    Service duration
                  </span>
                  <FormCounter
                    value={field.value}
                    onIncrease={() => field.onChange(field.value ? field.value + 5 : 0)}
                    onDecrease={() =>
                      field.onChange(field.value && field.value > 5 ? field.value - 5 : 0)
                    }
                  />
                </div>
              )}
            />
            {error && (
              <div className='flex flex-row gap-4 items-center'>
                <ErrorIcon className='shrink-0 w-6 h-6 fill-red-800' />
                <p className='text-sm text-red-800'>{error}</p>
              </div>
            )}
          </div>
        </div>
        <div className='flex flex-col gap-3'>
          <h3 className='font-medium tracking-wider'>Client</h3>
          {order.customer && <CustomerElement item={order.customer} isCard />}
          {order.customer.notes && (
            <p className='text-xs text-gray-500'>Note: {order.customer.notes}</p>
          )}
        </div>
      </div>

      <div className='sticky bottom-0 pt-8 bg-white grid grid-cols-2 gap-8'>
        <Button
          loading={isPending}
          fit={ButtonFit.Fill}
          intent={ButtonIntent.Secondary}
          onClick={() => {
            setValue('status', OrderStatus.CANCELED);
            handleSubmit();
          }}
          type={ButtonType.Button}
        >
          Reject
        </Button>
        <Button
          loading={isPending}
          fit={ButtonFit.Fill}
          intent={ButtonIntent.Primary}
          onClick={() => {
            setValue('status', OrderStatus.CONFIRMED);
            handleSubmit();
          }}
          type={ButtonType.Button}
        >
          Confirm
        </Button>
      </div>
    </form>
  );
}
