import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { tv } from 'tailwind-variants';

import {
  CreateOrder,
  GetMastersQueryParams,
  MasterWithRelationsEntity,
  PublicCalendarQueryParams,
  Service,
} from '@avoo/axios/types/apiTypes';
import { calendarHooks, masterHooks, servicesHooks } from '@avoo/hooks';
import { isEmptyObject, timeUtils } from '@avoo/shared';
import { useCalendarStore } from '@avoo/store';

import FormTextArea from '@/_components/FormTextArea/FormTextArea';
import PublicMasterSearch from '@/_components/PublicMasterSearch/PublicMasterSearch';
import PublicServiceSearch from '@/_components/PublicServiceSearch/PublicServiceSearch';
import { useToast } from '@/_hooks/useToast';

import PublicDateTimeSelection from '../PublicDateTimeSelection/PublicDateTimeSelection';

type Props = {
  order: CreateOrder;
  onChange: (orders: CreateOrder[]) => void;
  value: CreateOrder[];
  index: number;
  initialParams: {
    masterId?: number;
    date?: string;
  };
  selectedService: Service | null;
  setSelectedService: (service: Service | null) => void;
  remove: (() => void) | null;
  errors?: { [key: string]: { message: string } };
  selectedMasters: (MasterWithRelationsEntity | null)[];
  setSelectedMasters: (
    masters:
      | (MasterWithRelationsEntity | null)[]
      | ((prev: (MasterWithRelationsEntity | null)[]) => (MasterWithRelationsEntity | null)[]),
  ) => void;
};

const itemWrapper = tv({
  base: 'pb-4 border border-gray-300 rounded-lg overflow-hidden transition-colors',
  variants: {
    active: {
      true: 'border-primary-200',
      false: 'border-gray-300',
    },
  },
});

const itemTitleWrapper = tv({
  base: 'p-4 border-b mb-4 transition-colors',
  variants: {
    active: {
      true: 'border-primary-200 bg-primary-100',
      false: 'border-gray-200 bg-gray-50',
    },
  },
});

