import React, { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';

import { tv } from 'tailwind-variants';

import {
  CreateOrder,
  GetMastersQueryParams,
  MasterWithRelationsEntity,
  Service,
} from '@avoo/axios/types/apiTypes';
import { calendarHooks, masterHooks, servicesHooks } from '@avoo/hooks';
import { timeUtils } from '@avoo/shared';
import { isEmptyObject } from '@avoo/shared';
import { useCalendarStore } from '@avoo/store';

import FormDatePicker from '@/_components/FormDatePicker/FormDatePicker';
import FormTextArea from '@/_components/FormTextArea/FormTextArea';
import FormTimePicker from '@/_components/FormTimePicker/FormTimePicker';
import { IconButton } from '@/_components/IconButton/IconButton';
import MasterElement from '@/_components/MasterElement/MasterElement';
import SearchField from '@/_components/SearchField/SearchField';
import ServiceElement from '@/_components/ServiceElement/ServiceElement';
import { useToast } from '@/_hooks/useToast';
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
  setActiveOrder?: (index: number) => void;
  activeOrder?: number;
  setStartDate?: (date: string | null) => void;
  selectedServices: (Service | null)[];
};

const root = tv({
  base: 'rounded-lg border transition-colors',
  variants: {
    isActive: {
      true: 'border-primary-200',
      false: 'border-transparent',
    },
  },
});

const top = tv({
  base: 'px-4 py-2 h-10 rounded-t-lg flex items-center justify-between transition-colors border-b',
  variants: {
    isActive: {
      true: 'bg-primary-200 border-primary-200',
      false: 'border-primary-100',
    },
  },
});

