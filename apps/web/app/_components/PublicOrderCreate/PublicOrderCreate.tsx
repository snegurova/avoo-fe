'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, useFieldArray } from 'react-hook-form';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { CreateOrder, MasterWithRelationsEntity } from '@avoo/axios/types/apiTypes';
import { combinationHooks, orderHooks } from '@avoo/hooks';
import { OrderType } from '@avoo/hooks/types/orderType';
import { timeUtils } from '@avoo/shared';
import { useApiStatusStore } from '@avoo/store';

import { Button, ButtonFit, ButtonIntent, ButtonType } from '@/_components/Button/Button';
import CombinationProposition from '@/_components/CombinationProposition/CombinationProposition';
import CustomerCreate from '@/_components/CustomerCreate/CustomerCreate';
import PublicCombinationForm from '@/_components/PublicCombinationForm/PublicCombinationForm';
import PublicOrderTitle from '@/_components/PublicOrderTitle/PublicOrderTitle';
import PublicOrderTotal from '@/_components/PublicOrderTotal/PublicOrderTotal';
import PublicServiceFormItem from '@/_components/PublicServiceFormItem/PublicServiceFormItem';
import ServiceForm from '@/_components/ServiceForm/ServiceForm';
import { useToast } from '@/_hooks/useToast';
import AddIcon from '@/_icons/AddIcon';

const SERVICES_KEY_IN_ORDER_CREATE = 'ordersData';