export default function PublicServiceFormItem(props: Props) {
  const t = useTranslations('public.salon.createOrder');
  const tCalendar = useTranslations('private.calendar.calendar');
  const toast = useToast();
  const {
    order,
    onChange,
    value,
    index,
    initialParams,
    selectedService,
    setSelectedService,
    errors,
    selectedMasters,
    setSelectedMasters,
  } = props;

  const serviceSelectionRef = useRef<HTMLDivElement>(null);
  const masterSelectionRef = useRef<HTMLDivElement>(null);
  const DateTimeSelectionRef = useRef<HTMLDivElement>(null);
  const searchParams = useParams();
  const userId = Number(searchParams.userId);
  const setSlots = useCalendarStore((state) => state.setSlots);
  const slots = useCalendarStore((state) => state.slots);
  const { getAvailableDate } = calendarHooks.useGetPublicAvailability(userId);
  const [masterSearch, setMasterSearch] = useState('');
  const [masterParams, setMasterParams] = useState<GetMastersQueryParams>({ limit: 10 });
  const [calendarParams, setCalendarParams] = useState<PublicCalendarQueryParams>({
    userId,
    rangeFromDate: timeUtils.formatDate(
      timeUtils.toDayBegin(value[index]?.date ? new Date(value[index].date) : new Date()),
    ),
    rangeToDate: timeUtils.formatDate(
      timeUtils.toDayEnd(value[index]?.date ? new Date(value[index].date) : new Date()),
    ),
  });
  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);
  const [step, setStep] = useState(selectedService ? 4 : 1);
  const [selectAnyMaster, setSelectAnyMaster] = useState(false);
  const [maxStep, setMaxStep] = useState(selectedService ? 4 : 1);

  const relevantMasterIds = useMemo(() => {
    if (selectAnyMaster && selectedService) {
      return selectedService.masters?.map((m) => m.id) || [];
    }
    if (selectedMasters[index]) {
      return [selectedMasters[index].id];
    }
    return [];
  }, [selectAnyMaster, selectedService, selectedMasters, index]);

  const { data: calendar } = calendarHooks.useGetPublicCalendar(
    {
      ...calendarParams,
      masterIds: relevantMasterIds.length > 0 ? relevantMasterIds : undefined,
    },
    {
      enabled:
        !!selectedService &&
        (selectAnyMaster ? relevantMasterIds.length > 0 : !!selectedMasters[index]),
    },
  );

  useEffect(() => {
    if (step > maxStep) {
      setMaxStep(step);
    }
  }, [step]);

  useEffect(() => {
    let target: HTMLDivElement | null = null;
    if (step === 1 && serviceSelectionRef.current) {
      target = serviceSelectionRef.current;
    } else if (step === 2 && masterSelectionRef.current) {
      target = masterSelectionRef.current;
    } else if (step === 3 && DateTimeSelectionRef.current) {
      target = DateTimeSelectionRef.current;
    }
    if (target) {
      const rect = target.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      window.scrollTo({
        top: rect.top + scrollTop - 16,
        behavior: 'smooth',
      });
    }
  }, [serviceSelectionRef.current, masterSelectionRef.current, DateTimeSelectionRef.current, step]);

  useEffect(() => {
    if (!selectedSlot) return;
    if (selectAnyMaster && selectedService && selectedSlot) {
      const allMasterIds = selectedService.masters?.map((m) => m.id) || [];

      let foundMasterId: number | null = null;
      let foundMaster: MasterWithRelationsEntity | null = null;
      for (const masterId of allMasterIds) {
        if (slots && Array.isArray(slots)) {
          const slot = slots.find(
            (s) =>
              s.masterId === masterId &&
              Math.abs(new Date(s.date).getTime() - selectedSlot.getTime()) < 60000,
          );
          if (slot) {
            foundMasterId = masterId;
            break;
          }
        }
      }
      if (!foundMasterId && allMasterIds.length > 0) {
        foundMasterId = allMasterIds[0];
      }
      if (foundMasterId) {
        foundMaster = masters?.find((m) => m.id === foundMasterId) || null;
      }
      const newValue = timeUtils.convertDateToString(selectedSlot);
      const newOrders = [...value];
      newOrders[index] = {
        ...newOrders[index],
        date: newValue,
        masterId: foundMasterId || 0,
      };
      onChange(newOrders);
      setSelectedMasters((prev) => {
        const newMasters = [...prev];
        newMasters[index] = foundMaster;
        return newMasters;
      });
    } else {
      const newValue = timeUtils.convertDateToString(selectedSlot);
      const newOrders = [...value];
      newOrders[index] = {
        ...newOrders[index],
        date: newValue,
      };
      onChange(newOrders);
    }
  }, [selectedSlot]);

  const { params, queryParams, setSearchQuery, setMasterIds, setCategory } =
    servicesHooks.usePublicServiceQuery(userId);

  const {
    data,
    fetchNextPage: fetchNextServicesPage,
    hasNextPage: hasMoreServices,
  } = servicesHooks.useGetPublicServicesInfinite({ ...queryParams, limit: 10 });

  const services = useMemo(
    () =>
      (data?.pages.flatMap((page) => page?.data?.items) || []).filter(
        (item): item is Service => item !== undefined,
      ),
    [data],
  );

  const {
    data: mastersData,
    fetchNextPage: fetchNextMastersPage,
    hasNextPage: hasMoreMasters,
  } = masterHooks.useGetPublicMastersInfinite(masterParams);

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
    if (isEmptyObject(initialParams) || !masters) return;

    if (initialParams.masterId) {
      const master = masters?.find((m) => m.id === initialParams.masterId) || null;

      setSelectedMasters((prev) => {
        const newMasters = [...prev];
        newMasters[index] = master;
        return newMasters;
      });
      setMasterIds(master ? [master.id] : []);
      setCalendarParams((prev) => ({
        ...prev,
        masterIds: master ? [master.id] : undefined,
      }));
    }
  }, [masters]);

  const selectService = async (val: { id: number } | null) => {
    if (!val) return;
    const newOrders = [...value];

    const availabilityParams: {
      rangeFromTime: string;
      masterIds?: number[];
      serviceId?: number;
      combinationId?: number;
      index: number;
    } = {
      index,
      rangeFromTime: newOrders[index].date,
    };
    if (selectAnyMaster && val.id) {
      const allMasterIds = services?.find((s) => s.id === val.id)?.masters?.map((m) => m.id) || [];
      availabilityParams.masterIds = allMasterIds;
    } else if (selectedMasters[index]) {
      availabilityParams.masterIds = [selectedMasters[index]?.id];
    }
    if (val.id) {
      availabilityParams.serviceId = val.id;
    }
    const availableDate = await getAvailableDate(availabilityParams);
    if (!availableDate) {
      toast.error(t('noAvailableDates'));
      return;
    }

    if (
      new Date(availableDate).getTime() !== new Date(availabilityParams.rangeFromTime).getTime()
    ) {
      toast.info(tCalendar('dateNotAvailable'));
    }

    newOrders[index] = { ...newOrders[index], serviceId: val.id, date: availableDate };
    onChange(newOrders);

    const newService = services?.find((service) => service?.id === val.id) || null;
    setSelectedService(newService);
    setMasterParams((prev) => ({
      ...prev,
      serviceId: newService?.id || undefined,
    }));

    if (slots && slots[index]) {
      const newSlot = {
        ...slots[index],
        title: newService?.name || null,
        duration: newService?.durationMinutes || 15,
        date: availableDate,
        serviceId: newService?.id || null,
      };
      const newSlots = [...slots];
      newSlots[index] = newSlot;
      setSlots(newSlots);
    }
  };

  const selectMaster = async (val: { id: number } | null) => {
    if (!val) {
      return;
    }
    const newOrders = [...value];

    const availabilityParams: {
      rangeFromTime: string;
      masterIds?: number[];
      serviceId?: number;
      combinationId?: number;
      index: number;
    } = {
      index,
      rangeFromTime: newOrders[index].date,
    };
    if (val.id) {
      availabilityParams.masterIds = [val.id];
    }
    if (selectedService) {
      availabilityParams.serviceId = selectedService.id;
    }
    const availableDate = await getAvailableDate(availabilityParams);
    if (!availableDate) {
      toast.error(t('noAvailableDates'));
      return;
    }

    if (
      new Date(availableDate).getTime() !== new Date(availabilityParams.rangeFromTime).getTime()
    ) {
      toast.info(tCalendar('dateNotAvailable'));
    }

    newOrders[index] = { ...newOrders[index], masterId: val.id, date: availableDate };
    onChange(newOrders);

    setSelectedMasters((prev) => {
      const newMasters = [...prev];
      newMasters[index] = masters?.find((master) => master.id === val.id) || null;
      return newMasters;
    });
    setMasterIds(val.id ? [val.id] : []);
    setCalendarParams((prev) => ({
      ...prev,
      masterIds: val.id ? [val.id] : undefined,
    }));

    if (slots && slots[index]) {
      const newSlot = {
        ...slots[index],
        masterId: val.id,
        date: availableDate,
      };
      const newSlots = [...slots];
      newSlots[index] = newSlot;
      setSlots(newSlots);
    }
  };

  const onDateChange = async (newDate: string) => {
    const availabilityParams: {
      rangeFromTime: string;
      masterIds?: number[];
      serviceId?: number;
      combinationId?: number;
      index: number;
    } = {
      rangeFromTime: newDate,
      index,
    };
    if (selectAnyMaster && selectedService) {
      availabilityParams.masterIds = selectedService.masters?.map((m) => m.id) || [];
    } else if (selectedMasters[index]) {
      availabilityParams.masterIds = [selectedMasters[index]?.id];
    }
    if (selectedService) {
      availabilityParams.serviceId = selectedService.id;
    }
    const availableDate = await getAvailableDate(availabilityParams);
    if (!availableDate) {
      toast.error(t('noAvailableDates'));
      return;
    }

    if (
      new Date(availableDate).getTime() !== new Date(availabilityParams.rangeFromTime).getTime()
    ) {
      toast.info(tCalendar('dateNotAvailable'));
    }

    const newOrders = [...value];
    newOrders[index] = {
      ...newOrders[index],
      date: availableDate,
    };
    onChange(newOrders);
    setCalendarParams((prev) => ({
      ...prev,
      rangeFromDate: timeUtils.formatDate(timeUtils.toDayBegin(new Date(availableDate))),
      rangeToDate: timeUtils.formatDate(timeUtils.toDayEnd(new Date(availableDate))),
      masterIds:
        selectAnyMaster && selectedService
          ? selectedService.masters?.map((m) => m.id) || undefined
          : prev.masterIds,
    }));

    if (slots && slots[index]) {
      const newSlot = {
        ...slots[index],
        date: availableDate,
      };
      const newSlots = [...slots];
      newSlots[index] = newSlot;
      setSlots(newSlots);
    }
  };

  const onNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newOrders = [...value];
    newOrders[index] = { ...newOrders[index], notes: e.target.value };
    onChange(newOrders);
  };

  return (
    <div className={itemWrapper({ active: step < 4 })}>
      <div className={itemTitleWrapper({ active: step < 4 })}>
        <h2 className='text-xl font-medium text-black'>
          {selectedService ? selectedService.name : t('service') + ' #' + (index + 1)}
        </h2>
      </div>
      <div className='flex flex-col gap-4 px-4'>
        <div className='flex flex-col gap-4'>
          <PublicServiceSearch
            setCategory={setCategory}
            items={services}
            onChange={selectService}
            value={order.serviceId ?? null}
            search={params.search ?? ''}
            setSearch={setSearchQuery}
            hasMore={hasMoreServices}
            fetchNextPage={fetchNextServicesPage}
            setStep={setStep}
            isActive={step === 1}
            selectedService={selectedService}
            ref={serviceSelectionRef}
            userId={userId}
          />
          <FormTextArea
            id={`notes-${index}`}
            name={`notes-${index}`}
            value={order.notes || ''}
            onChange={onNotesChange}
            label={t('notes')}
            helperText={t('notesHelper')}
            maxLength={200}
            error={errors?.notes?.message}
            classNames={{
              label: 'block font-medium text-base leading-loose text-black py-1',
              textarea:
                'block w-full text-sm text-black border border-gray-200 p-3 rounded-lg min-h-[70px] focus:outline-none focus:ring-1 focus:ring-black',
            }}
          />
        </div>
        {maxStep > 1 && (
          <PublicMasterSearch
            selectedMaster={selectedMasters[index]}
            isActive={step === 2}
            items={masters}
            onChange={selectMaster}
            value={order.masterId ?? null}
            search={masterSearch}
            setSearch={setMasterSearch}
            hasMore={hasMoreMasters}
            fetchNextPage={fetchNextMastersPage}
            setStep={setStep}
            selectAnyMaster={selectAnyMaster}
            setSelectAnyMaster={setSelectAnyMaster}
            ref={masterSelectionRef}
          />
        )}
        {maxStep > 2 && (
          <PublicDateTimeSelection
            ref={DateTimeSelectionRef}
            isActive={step === 3}
            date={order.date}
            onChange={onDateChange}
            error={errors?.date?.message}
            selectedSlot={selectedSlot}
            setSelectedSlot={setSelectedSlot}
            selectedService={selectedService}
            calendar={calendar}
            calendarParams={calendarParams}
            userId={userId}
            setStep={setStep}
          />
        )}
      </div>
    </div>
  );
}
