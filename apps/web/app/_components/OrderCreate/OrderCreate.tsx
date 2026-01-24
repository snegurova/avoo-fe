import React, { useEffect, useState } from 'react';
import { orderHooks } from '@avoo/hooks';
import { useApiStatusStore } from '@avoo/store';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, ButtonFit, ButtonIntent, ButtonType } from '@/_components/Button/Button';
import { CustomerSelect } from '../CustomerSelect/CustomerSelect';
import { Controller, useFieldArray } from 'react-hook-form';
import ServiceForm from '../ServiceForm/ServiceForm';
import { appRoutes } from '@/_routes/routes';
import AddCircleIcon from '@/_icons/AddCircleIcon';
import { Service } from '@avoo/axios/types/apiTypes';

export default function OrderCreate() {
  const isPending = useApiStatusStore((state) => state.isPending);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedServices, setSelectedServices] = useState<(Service | null)[]>([null]);

  const initialMasterId = searchParams.get('masterId');
  const initialDate = searchParams.get('date');
  const initialStartTimeMinutes = searchParams.get('startTimeMinutes');

  const initialParams = {
    masterId: initialMasterId ? Number(initialMasterId) : undefined,
    date: initialDate ?? undefined,
    startTimeMinutes: initialStartTimeMinutes ? Number(initialStartTimeMinutes) : undefined,
  };

  useEffect(() => {
    if (searchParams.toString()) {
      router.replace(appRoutes.OrderCreate);
    }
  }, []);

  const { control, handleSubmit } = orderHooks.useCreateOrders({
    order: {
      masterId: initialParams.masterId,
      date: initialParams.date,
      startTimeMinutes: initialParams.startTimeMinutes,
    },
    onSuccess: () => {
      router.back();
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'ordersData',
  });

  const addService = () => {
    const prevOrder = fields[fields.length - 1];
    const prevServiceId = prevOrder?.serviceId;
    const prevService = selectedServices.find((s) => s?.id === prevServiceId) || null;

    append({
      type: 'SERVICE',
      masterId: prevOrder.masterId,
      date: prevOrder.date,
      startTimeMinutes: prevOrder.startTimeMinutes + (prevService?.durationMinutes || 0),
    });

    setSelectedServices((prev) => [...prev, null]);
  };

  return (
    <div className='h-[calc(100%-62px)] overflow-y-auto flex'>
      <form className='px-12 w-full flex flex-col gap-6' onSubmit={handleSubmit}>
        <Controller
          name='customerData'
          control={control}
          render={({ field }) => <CustomerSelect value={field.value} onChange={field.onChange} />}
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
        <div className='flex gap-8 mt-6'>
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
