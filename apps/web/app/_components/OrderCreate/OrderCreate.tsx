'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Controller, useFieldArray } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { useRouter, useSearchParams } from 'next/navigation';

import { CreateOrder, MasterWithRelationsEntity } from '@avoo/axios/types/apiTypes';
import { combinationHooks, orderHooks } from '@avoo/hooks';
import { CalendarType } from '@avoo/hooks/types/calendarType';
import { messages } from '@avoo/intl/messages/private/orders/create';
import { OrderQueryParams } from '@avoo/hooks/types/orderQueryParams';
import { OrderType } from '@avoo/hooks/types/orderType';
import { timeUtils } from '@avoo/shared';
import { useApiStatusStore } from '@avoo/store';

import { Button, ButtonFit, ButtonIntent, ButtonType } from '@/_components/Button/Button';
import Calendar from '@/_components/Calendar/Calendar';
import CombinationForm from '@/_components/CombinationForm/CombinationForm';
import CombinationProposition from '@/_components/CombinationProposition/CombinationProposition';
import { CustomerSelect } from '@/_components/CustomerSelect/CustomerSelect';
import ServiceForm from '@/_components/ServiceForm/ServiceForm';
import ServiceFormItem from '@/_components/ServiceFormItem/ServiceFormItem';
import { localizationHooks } from '@/_hooks/localizationHooks';
import { useToast } from '@/_hooks/useToast';
import AddCircleIcon from '@/_icons/AddCircleIcon';
import { AppRoutes } from '@/_routes/routes';

const SERVICES_KEY_IN_ORDER_CREATE = 'ordersData';
const WRAPPER_HEADER_HEIGHT = '62px';

