import React, { useEffect, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import {
  CreateOrder,
  GetMastersQueryParams,
  MasterWithRelationsEntity,
  Service,
} from '@avoo/axios/types/apiTypes';
import { masterHooks, servicesHooks } from '@avoo/hooks';
import { messages } from '@avoo/intl/messages/private/orders/create';
import { isEmptyObject } from '@avoo/shared';
import { useCalendarStore } from '@avoo/store';

import FormDatePicker from '@/_components/FormDatePicker/FormDatePicker';
import FormTextArea from '@/_components/FormTextArea/FormTextArea';
import FormTimePicker from '@/_components/FormTimePicker/FormTimePicker';
import { IconButton } from '@/_components/IconButton/IconButton';
import MasterElement from '@/_components/MasterElement/MasterElement';
import SearchField from '@/_components/SearchField/SearchField';
import ServiceElement from '@/_components/ServiceElement/ServiceElement';
import DeleteIcon from '@/_icons/DeleteIcon';
import { tv } from 'tailwind-variants';

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
  base: 'px-4 py-2 h-10 rounded-t-lg flex items-center justify-between transition-colors border-b ',
  variants: {
    isActive: {
      true: 'bg-primary-200 border-primary-200',
      false: 'border-primary-100',
    },
  },
});

export default function ServiceFormItem(props: Props) {
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
  } = props;

  const [masterSearch, setMasterSearch] = useState('');
  const [masterParams, setMasterParams] = useState<GetMastersQueryParams>({ limit: 10 });
  const [isActiveMasterSearch, setIsActiveMasterSearch] = useState(false);
  const [isActiveServiceSearch, setIsActiveServiceSearch] = useState(false);

  const { params, queryParams, setSearchQuery, setMasterIds } = servicesHooks.useServicesQuery();

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

    if (isActive) {
      const masterIdsProvideService = newService?.masters.map((master) => master.id) || undefined;
      setMasterIdsInStore(masterIdsProvideService);
    }
    if (slots) {
      const newSlot = {
        ...slots[index],
        title: newService?.name || null,
        duration: newService?.durationMinutes || 15,
      };
      const newSlots = [...slots];
      newSlots[index] = newSlot;
      setSlots(newSlots);
    }
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

    if (isActive) {
      setMasterIdsInStore(val.id ? [val.id] : undefined);
    }

    if (slots) {
      const newSlot = {
        ...slots[index],
        masterId: val.id,
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

  const onDateChange = (newDate: string) => {
    const newOrders = [...value];
    newOrders[index] = {
      ...newOrders[index],
      date: newDate,
    };
    onChange(newOrders);

    if (index === 0 && setStartDate) {
      setStartDate(newDate);
    }

    if (slots) {
      const newSlot = {
        ...slots[index],
        date: newDate,
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
        <h3 className='font-medium'>
          {selectedService?.name ?? <FormattedMessage {...messages.selectServiceLabel} />}
        </h3>
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
            placeholder='Search by service name'
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
            <label className='block mb-2 font-medium'>
              <FormattedMessage {...messages.date} />
            </label>
            <FormDatePicker date={order.date} onChange={onDateChange} />
          </div>
          <div className=' lg:col-span-5 xl:col-span-1'>
            <label className='block mb-2 font-medium' htmlFor={`time-${index}`}>
              <FormattedMessage {...messages.time} />
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
      </div>
    </div>
  );
}
