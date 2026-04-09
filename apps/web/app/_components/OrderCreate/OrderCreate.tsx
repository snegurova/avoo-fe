'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Controller, useFieldArray } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { CreateOrder, MasterWithRelationsEntity } from '@avoo/axios/types/apiTypes';
import { calendarHooks, combinationHooks, orderHooks } from '@avoo/hooks';
import { CalendarType } from '@avoo/hooks/types/calendarType';
import { CalendarViewType } from '@avoo/hooks/types/calendarViewType';
import { OrderQueryParams } from '@avoo/hooks/types/orderQueryParams';
import { OrderType } from '@avoo/hooks/types/orderType';
import { CalendarSlot, timeUtils } from '@avoo/shared';
import { useApiStatusStore, useCalendarStore } from '@avoo/store';

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
  useEffect(() => {
    setTimeout(() => {
      useApiStatusStore.getState().setIsPending(false);
    }, 0);
  }, []);
  const t = useTranslations('private.orders.create');
  const tCalendar = useTranslations('private.calendar.calendar');
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
  const [activeOrder, setActiveOrder] = useState<number>(0);

  const setMasterIds = useCalendarStore((state) => state.setMasterIds);
  const setDate = useCalendarStore((state) => state.setDate);
  const setToDate = useCalendarStore((state) => state.setToDate);
  const setType = useCalendarStore((state) => state.setType);
  const setStatuses = useCalendarStore((state) => state.setStatuses);
  const setOrderIsOutOfSchedule = useCalendarStore((state) => state.setOrderIsOutOfSchedule);
  const slots = useCalendarStore((state) => state.slots);
  const setSlots = useCalendarStore((state) => state.setSlots);

  const orderCreatePath = localizationHooks.useWithLocale(AppRoutes.OrderCreate);
  const calendarPath = localizationHooks.useWithLocale(AppRoutes.Calendar);

  const { getAvailableDate } = calendarHooks.useGetPrivateAvailability();

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
    const checkAndSetDate = async () => {
      if (initialParams.date && initialParams.masterId) {
        const availableDate = await getAvailableDate({
          rangeFromTime: initialParams.date,
          masterIds: [initialParams.masterId],
          index: 0,
        });
        if (availableDate) {
          setStartDate(availableDate);

          if (new Date(availableDate).getTime() !== new Date(initialParams.date).getTime()) {
            toast.info(tCalendar('dateNotAvailable'));
          }
        } else {
          setStartDate(initialParams.date);
        }
      } else if (initialParams.date) {
        setStartDate(initialParams.date);
      }
    };
    checkAndSetDate();
  }, [initialParams.date, initialParams.masterId]);

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
    const initSlot = {
      index: 0,
      title: selectedServices?.[0]?.name || null,
      masterId: initialParams.masterId || selectedMasters[0]?.id || null,
      date: initialParams.date || fields[0]?.date || timeUtils.convertDateToString(new Date()),
      duration: selectedServices?.[0]?.durationMinutes || 15,
      serviceId: selectedServices?.[0]?.id || null,
      combinationId: selectedCombinations?.[0]?.id || null,
    };
    setSlots([initSlot]);
  }, [initialParams]);

  useEffect(() => {
    if (fields[activeOrder]) {
      const activeOrderData = fields[activeOrder];
      setDate(new Date(activeOrderData.date));
      setToDate(new Date(activeOrderData.date));
      setType(CalendarViewType.DAY);
      setStatuses(undefined);
      setOrderIsOutOfSchedule(undefined);

      if (activeOrderData.masterId) {
        setMasterIds([activeOrderData.masterId]);
      } else if (activeOrderData.serviceId) {
        const activeOrderService = selectedServices[activeOrder]?.id
          ? selectedServices[activeOrder]
          : null;
        const masterIdsProvideService =
          activeOrderService?.masters.map((master) => master.id) ?? undefined;
        setMasterIds(masterIdsProvideService);
      } else {
        setMasterIds(undefined);
      }
    }
  }, [activeOrder]);

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

    setMasterIds(undefined);

    setActiveOrder(fields.length);

    setSlots([
      ...(slots ? [...slots] : []),
      {
        index: fields.length,
        title: null,
        masterId: null,
        date: timeUtils.convertDateToString(nextDate),
        duration: 15,
        serviceId: null,
        combinationId: null,
      },
    ]);
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
    setActiveOrder(0);

    const newSlot = {
      index: 0,
      title: combination.name,
      masterId: masterId || null,
      date: date || timeUtils.convertDateToString(new Date()),
      duration: combination.durationMinutes,
      serviceId: null,
      combinationId: combination.id,
    };
    setSlots([newSlot]);
  };

  const onSplitCombination = () => {
    let countDuration = 0;
    const ordersData: CreateOrder[] = [];
    const newSlots: CalendarSlot[] = [];

    selectedServices.forEach((service, index) => {
      const selectedDate = fields[0].date ? new Date(fields[0].date) : new Date();
      const orderDate = timeUtils.convertDateToString(
        timeUtils.addMinutesToDate(selectedDate, countDuration),
      );
      ordersData.push({
        type: OrderType.Service,
        serviceId: service?.id,
        masterId: selectedMasters[index]?.id ?? fields[0].masterId,
        date: orderDate,
        notes: index === 0 ? fields[0].notes : '',
      });

      countDuration += service ? service.durationMinutes : 15;

      newSlots.push({
        index,
        title: service?.name || null,
        masterId: selectedMasters[index]?.id || null,
        date: orderDate,
        duration: service?.durationMinutes || 15,
        serviceId: service?.id || null,
        combinationId: null,
      });
    });

    remove();
    append(ordersData);
    setSelectedCombinations([]);
    setSlots(newSlots);
  };

  const setDateAndMasterInSelectedItem = async (
    field: { value: CreateOrder[]; onChange: (value: CreateOrder[]) => void },
    date: string,
    master: MasterWithRelationsEntity,
    index: number,
  ) => {
    const params: {
      rangeFromTime: string;
      masterIds?: number[];
      serviceId?: number;
      combinationId?: number;
      index: number;
    } = {
      rangeFromTime: date,
      masterIds: [master.id],
      index,
    };

    if (field.value[index].serviceId) {
      params.serviceId = field.value[index].serviceId;
    }
    if (field.value[index].combinationId) {
      params.combinationId = field.value[index].combinationId;
    }

    const availableDate = await getAvailableDate(params);

    if (!availableDate) {
      toast.error(t('noAvailableDateAndTime'));
      return;
    }

    if (new Date(availableDate).getTime() !== new Date(params.rangeFromTime).getTime()) {
      toast.info(tCalendar('dateNotAvailable'));
    }

    setMasterIds([master.id]);

    const updatedOrders = [...field.value];
    const isMasterProvidesService = selectedServices[activeOrder]?.masters.some(
      (m) => m.id === master.id,
    );
    if (selectedServices[activeOrder] && !isMasterProvidesService) {
      toast.error(t('selectedMasterDoesNotProvideService'));
      return;
    }
    setSelectedMasters((prev) => {
      const newMasters = [...prev];
      newMasters[activeOrder] = master;
      return newMasters;
    });
    setMasterIds([master.id]);
    updatedOrders[activeOrder] = {
      ...updatedOrders[activeOrder],
      date: availableDate,
      masterId: master.id,
    };
    if (index === 0) {
      setStartDate(availableDate);
    }
    field.onChange(updatedOrders);
    if (slots && slots[index]) {
      const newSlots = [...slots];
      newSlots[activeOrder] = {
        ...newSlots[activeOrder],
        masterId: master.id,
        date: availableDate,
      };
      setSlots(newSlots);
    }
  };

  return (
    <div className={`h-[calc(100%-${WRAPPER_HEADER_HEIGHT})] flex`}>
      <form
        className='px-8 lg:pl-8 lg:pr-4 w-full flex flex-col gap-6 overflow-y-auto overflow-x-hidden flex-1'
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
                setActiveOrder={setActiveOrder}
                activeOrder={activeOrder}
                setStartDate={setStartDate}
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
                setStartDate={setStartDate}
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
                <span className='text-primary-900 font-medium underline'>{t('addService')}</span>
              </button>
            </div>
          )}
        <div className='flex gap-4 lg:gap-6 xl:gap-8 mt-6 pb-15'>
          <Button
            disabled={isPending}
            loading={isPending}
            fit={ButtonFit.Inline}
            intent={ButtonIntent.Secondary}
            onClick={() => router.back()}
          >
            {t('cancel')}
          </Button>
          <Button
            type={ButtonType.Submit}
            disabled={isPending}
            loading={isPending}
            fit={ButtonFit.Inline}
            intent={ButtonIntent.Primary}
          >
            {t('create')}
          </Button>
        </div>
      </form>
      <div className='hidden lg:block lg:min-w-100 flex-1'>
        <Controller
          name='ordersData'
          control={control}
          render={({ field }) => (
            <Calendar
              calendarType={CalendarType.SELECTOR}
              onClickDateTime={(date, master) =>
                setDateAndMasterInSelectedItem(field, date, master, activeOrder)
              }
            />
          )}
        />
      </div>
    </div>
  );
}
