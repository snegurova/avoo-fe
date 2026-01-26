import React, { useEffect, useState } from 'react';
import SearchField from '@/_components/SearchField/SearchField';
import { CreatePrivateOrder, Service, MasterWithRelationsEntity } from '@avoo/axios/types/apiTypes';
import { servicesHooks } from '@avoo/hooks';
import { masterHooks } from '@avoo/hooks';
import ServiceElement from '../ServiceElement/ServiceElement';
import MasterElement from '../MasterElement/MasterElement';
import { isEmptyObject } from '@avoo/shared';
import { IconButton } from '@/_components/IconButton/IconButton';
import DeleteIcon from '@/_icons/DeleteIcon';
import FormTextArea from '../FormTextArea/FormTextArea';
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
    startTimeMinutes?: number;
  };
  selectedService: Service | null;
  setSelectedService: (service: Service | null) => void;
  remove: (() => void) | null;
  errors?: { [key: string]: { message: string } };
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
  } = props;

  const [selectedMaster, setSelectedMaster] = useState<MasterWithRelationsEntity | null>(null);
  const [masterSearch, setMasterSearch] = useState('');

  const { params, queryParams, setSearchQuery } = servicesHooks.useServicesQuery();

  const { data: services } = servicesHooks.useGetServicesInfinite({
    ...queryParams,
    limit: 100,
    isActive: true,
  });

  const masters = masterHooks.useGetMastersProfileInfo();

  useEffect(() => {
    if (isEmptyObject(initialParams)) return;

    if (initialParams.masterId) {
      const master = masters?.find((m) => m.id === initialParams.masterId) || null;
      setSelectedMaster(master);
    }
  }, [initialParams]);

  const selectService = ({ id }: { id: number }) => {
    const newOrders = [...value];
    newOrders[index] = { ...newOrders[index], serviceId: id };
    onChange(newOrders);

    setSelectedService(
      services?.pages.flatMap((page) => page?.data?.items).find((service) => service?.id === id) ||
        null,
    );
  };

  const selectMaster = ({ id }: { id: number }) => {
    const newOrders = [...value];
    newOrders[index] = { ...newOrders[index], masterId: id };
    onChange(newOrders);

    setSelectedMaster(masters?.find((master) => master.id === id) || null);
  };

  const ServiceElementWrapped: React.FC<{
    item: Service;
    onClick: () => void;
  }> = ({ item, onClick }) => (
    <ServiceElement item={item} isCard={false} hideMasters={!!selectedMaster} onClick={onClick} />
  );

  const onDateChange = (newDate: string) => {
    const newOrders = [...value];
    newOrders[index] = {
      ...newOrders[index],
      date: newDate,
    };
    onChange(newOrders);
  };

  const onTimeChange = (newTimeMinutes: number) => {
    const newOrders = [...value];

    newOrders[index] = {
      ...newOrders[index],
      startTimeMinutes: newTimeMinutes,
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
            items={services?.pages?.[0]?.data?.items ?? []}
            search={params.search ?? ''}
            setSearch={setSearchQuery}
            ItemElement={ServiceElementWrapped}
            searchMode={!order.serviceId}
            placeholder='Search by service name'
            error={errors?.serviceId?.message}
          />
          {selectedService && <ServiceElement item={selectedService} isCard />}
        </div>
        <div className=''>
          <SearchField
            label='Master'
            value={order.masterId ? { id: order.masterId } : null}
            onChange={selectMaster}
            items={masters || []}
            search={masterSearch}
            setSearch={setMasterSearch}
            ItemElement={MasterElement}
            searchMode={!order.masterId}
            error={errors?.masterId?.message}
          />
          {selectedMaster && <MasterElement item={selectedMaster} isCard />}
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
            <FormTimePicker
              date={order.date}
              startTimeMinutes={order.startTimeMinutes}
              onChange={onTimeChange}
            />
          </div>
          {errors?.startTimeMinutes?.message && (
            <div className='mt-1 text-sm text-red-500 col-span-3'>
              {errors?.startTimeMinutes?.message}
            </div>
          )}
        </div>
        <div className=''>
          <label className='block mb-2 font-medium' htmlFor={`notes-${index}`}>
            Notes
          </label>
          <FormTextArea
            className='resize-none'
            rows={3}
            id={`notes-${index}`}
            value={order.notes || ''}
            onChange={onNotesChange}
            error={errors?.notes?.message}
          />
        </div>
      </div>
    </div>
  );
}
