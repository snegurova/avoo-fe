import React from 'react';
import { orderHooks } from '@avoo/hooks';
import { useApiStatusStore } from '@avoo/store';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, ButtonFit, ButtonIntent, ButtonType } from '@/_components/Button/Button';

import { CustomerSelect } from '../CustomerSelect/CustomerSelect';
import { Controller } from 'react-hook-form';

export default function OrderCreate() {
  const isPending = useApiStatusStore((state) => state.isPending);
  const router = useRouter();
  const searchParams = useSearchParams();

  const masterId = searchParams.get('masterId');
  const date = searchParams.get('date');
  const startTimeMinutes = searchParams.get('startTimeMinutes');

  const { control, handleSubmit } = orderHooks.useCreateOrders({
    order: {
      masterId: masterId ? Number(masterId) : undefined,
      date: date ?? undefined,
      startTimeMinutes: startTimeMinutes ? Number(startTimeMinutes) : undefined,
    },
    onSuccess: () => {
      router.back();
    },
  });
  return (
    <div className='h-[calc(100%-62px)] overflow-y-auto flex'>
      <form className='px-12' onSubmit={handleSubmit}>
        <Controller
          name='customerData'
          control={control}
          render={({ field }) => <CustomerSelect value={field.value} onChange={field.onChange} />}
        />

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
    </div>
  );
}