export default function ServiceFormItem(props: Props) {
  const tCommon = useTranslations('private.components.ServiceFormItem.ServiceFormItem');
  const tCalendar = useTranslations('private.calendar.calendar');
  const tCategory = useTranslations('category.name');
  const t = useTranslations('private.orders.create');
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
    setActiveOrder,
    activeOrder,
    setStartDate,
    selectedServices,
  } = props;

  const [masterSearch, setMasterSearch] = useState('');
  const [masterParams, setMasterParams] = useState<GetMastersQueryParams>({ limit: 10 });
  const [isActiveMasterSearch, setIsActiveMasterSearch] = useState(false);
  const [isActiveServiceSearch, setIsActiveServiceSearch] = useState(false);
  const toast = useToast();

  const { params, queryParams, setSearchQuery, setMasterIds } = servicesHooks.useServicesQuery(
    tCategory('all'),
  );

  const { getAvailableDate } = calendarHooks.useGetPrivateAvailability();
  const setDate = useCalendarStore((state) => state.setDate);
  const setToDate = useCalendarStore((state) => state.setToDate);
  const triggerScrollToTime = useCalendarStore((state) => state.triggerScrollToTime);

  useEffect(() => {
    if (order.masterId) {
      setMasterParams((prev) => ({
        ...prev,
        serviceId: order.serviceId,
      }));
      setMasterIds(order.masterId ? [order.masterId] : []);
    }
    if (order.serviceId) {
      setMasterParams((prev) => ({
        ...prev,
        serviceId: order.serviceId,
      }));
    }
  }, [order.masterId, order.serviceId]);

  const isActive = useMemo(() => activeOrder === index, [activeOrder, index]);
  const setMasterIdsInStore = useCalendarStore((state) => state.setMasterIds);
  const slots = useCalendarStore((state) => state.slots);
  const setSlots = useCalendarStore((state) => state.setSlots);

  const {
    data,
    fetchNextPage: fetchNextServicesPage,
    hasNextPage: hasMoreServices,
  } = servicesHooks.useGetServicesInfinite({
    ...queryParams,
    limit: 10,
    isActive: true,
  });

  const services = useMemo(() => {
    const allServices = (data?.pages.flatMap((page) => page?.data?.items) || []).filter(
      (item): item is Service => item !== undefined,
    );

    const selectedIds = selectedServices.filter((s, i) => s && i !== index).map((s) => s!.id);
    return allServices.filter((service) => !selectedIds.includes(service.id));
  }, [data, selectedServices, index]);

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
    if (isEmptyObject(initialParams) || !masters) return;

    if (initialParams.masterId) {
      const master = masters?.find((m) => m.id === initialParams.masterId) || null;

      setSelectedMasters((prev) => {
        const newMasters = [...prev];
        newMasters[index] = master;
        return newMasters;
      });
      setMasterIds(master ? [master.id] : []);
    }
  }, [masters]);

  const selectService = async (val: { id: number } | null) => {
    if (!val) return;

    const newOrders = [...value];
    const newService = services?.find((service) => service?.id === val.id) || null;

    if (slots && slots[index]) {
      const newSlot = {
        ...slots[index],
        title: newService?.name || null,
        duration: newService?.durationMinutes || 15,
      };
      const newSlots = [...slots];
      newSlots[index] = newSlot;
      setSlots(newSlots);
    }

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

    if (selectedMasters[index]) {
      availabilityParams.masterIds = [selectedMasters[index]?.id];
    }

    if (val.id) {
      availabilityParams.serviceId = val.id;
    }

    const availableDate = await getAvailableDate(availabilityParams);

    if (!availableDate) {
      toast.error(tCommon('noAvailableTime'));
      return;
    }

    if (
      new Date(availableDate).getTime() !== new Date(availabilityParams.rangeFromTime).getTime()
    ) {
      toast.info(tCalendar('dateNotAvailable'));
    }

    setDate(timeUtils.toDayBegin(new Date(availableDate)));
    setToDate(timeUtils.toDayEnd(new Date(availableDate)));
    triggerScrollToTime(availableDate);

    newOrders[index] = { ...newOrders[index], serviceId: val.id, date: availableDate };
    onChange(newOrders);

    setSelectedService(newService);

    setMasterParams((prev) => ({
      ...prev,
      serviceId: newService?.id || undefined,
    }));

    if (isActive && !selectedMasters[index]) {
      const masterIdsProvideService = newService?.masters.map((master) => master.id) || undefined;
      setMasterIdsInStore(masterIdsProvideService);
    }
    if (slots && slots[index]) {
      const newSlot = {
        ...slots[index],
        title: newService?.name || null,
        duration: newService?.durationMinutes || 15,
        date: availableDate,
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
      toast.error(tCommon('noAvailableTime'));
      return;
    }

    if (
      new Date(availableDate).getTime() !== new Date(availabilityParams.rangeFromTime).getTime()
    ) {
      toast.info(tCalendar('dateNotAvailable'));
    }

    setDate(timeUtils.toDayBegin(new Date(availableDate)));
    setToDate(timeUtils.toDayEnd(new Date(availableDate)));
    triggerScrollToTime(availableDate);

    newOrders[index] = { ...newOrders[index], masterId: val.id, date: availableDate };
    onChange(newOrders);

    setSelectedMasters((prev) => {
      const newMasters = [...prev];
      newMasters[index] = masters?.find((master) => master.id === val.id) || null;
      return newMasters;
    });
    setMasterIds(val.id ? [val.id] : []);

    if (isActive) {
      setMasterIdsInStore(val.id ? [val.id] : undefined);
    }

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

  const ServiceElementWrapped: React.FC<{
    item: Service;
    onClick: () => void;
  }> = ({ item, onClick }) => (
    <ServiceElement
      item={item}
      isCard={false}
      hideMasters={!!selectedMasters[index]}
      onClick={onClick}
    />
  );

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

    if (selectedMasters[index]) {
      availabilityParams.masterIds = [selectedMasters[index]?.id];
    }

    if (selectedService) {
      availabilityParams.serviceId = selectedService.id;
    }

    const availableDate = await getAvailableDate(availabilityParams);

    if (!availableDate) {
      toast.error(tCommon('noAvailableTime'));
      return;
    }

    if (
      new Date(availableDate).getTime() !== new Date(availabilityParams.rangeFromTime).getTime()
    ) {
      toast.info(tCalendar('dateNotAvailable'));
    }

    setDate(timeUtils.toDayBegin(new Date(availableDate)));
    setToDate(timeUtils.toDayEnd(new Date(availableDate)));
    triggerScrollToTime(availableDate);

    const newOrders = [...value];
    newOrders[index] = {
      ...newOrders[index],
      date: availableDate,
    };
    onChange(newOrders);

    if (index === 0 && setStartDate) {
      setStartDate(availableDate);
    }

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

  const onServiceElementClick = () => {
    setIsActiveServiceSearch(true);
  };

  const onMasterElementClick = () => {
    setIsActiveMasterSearch(true);
  };

  const handleRootClick = () => {
    if (setActiveOrder) setActiveOrder(index);
  };

  const handleRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
    remove?.();
    e.stopPropagation();
  };

  return (
    <div className={root({ isActive })} onClick={handleRootClick}>
      <div className={top({ isActive })}>
        <h3 className='font-medium'>{selectedService?.name ?? t('selectServiceLabel')}</h3>
        {remove && (
          <IconButton
            className='group'
            icon={
              <DeleteIcon className='w-5 h-5 transition-colors group-hover:fill-primary-500 group-focus:fill-primary-500' />
            }
            onClick={handleRemove}
          />
        )}
      </div>
      <div className='flex flex-col gap-4 p-4'>
        <div className=''>
          <SearchField
            label='Service'
            value={order.serviceId ? { id: order.serviceId } : null}
            onChange={selectService}
            items={services}
            search={params.search ?? ''}
            setSearch={setSearchQuery}
            ItemElement={ServiceElementWrapped}
            searchMode={!order.serviceId}
            placeholder={tCommon('searchServiceName')}
            error={errors?.serviceId?.message}
            hasMore={hasMoreServices}
            fetchNextPage={fetchNextServicesPage}
            isActive={isActiveServiceSearch}
            setIsActive={setIsActiveServiceSearch}
          >
            {selectedService && (
              <ServiceElement item={selectedService} isCard onClick={onServiceElementClick} />
            )}
          </SearchField>
        </div>
        <div className=''>
          <SearchField
            label='Master'
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
        <div className='grid grid-cols-3 lg:grid-cols-12 xl:grid-cols-3 gap-x-3'>
          <div className='col-span-2 lg:col-span-7 xl:col-span-2'>
            <label className='block mb-2 font-medium'>{t('date')}</label>
            <FormDatePicker date={order.date} onChange={onDateChange} />
          </div>
          <div className=' lg:col-span-5 xl:col-span-1'>
            <label className='block mb-2 font-medium' htmlFor={`time-${index}`}>
              {t('time')}
            </label>
            <FormTimePicker date={order.date} onChange={onDateChange} />
          </div>
          {errors?.date?.message && (
            <div className='mt-1 text-sm text-red-500 col-span-3 lg:col-span-12 xl:col-span-3'>
              {errors?.date?.message}
            </div>
          )}
        </div>
        <div className=''>
          <FormTextArea
            id={`notes-${index}`}
            name={`notes-${index}`}
            value={order.notes || ''}
            onChange={onNotesChange}
            label={tCommon('notes')}
            helperText={tCommon('notesHelperText')}
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