export default function OrderCreate() {
  const isPending = useApiStatusStore((state) => state.isPending);
  const errorMessage = useApiStatusStore((s) => s.errorMessage);
  const isError = useApiStatusStore((s) => s.isError);
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  const [showCombination, setShowCombination] = useState(true);
  const [selectedMasters, setSelectedMasters] = useState<(MasterWithRelationsEntity | null)[]>([
    null,
  ]);
  const [startDate, setStartDate] = useState<string | null>(null);

  const orderCreatePath = localizationHooks.useWithLocale(AppRoutes.OrderCreate);
  const calendarPath = localizationHooks.useWithLocale(AppRoutes.Calendar);

  const initialParams = useMemo(() => {
    const parsedQuery = Object.fromEntries(
      Object.values(OrderQueryParams).map((key) => [key, searchParams.get(key)]),
    ) as Record<OrderQueryParams, string | null>;

    return {
      masterId:
        parsedQuery.masterId && !Number.isNaN(Number(parsedQuery.masterId))
          ? Number(parsedQuery.masterId)
          : undefined,
      date: parsedQuery.date ?? undefined,
    };
  }, [searchParams]);

  useEffect(() => {
    if (searchParams.toString()) {
      router.replace(orderCreatePath);
    }
  }, []);

  const {
    control,
    handleSubmit,
    errors,
    selectedServices,
    setSelectedServices,
    selectedCombinations,
    setSelectedCombinations,
  } = orderHooks.useCreateOrder({
    order: {
      masterId: initialParams.masterId,
      date: initialParams.date,
    },
    onSuccess: () => {
      router.push(`${calendarPath}?date=${startDate}`);
    },
  });

  useEffect(() => {
    if (isError && !!errorMessage) {
      toast.error(errorMessage);
    }
  }, [isError, errorMessage]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: SERVICES_KEY_IN_ORDER_CREATE,
  });

  useEffect(() => {
    if (fields[0]?.date) {
      setStartDate(fields[0].date);
    }
  }, [fields]);

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

  const combinations = combinationHooks.useGetCombinations({
    serviceIds: selectedServices
      .filter((service): service is NonNullable<typeof service> => Boolean(service))
      .map((service) => service.id),
    isActive: true,
    masterIds: fields[0]?.masterId ? [fields[0].masterId] : undefined,
  });

  useEffect(() => {
    if (
      selectedServices.length < 2 ||
      combinations?.items.length === 0 ||
      selectedCombinations.length > 0
    ) {
      setShowCombination(false);
      return;
    }
    setShowCombination(true);
  }, [combinations, selectedServices, selectedCombinations]);

  const onCancelCombination = () => {
    setShowCombination(false);
  };

  const onApplyCombination = () => {
    if (!combinations?.items.length) return;

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
        notes: index === 0 ? fields[0].notes : '',
      });

      if (service) {
        countDuration += service.durationMinutes;
      }
    });

    remove();
    append(ordersData);
    setSelectedCombinations([]);
  };

  const setDateAndMasterInLastItem = (
    field: { value: CreateOrder[]; onChange: (value: CreateOrder[]) => void },
    date: string,
    master: MasterWithRelationsEntity,
  ) => {
    const updatedOrders = [...field.value];
    const lastIndex = updatedOrders.length - 1;

    setSelectedMasters((prev) => {
      const newMasters = [...prev];
      newMasters[lastIndex] = master;
      return newMasters;
    });

    updatedOrders[lastIndex] = {
      ...updatedOrders[lastIndex],
      date,
      masterId: master.id,
    };

    field.onChange(updatedOrders);
  };

  return (
    <div className={`h-[calc(100%-${WRAPPER_HEADER_HEIGHT})]  flex`}>
      <form
        className='px-8 w-full flex flex-col gap-6 overflow-y-auto overflow-x-hidden'
        onSubmit={handleSubmit}
      >
        <Controller
          name='customerData'
          control={control}
          render={({ field }) => (
            <CustomerSelect
              value={field.value ?? undefined}
              onChange={field.onChange}
              error={errors.customerData}
            />
          )}
        />
        <Controller
          name='ordersData'
          control={control}
          render={({ field }) =>
            fields[0]?.type === OrderType.Service ? (
              <ServiceForm
                value={field.value}
                onChange={field.onChange}
                initialParams={initialParams}
                selectedServices={selectedServices}
                setSelectedServices={setSelectedServices}
                selectedMasters={selectedMasters}
                setSelectedMasters={setSelectedMasters}
                remove={remove}
                errors={Array.isArray(errors.ordersData) ? errors.ordersData : []}
                Item={ServiceFormItem}
              />
            ) : (
              <CombinationForm
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
          />
        )}
        {selectedServices.length > 0 &&
          selectedServices[selectedServices.length - 1] &&
          fields[0]?.type === OrderType.Service && (
            <div className=''>
              <button
                type='button'
                onClick={addService}
                className='flex gap-2 items-center font-medium text-sm group cursor-pointer rounded-lg px-4 py-2.5 hover:bg-primary-100 focus:bg-primary-100 transition-colors'
              >
                <div className='shrink-0'>
                  <AddCircleIcon className='fill-primary-900' />
                </div>
                <span className='text-primary-900 font-medium underline'>
                  <FormattedMessage {...messages.addService} />
                </span>
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
            <FormattedMessage {...messages.cancel} />
          </Button>
          <Button
            type={ButtonType.Submit}
            disabled={isPending}
            loading={isPending}
            fit={ButtonFit.Inline}
            intent={ButtonIntent.Primary}
          >
            <FormattedMessage {...messages.create} />
          </Button>
        </div>
      </form>
      <div className='hidden lg:block lg:w-75 xl:w-100'>
        <Controller
          name='ordersData'
          control={control}
          render={({ field }) => (
            <Calendar
              calendarType={CalendarType.SELECTOR}
              onClickDateTime={(date, master) => setDateAndMasterInLastItem(field, date, master)}
              selectedMasterId={fields[field.value.length - 1]?.masterId}
            />
          )}
        />
      </div>
    </div>
  );
}
