import React, { useEffect } from 'react';
import { orderHooks } from '@avoo/hooks';
import { useApiStatusStore } from '@avoo/store';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, ButtonFit, ButtonIntent, ButtonType } from '@/_components/Button/Button';
import { CustomerSelect } from '../CustomerSelect/CustomerSelect';
import { Controller, useFieldArray } from 'react-hook-form';
import ServiceForm from '../ServiceForm/ServiceForm';
import { appRoutes } from '@/_routes/routes';
import AddCircleIcon from '@/_icons/AddCircleIcon';
import { OrderQueryParams } from '@avoo/hooks/types/orderQueryParams';
import { OrderType } from '@avoo/hooks/types/orderType';
import { timeUtils } from '@avoo/shared';

const SERVICES_KEY_IN_ORDER_CREATE = 'ordersData';
const WRAPPER_HEADER_HEIGHT = '62px';

export default function OrderCreate() {
  const isPending = useApiStatusStore((state) => state.isPending);
  const router = useRouter();
  const searchParams = useSearchParams();

  const parsedQuery = Object.fromEntries(
    Object.values(OrderQueryParams).map((key) => [key, searchParams.get(key)]),
  ) as Record<OrderQueryParams, string | null>;

  const initialParams = {
    masterId:
      parsedQuery.masterId && !Number.isNaN(Number(parsedQuery.masterId))
        ? Number(parsedQuery.masterId)
        : undefined,
    date: parsedQuery.date ?? undefined,
  };

  useEffect(() => {
    if (searchParams.toString()) {
      router.replace(appRoutes.OrderCreate);
    }
  }, []);

  const { control, handleSubmit, errors, selectedServices, setSelectedServices } =
    orderHooks.useCreateOrder({
      order: {
        masterId: initialParams.masterId,
        date: initialParams.date,
      },
      onSuccess: () => {
        router.replace(appRoutes.Calendar);
      },
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: SERVICES_KEY_IN_ORDER_CREATE,
  });

  const addService = () => {
    const prevOrder = fields[fields.length - 1];
    const prevService = selectedServices[fields.length - 1];

    const nextDate = new Date(prevOrder.date);

    if (prevService) {
      const hours = nextDate.getHours();
      const minutes = nextDate.getMinutes();
      const totalMinutes = hours * 60 + minutes + prevService.durationMinutes;

      nextDate.setHours(Math.floor(totalMinutes / 60));
      nextDate.setMinutes(totalMinutes % 60);
    }

    append({
      type: OrderType.Service,
      masterId: 0,
      date: timeUtils.convertDateToString(nextDate),
    });

    setSelectedServices((prev) => [...prev, null]);
  };

  return (
    <div className={`h-[calc(100%-${WRAPPER_HEADER_HEIGHT})] overflow-y-auto flex`}>
      <form className='px-12 w-full flex flex-col gap-6' onSubmit={handleSubmit}>
        <Controller
          name='customerData'
          control={control}
          render={({ field }) => (
            <CustomerSelect
              value={field.value}
              onChange={field.onChange}
              error={errors.customerData?.message}
            />
          )}
        />
        <Controller
          name='ordersData'
          control={control}
          render={({ field }) => (
            <ServiceForm
              value={field.value}
              onChange={field.onChange}
              initialParams={initialParams}
              selectedServices={selectedServices}
              setSelectedServices={setSelectedServices}
              remove={remove}
              errors={Array.isArray(errors.ordersData) ? errors.ordersData : []}
            />
          )}
        />
        {selectedServices.length > 0 && selectedServices[selectedServices.length - 1] && (
          <div className=''>
            <button
              type='button'
              onClick={addService}
              className='flex gap-2 items-center font-medium text-sm group cursor-pointer rounded-lg px-4 py-2.5 hover:bg-primary-100 focus:bg-primary-100 transition-colors'
            >
              <div className='shrink-0'>
                <AddCircleIcon className='fill-primary-900' />
              </div>
              <span className='text-primary-900 font-medium underline'>Add more service</span>
            </button>
          </div>
        )}
        <div className='flex gap-8 mt-6 pb-15'>
          <Button
            disabled={isPending}
            loading={isPending}
            fit={ButtonFit.Inline}
            intent={ButtonIntent.Secondary}
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type={ButtonType.Submit}
            disabled={isPending}
            loading={isPending}
            fit={ButtonFit.Inline}
            intent={ButtonIntent.Primary}
          >
            Book
          </Button>
        </div>
      </form>
      <div className='w-100 shrink-0'></div>
    </div>
  );
}
