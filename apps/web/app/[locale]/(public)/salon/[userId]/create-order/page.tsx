'use client';
import { useParams } from 'next/navigation';
import { orderHooks, combinationHooks } from '@avoo/hooks';

import React, { useEffect, useMemo, useState } from 'react';
import { useApiStatusStore } from '@avoo/store';
import { useRouter } from 'next/navigation';
import { Button, ButtonFit, ButtonIntent, ButtonType } from '@/_components/Button/Button';
import { Controller, useFieldArray } from 'react-hook-form';
import { OrderType } from '@avoo/hooks/types/orderType';
import { useToast } from '@/_hooks/useToast';
import { Service, CreatePublicOrder, MasterWithRelationsEntity } from '@avoo/axios/types/apiTypes';
import { servicesHooks } from '@avoo/hooks';
import { timeUtils } from '@avoo/shared';
import CustomerCreate from '@/_components/CustomerCreate/CustomerCreate';

const SERVICES_KEY_IN_ORDER_CREATE = 'ordersData';

export default function PublicOrderCreatePage() {
  const params = useParams();
  const userId = params.userId;
  const isPending = useApiStatusStore((state) => state.isPending);
  const errorMessage = useApiStatusStore((s) => s.errorMessage);
  const isError = useApiStatusStore((s) => s.isError);
  const router = useRouter();
  const toast = useToast();
  const [showCombination, setShowCombination] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [phone, setPhone] = useState('');
  const [selectedMasters, setSelectedMasters] = useState<(MasterWithRelationsEntity | null)[]>([
    null,
  ]);

  const {
    control,
    handleSubmit,
    errors,
    getValues,
    isPending: formPending,
    selectedServices,
    setSelectedServices,
    selectedCombinations,
    setSelectedCombinations,
  } = orderHooks.useCreatePublicOrder({
    onSuccess: () => {
      router.back();
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: SERVICES_KEY_IN_ORDER_CREATE,
  });

  const { data: servicesData } = servicesHooks.useGetServicesInfinite({
    limit: 10,
    isActive: true,
  });
  const services = (servicesData?.pages.flatMap((page) => page?.data?.items) || []).filter(
    (item): item is Service => item !== undefined,
  );

  const combinations = combinationHooks.useGetPublicCombinations({
    serviceIds: selectedServices
      .filter((service): service is NonNullable<typeof service> => Boolean(service))
      .map((service) => service.id),
    isActive: true,
    masterIds: undefined,
  });

  useEffect(() => {
    if (
      selectedServices.length < 2 ||
      !combinations?.items?.length ||
      selectedCombinations.length > 0
    ) {
      setShowCombination(false);
      return;
    }
    setShowCombination(true);
  }, [combinations, selectedServices, selectedCombinations]);

  const availableSlots = useMemo(() => {
    const now = new Date();
    const slots: string[] = [];
    for (let h = 9; h <= 17; h++) {
      slots.push(
        timeUtils.convertDateToString(
          new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, 0),
        ),
      );
      slots.push(
        timeUtils.convertDateToString(
          new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, 30),
        ),
      );
    }
    return slots;
  }, []);

  useEffect(() => {
    if (isError && !!errorMessage) {
      toast.error(errorMessage);
    }
  }, [isError, errorMessage]);

  useEffect(() => {
    if (selectedSlot) {
      const values = getValues();
      if (values.ordersData && values.ordersData[0]) {
        values.ordersData[0].date = selectedSlot;
      }
    }
  }, [selectedSlot]);

  const onCancelCombination = () => {
    setShowCombination(false);
  };

  const onApplyCombination = () => {
    if (!combinations?.items?.length) return;
    const combination = combinations.items[0];
    setSelectedCombinations([combination]);
    const values = getValues();
    values.ordersData = [
      {
        type: OrderType.Combination,
        masterId: fields[0]?.masterId,
        date: selectedSlot ?? '',
        notes: '',
        combinationId: combination.id,
      },
    ];
  };

  const onSplitCombination = () => {
    let countDuration = 0;
    const ordersData: CreatePublicOrder[] = [];
    selectedServices.forEach((service, index) => {
      ordersData.push({
        type: OrderType.Service,
        serviceId: service?.id,
        masterId: selectedMasters[index]?.id ?? fields[0].masterId,
        date: selectedSlot
          ? timeUtils.convertDateToString(
              timeUtils.addMinutesToDate(new Date(selectedSlot), countDuration),
            )
          : '',
        notes: '',
      });
      if (service) {
        countDuration += service.durationMinutes;
      }
    });
    setSelectedCombinations([]);
    const values = getValues();
    values.ordersData = ordersData;
  };

  return (
    <div className='container mx-auto max-w-xl'>
      <h1 className='text-2xl font-bold mb-6'>Book a Service (userId {userId})</h1>
      <form className='flex flex-col gap-6' onSubmit={handleSubmit}>
        <Controller
          name='customerData'
          control={control}
          render={({ field }) => (
            <CustomerCreate
              value={field.value}
              onChange={field.onChange}
              error={errors?.customerData}
              phone={phone}
              setPhone={setPhone}
            />
          )}
        />
        <Controller
          name='ordersData'
          control={control}
          render={({ field }) => (
            <div>
              <label className='block mb-2 font-medium'>Service</label>
              <select
                className='w-full border border-gray-300 rounded-lg p-2 mb-4'
                value={selectedServices[0]?.id ?? ''}
                onChange={(e) => {
                  const service = services.find((s) => s.id === Number(e.target.value)) || null;
                  setSelectedServices([service]);
                  field.onChange([
                    {
                      type: OrderType.Service,
                      serviceId: service?.id,
                      masterId: undefined,
                      date: selectedSlot ?? '',
                      notes: '',
                    },
                  ]);
                }}
              >
                <option value=''>Select a service</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
              <label className='block mb-2 font-medium'>Available Slots</label>
              <div className='flex flex-col gap-2'>
                {availableSlots.map((slot) => (
                  <label key={slot} className='flex items-center gap-2'>
                    <input
                      type='radio'
                      name='slot'
                      value={slot}
                      checked={selectedSlot === slot}
                      onChange={() => setSelectedSlot(slot)}
                      className='accent-primary-500'
                    />
                    {timeUtils.convertDateToTimeString(slot)}
                  </label>
                ))}
              </div>

              {showCombination && combinations && combinations?.items?.length > 0 && (
                <div className='mt-4 border border-primary-200 rounded-lg p-4 bg-primary-50'>
                  <div className='mb-2 font-medium'>Combination available:</div>
                  <div className='mb-2'>{combinations.items[0].name}</div>
                  <div className='flex gap-4'>
                    <Button
                      intent={ButtonIntent.Primary}
                      onClick={onApplyCombination}
                      type={ButtonType.Button}
                    >
                      Apply Combination
                    </Button>
                    <Button
                      intent={ButtonIntent.Secondary}
                      onClick={onCancelCombination}
                      type={ButtonType.Button}
                    >
                      Cancel
                    </Button>
                    <Button
                      intent={ButtonIntent.Simple}
                      onClick={onSplitCombination}
                      type={ButtonType.Button}
                    >
                      Split Combination
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        />
        <div className='flex gap-8 mt-6'>
          <Button
            disabled={isPending || formPending}
            loading={isPending || formPending}
            fit={ButtonFit.Inline}
            intent={ButtonIntent.Secondary}
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type={ButtonType.Submit}
            disabled={isPending || formPending}
            loading={isPending || formPending}
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