export default function PublicOrderCreate() {
  const t = useTranslations('public.salon.createOrder');
  const customerDataRef = useRef<HTMLDivElement>(null);
  const params = useParams();
  const userId = Number(params.userId);
  const isPending = useApiStatusStore((state) => state.isPending);
  const errorMessage = useApiStatusStore((s) => s.errorMessage);
  const isError = useApiStatusStore((s) => s.isError);
  const router = useRouter();
  const toast = useToast();
  const [showCombination, setShowCombination] = useState(true);
  const [phone, setPhone] = useState('');
  const [selectedMasters, setSelectedMasters] = useState<(MasterWithRelationsEntity | null)[]>([
    null,
  ]);
  const [ordersDataFilled, setOrdersDataFilled] = useState(false);
  const [customerDataFilled, setCustomerDataFilled] = useState(false);

  const initialParams = {};

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
    userId: userId,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: SERVICES_KEY_IN_ORDER_CREATE,
  });

  useEffect(() => {
    const values = getValues();
    const ordersData = values.ordersData as CreateOrder[] | undefined;
    if (ordersData) {
      const allFilled = ordersData.every(
        (order) => order.masterId && (order.serviceId || order.combinationId),
      );
      setOrdersDataFilled(allFilled);
    }
  }, [selectedServices, selectedMasters, selectedCombinations, getValues]);

  useEffect(() => {
    const values = getValues();
    if (values.customerData) {
      getValues().customerData.phone = phone;
    }
  }, [phone]);

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

  const combinations = combinationHooks.useGetPublicCombinations({
    serviceIds: selectedServices
      .filter((service): service is NonNullable<typeof service> => Boolean(service))
      .map((service) => service.id),
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

  useEffect(() => {
    if (isError && !!errorMessage) {
      toast.error(errorMessage);
    }
  }, [isError, errorMessage]);

  const onCancelCombination = () => {
    setShowCombination(false);
  };

  const onApplyCombination = () => {
    if (!combinations?.items?.length) return;

    const combination = combinations.items[0];
    const masterId = fields[0]?.masterId;
    const date = fields[0]?.date;
    const notes = fields[0]?.notes;

    setSelectedCombinations([combination]);

    remove();
    append({
      type: OrderType.Combination,
      masterId,
      date,
      notes,
      combinationId: combination.id,
    });
  };

  const onSplitCombination = () => {
    let countDuration = 0;
    const ordersData: CreateOrder[] = [];
    selectedServices.forEach((service, index) => {
      ordersData.push({
        type: OrderType.Service,
        serviceId: service?.id,
        masterId: selectedMasters[index]?.id ?? fields[0].masterId,
        date: fields[0].date
          ? timeUtils.convertDateToString(
              timeUtils.addMinutesToDate(new Date(fields[0].date), countDuration),
            )
          : '',
        notes: '',
      });
      if (service) {
        countDuration += service.durationMinutes;
      }
    });
    setSelectedCombinations([]);
    for (let i = fields.length - 1; i >= 0; i--) {
      remove(i);
    }
    ordersData.forEach((order) => {
      append(order);
    });
  };

  return (
    <form className='flex flex-col gap-6 pt-4 pb-35' onSubmit={handleSubmit}>
      <Controller
        name='ordersData'
        control={control}
        render={({ field }) =>
          fields[0]?.type === OrderType.Service ? (
            <ServiceForm
              value={field.value}
              onChange={field.onChange}
              selectedServices={selectedServices}
              setSelectedServices={setSelectedServices}
              selectedMasters={selectedMasters}
              setSelectedMasters={setSelectedMasters}
              remove={remove}
              errors={Array.isArray(errors.ordersData) ? errors.ordersData : []}
              Item={PublicServiceFormItem}
              initialParams={initialParams}
            />
          ) : (
            <PublicCombinationForm
              value={field.value}
              onChange={field.onChange}
              selectedCombination={selectedCombinations[0]}
              errors={Array.isArray(errors.ordersData) ? errors.ordersData[0] : {}}
              selectedMasters={selectedMasters}
              setSelectedMasters={setSelectedMasters}
              splitCombination={onSplitCombination}
            />
          )
        }
      />

      {showCombination && combinations?.items.length && (
        <CombinationProposition
          data={combinations?.items[0]}
          onCancel={onCancelCombination}
          onApply={onApplyCombination}
          isPublic
        />
      )}
      {selectedServices.length > 0 &&
        selectedServices[selectedServices.length - 1] &&
        fields[0]?.type === OrderType.Service && (
          <div className=''>
            <button
              type='button'
              onClick={addService}
              className='flex gap-2 items-center font-medium group cursor-pointer rounded-lg px-5 py-2.5 hover:bg-gray-100 focus:bg-gray-100 transition-colors border border-black'
            >
              <div className='shrink-0'>
                <AddIcon className='fill-black' />
              </div>
              <span className='text-black font-medium'>{t('addExtraService')}</span>
            </button>
          </div>
        )}

      {ordersDataFilled && (
        <Controller
          name='customerData'
          control={control}
          render={({ field }) => (
            <div className='flex flex-col gap-6' ref={customerDataRef}>
              <PublicOrderTitle title='yourBookingDetails' isActive={ordersDataFilled} />
              <CustomerCreate
                value={field.value ?? {}}
                onChange={field.onChange}
                error={errors?.customerData}
                phone={phone}
                setPhone={setPhone}
                isPublic
                setCustomerDataFilled={setCustomerDataFilled}
              />
            </div>
          )}
        />
      )}
      <Controller
        name='ordersData'
        control={control}
        render={({ field }) => (
          <PublicOrderTotal
            fields={field.value}
            selectedServices={selectedServices}
            selectedMasters={selectedMasters}
            selectedCombinations={selectedCombinations}
          />
        )}
      />

      <div className='flex gap-8 justify-end'>
        <Button
          disabled={isPending || formPending}
          loading={isPending || formPending}
          fit={ButtonFit.Inline}
          intent={ButtonIntent.Cancel}
          onClick={() => router.back()}
        >
          {t('cancel')}
        </Button>
        <Button
          type={ButtonType.Submit}
          disabled={isPending || formPending || !ordersDataFilled || !customerDataFilled}
          loading={isPending || formPending}
          fit={ButtonFit.Inline}
          intent={ButtonIntent.Submit}
        >
          {t('confirmBooking')}
        </Button>
      </div>
    </form>
  );
}
