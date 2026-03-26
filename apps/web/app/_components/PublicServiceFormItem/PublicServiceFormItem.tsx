import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import {
  CreateOrder,
  GetMastersQueryParams,
  MasterWithRelationsEntity,
  PublicCalendarQueryParams,
  Service,
} from '@avoo/axios/types/apiTypes';
import { calendarHooks, masterHooks, servicesHooks } from '@avoo/hooks';
import { isEmptyObject } from '@avoo/shared';
import { timeUtils } from '@avoo/shared';

import FormTextArea from '@/_components/FormTextArea/FormTextArea';
import PublicMasterSearch from '@/_components/PublicMasterSearch/PublicMasterSearch';
import PublicServiceSearch from '@/_components/PublicServiceSearch/PublicServiceSearch';

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

export default function PublicServiceFormItem(props: Props) {
  const t = useTranslations('public.salon.createOrder');
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

  const { data: calendar } = calendarHooks.useGetPublicCalendar(calendarParams, {
    enabled: !!selectedService && !!selectedMasters[index],
  });

  useEffect(() => {
    if (step > maxStep) {
      setMaxStep(step);
    }
  }, [step]);

  useEffect(() => {
    if (step === 1 && serviceSelectionRef.current) {
      serviceSelectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (step === 2 && masterSelectionRef.current) {
      masterSelectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (step === 3 && DateTimeSelectionRef.current) {
      DateTimeSelectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [serviceSelectionRef.current, masterSelectionRef.current, DateTimeSelectionRef.current, step]);

  useEffect(() => {
    const newValue = timeUtils.convertDateToString(
      selectedSlot ? selectedSlot : new Date(value[index]?.date || new Date()),
    );

    const newOrders = [...value];
    newOrders[index] = {
      ...newOrders[index],
      date: newValue,
    };
    onChange(newOrders);
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

  const selectService = (val: { id: number } | null) => {
    if (!val) return;
    const newOrders = [...value];
    newOrders[index] = { ...newOrders[index], serviceId: val.id };
    onChange(newOrders);

    const newService = services?.find((service) => service?.id === val.id) || null;

    setSelectedService(newService);
    setMasterParams((prev) => ({
      ...prev,
      serviceId: newService?.id || undefined,
    }));
  };

  const selectMaster = (val: { id: number } | null) => {
    if (!val) {
      return;
    }
    const newOrders = [...value];
    newOrders[index] = { ...newOrders[index], masterId: val.id };
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
  };

  const onDateChange = (newDate: string) => {
    const newOrders = [...value];
    newOrders[index] = {
      ...newOrders[index],
      date: newDate,
    };
    onChange(newOrders);
    setCalendarParams((prev) => ({
      ...prev,
      rangeFromDate: timeUtils.formatDate(timeUtils.toDayBegin(new Date(newDate))),
      rangeToDate: timeUtils.formatDate(timeUtils.toDayEnd(new Date(newDate))),
    }));
  };

  const onNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newOrders = [...value];
    newOrders[index] = { ...newOrders[index], notes: e.target.value };
    onChange(newOrders);
  };

  return (
    <div className='py-4'>
      <div className='flex flex-col gap-4'>
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
              label: 'block text-black font-medium',
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
