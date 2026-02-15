import React, { useEffect, useMemo, useState } from 'react';
import {
  Order,
  MasterWithRelationsEntity,
  GetMastersQueryParams,
} from '@avoo/axios/types/apiTypes';
import { Button, ButtonFit, ButtonIntent, ButtonType } from '@/_components/Button/Button';
import { useApiStatusStore } from '@avoo/store';
import ServiceElement from '@/_components/ServiceElement/ServiceElement';
import CustomerElement from '@/_components/CustomerElement/CustomerElement';
import { orderHooks } from '@avoo/hooks';
import FormTextArea from '@/_components/FormTextArea/FormTextArea';
import { Controller } from 'react-hook-form';
import { masterHooks } from '@avoo/hooks';
import SearchField from '@/_components/SearchField/SearchField';
import MasterElement from '../MasterElement/MasterElement';
import FormCounter from '@/_components/FormCounter/FormCounter';
import ErrorIcon from '@/_icons/ErrorIcon';
import FormDatePicker from '@/_components/FormDatePicker/FormDatePicker';
import FormTimePicker from '@/_components/FormTimePicker/FormTimePicker';

type Props = {
  order: Order;
  onClose: () => void;
  refetchCalendar: () => void;
  refetchOrder: () => void;
  isOutOfSchedule?: boolean;
};

interface ApiErrorWithResponse {
  response?: {
    data?: {
      errorMessage?: string;
    };
  };
  message: string;
}

export default function OrderEdit(props: Props) {
  const { order, onClose, refetchCalendar, refetchOrder, isOutOfSchedule } = props;
  const [selectedMaster, setSelectedMaster] = React.useState<MasterWithRelationsEntity | undefined>(
    order.master,
  );
  const [masterSearch, setMasterSearch] = useState('');
  const [masterParams, setMasterParams] = useState<GetMastersQueryParams>({ limit: 10 });
  const [error, setError] = React.useState<string | null>(null);
  const isPending = useApiStatusStore((state) => state.isPending);

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
      masterId: order.master.id,
      date: order.date,
    },
    id: order.id,
    onSuccess: () => {
      refetchCalendar();
      refetchOrder();
      onClose();
    },
  });

  const {
    data: mastersData,
    fetchNextPage: fetchNextMastersPage,
    hasNextPage: hasMoreMasters,
  } = masterHooks.useGetMastersInfinite(masterParams);

  const masters = useMemo(
    () =>
      (mastersData?.pages.flatMap((page) => page?.data?.items) || []).filter(
        (item): item is MasterWithRelationsEntity => item !== undefined,
      ),
    [mastersData],
  );

  useEffect(() => {
    setMasterParams((prev) => ({
      ...prev,
      search: masterSearch.trim() || undefined,
    }));
  }, [masterSearch]);

  useEffect(() => {
    if (apiError) {
      const errorMessage =
        typeof apiError === 'object' && 'response' in apiError
          ? (apiError as ApiErrorWithResponse).response?.data?.errorMessage || apiError.message
          : apiError.message;
      setError(errorMessage);
    } else {
      setError(null);
    }
  }, [apiError]);

  const onMasterChange = (value: number | { id: number } | undefined) => {
    let masterId = undefined;

    if (typeof value === 'number') {
      masterId = value;
    } else if (value && typeof value === 'object' && 'id' in value) {
      masterId = value.id;
    }
    setValue('masterId', masterId);
    const master = masters?.find((m) => m.id === masterId) || undefined;
    setSelectedMaster(master);
  };

  return (
    <form className='h-full' onSubmit={handleSubmit}>
      <div className='flex flex-col gap-8 '>
        <div className='flex flex-col gap-2 items-start'>
          <div className='flex items-center justify-between gap-6 pr-6'>
            <span className='text-2xl font-medium tracking-wider'>Edit Booking</span>
          </div>
          {isOutOfSchedule && (
            <span className='text-[10px] font-medium text-white leading-none px-1.5 py-1 flex items-center justify-center rounded-2xl capitalize bg-red-800'>
              Out of schedule
            </span>
          )}
        </div>
        <div className='flex flex-col gap-3'>
          <h3 className='font-medium tracking-wider'>Service</h3>
          {order.service && <ServiceElement item={order.service} isCard />}
          <div className='flex flex-col gap-3'>
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
            </div>
            <div className=''>
              <Controller
                name='masterId'
                control={control}
                render={({ field }) => (
                  <SearchField
                    label='Master'
                    value={field.value}
                    onChange={onMasterChange}
                    items={masters}
                    search={masterSearch}
                    setSearch={setMasterSearch}
                    ItemElement={MasterElement}
                    searchMode={false}
                    error={errors?.masterId?.message}
                    hasMore={hasMoreMasters}
                    fetchNextPage={fetchNextMastersPage}
                  />
                )}
              />
              {selectedMaster && <MasterElement item={selectedMaster} isCard />}
            </div>
            <Controller
              name='date'
              control={control}
              render={({ field }) => (
                <div className='grid grid-cols-3 gap-x-3 w-full'>
                  <div className='col-span-2'>
                    <label className='block mb-2 font-medium'>Date</label>
                    <FormDatePicker date={field.value} onChange={field.onChange} />
                  </div>
                  <div className=' '>
                    <label className='block mb-2 font-medium'>Time</label>
                    <FormTimePicker date={field.value} onChange={field.onChange} />
                  </div>

                  {errors?.date?.message && (
                    <div className='mt-1 text-sm text-red-500 col-span-3'>
                      {errors?.date?.message}
                    </div>
                  )}
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
          onClick={onClose}
        >
          Close
        </Button>
        <Button
          loading={isPending}
          fit={ButtonFit.Fill}
          intent={ButtonIntent.Primary}
          type={ButtonType.Submit}
        >
          Save
        </Button>
      </div>
    </form>
  );
}
