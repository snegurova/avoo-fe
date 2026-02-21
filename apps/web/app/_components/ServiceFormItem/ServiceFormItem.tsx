import React, { useEffect, useState, useMemo } from 'react';
import SearchField from '@/_components/SearchField/SearchField';
import {
  CreatePrivateOrder,
  Service,
  MasterWithRelationsEntity,
  GetMastersQueryParams,
} from '@avoo/axios/types/apiTypes';
import { servicesHooks, masterHooks } from '@avoo/hooks';
import ServiceElement from '@/_components/ServiceElement/ServiceElement';
import MasterElement from '@/_components/MasterElement/MasterElement';
import { isEmptyObject } from '@avoo/shared';
import { IconButton } from '@/_components/IconButton/IconButton';
import DeleteIcon from '@/_icons/DeleteIcon';
import FormTextArea from '@/_components/FormTextArea/FormTextArea';
import FormDatePicker from '@/_components/FormDatePicker/FormDatePicker';
import FormTimePicker from '@/_components/FormTimePicker/FormTimePicker';

type Props = {
  order: CreatePrivateOrder;
  onChange: (orders: CreatePrivateOrder[]) => void;
  value: CreatePrivateOrder[];
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
  } = props;

  const [masterSearch, setMasterSearch] = useState('');
  const [masterParams, setMasterParams] = useState<GetMastersQueryParams>({ limit: 10 });

  const { params, queryParams, setSearchQuery, setMasterIds } = servicesHooks.useServicesQuery();

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
    if (isEmptyObject(initialParams)) return;

    if (initialParams.masterId) {
      const master = masters?.find((m) => m.id === initialParams.masterId) || null;
      setSelectedMasters((prev) => {
        const newMasters = [...prev];
        newMasters[index] = master;
        return newMasters;
      });
      setMasterIds(master ? [master.id] : []);
    }
  }, []);

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
  };

  const onNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newOrders = [...value];
    newOrders[index] = { ...newOrders[index], notes: e.target.value };
    onChange(newOrders);
  };

  return (
    <div className='rounded-lg border border-gray-200'>
      <div className='bg-primary-50 px-4 p-2 h-14 rounded-t-lg flex items-center justify-between'>
        <h3 className='font-medium'>{selectedService?.name ?? 'Select a service'}</h3>
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
          />
          {selectedService && <ServiceElement item={selectedService} isCard />}
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
          />
          {selectedMasters[index] && <MasterElement item={selectedMasters[index]} isCard />}
        </div>
        <div className='grid grid-cols-3 gap-x-3'>
          <div className='col-span-2'>
            <label className='block mb-2 font-medium'>Date</label>
            <FormDatePicker date={order.date} onChange={onDateChange} />
          </div>
          <div className=' '>
            <label className='block mb-2 font-medium' htmlFor={`time-${index}`}>
              Time
            </label>
            <FormTimePicker date={order.date} onChange={onDateChange} />
          </div>
          {errors?.date?.message && (
            <div className='mt-1 text-sm text-red-500 col-span-3'>{errors?.date?.message}</div>
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
