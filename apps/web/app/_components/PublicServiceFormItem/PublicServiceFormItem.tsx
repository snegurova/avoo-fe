import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import {
  CreateOrder,
  GetMastersQueryParams,
  MasterWithRelationsEntity,
  PublicCalendarQueryParams,
  Service,
} from '@avoo/axios/types/apiTypes';
import { DATE_TIME_PICKER_FORMAT } from '@avoo/constants';
import { calendarHooks, masterHooks, servicesHooks } from '@avoo/hooks';
import { isEmptyObject } from '@avoo/shared';
import { timeUtils } from '@avoo/shared';

import FormDatePicker from '@/_components/FormDatePicker/FormDatePicker';
import FormTextArea from '@/_components/FormTextArea/FormTextArea';
import { IconButton } from '@/_components/IconButton/IconButton';
import MasterElement from '@/_components/MasterElement/MasterElement';
import PublicMasterSearch from '@/_components/PublicMasterSearch/PublicMasterSearch';
import PublicServiceSearch from '@/_components/PublicServiceSearch/PublicServiceSearch';
import SearchField from '@/_components/SearchField/SearchField';
import TimeSlotField from '@/_components/TimeSlotField/TimeSlotField';
import DeleteIcon from '@/_icons/DeleteIcon';

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
    remove,
    errors,
    selectedMasters,
    setSelectedMasters,
  } = props;

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
  const [isActiveMasterSearch, setIsActiveMasterSearch] = useState(false);
  const [step, setStep] = useState(1);

  const { data: calendar } = calendarHooks.useGetPublicCalendar(calendarParams, {
    enabled: !!selectedService && !!selectedMasters[index],
  });

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

  const onMasterElementClick = () => {
    setIsActiveMasterSearch(true);
  };

  return (
    <div className='py-4'>
      <div className='flex items-center justify-between py-3'>
        <h2 className='font-medium text-2xl leading-normal text-black'>
          {selectedService?.name ?? t('selectService')}
        </h2>
        {remove && (
          <IconButton
            className='group'
            icon={
              <DeleteIcon className='w-5 h-5 transition-colors group-hover:fill-primary-500 group-focus:fill-primary-500' />
            }
            onClick={remove}
          />
        )}
      </div>
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
        />
        <PublicMasterSearch selectedMaster={selectedMasters[index]} />
        <div className=''>
          <SearchField
            label={t('master')}
            value={order.masterId ? { id: order.masterId } : null}
            onChange={selectMaster}
            items={masters}
            search={masterSearch}
            setSearch={setMasterSearch}
            ItemElement={MasterElement}
            searchMode={!order.masterId}
            error={errors?.masterId?.message}
            hasMore={hasMoreMasters}
            fetchNextPage={fetchNextMastersPage}
            isActive={isActiveMasterSearch}
            setIsActive={setIsActiveMasterSearch}
          >
            {selectedMasters[index] && (
              <MasterElement item={selectedMasters[index]} isCard onClick={onMasterElementClick} />
            )}
          </SearchField>
        </div>
        <div className=''>
          <label className='block mb-2 font-medium'>{t('date')}</label>
          <FormDatePicker
            date={order.date}
            onChange={onDateChange}
            format={DATE_TIME_PICKER_FORMAT}
          />

          {errors?.date?.message && (
            <div className='mt-1 text-sm text-red-500 col-span-3'>{errors?.date?.message}</div>
          )}
        </div>
        <TimeSlotField
          selectedSlot={selectedSlot}
          setSelectedSlot={setSelectedSlot}
          selectedService={selectedService}
          calendar={calendar}
          calendarParams={calendarParams}
          userId={userId}
          isError={!!errors?.date?.message && !selectedSlot}
        />
        <div className=''>
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
              label: 'block font-medium',
              textarea:
                'block w-full text-sm text-black border border-gray-200 p-3 rounded-lg min-h-[70px] focus:outline-none focus:ring-1 focus:ring-purple-800',
            }}
          />
        </div>
      </div>
    </div>
  );
}
