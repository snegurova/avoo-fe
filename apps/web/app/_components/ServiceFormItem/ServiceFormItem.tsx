import React, { useEffect, useState } from 'react';
import SearchField from '@/_components/SearchField/SearchField';
import { CreatePrivateOrder, Service, MasterWithRelationsEntity } from '@avoo/axios/types/apiTypes';
import { servicesHooks } from '@avoo/hooks';
import { masterHooks } from '@avoo/hooks';
import ServiceElement from '../ServiceElement/ServiceElement';
import MasterElement from '../MasterElement/MasterElement';
import { isEmptyObject } from '@avoo/shared';
import FormInput from '@/_components/FormInput/FormInput';
import { timeUtils } from '@avoo/shared';

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
};

export default function ServiceFormItem(props: Props) {
  const { order, onChange, value, index, initialParams, selectedService, setSelectedService } =
    props;

  const [selectedMaster, setSelectedMaster] = useState<MasterWithRelationsEntity | null>(null);
  const [masterSearch, setMasterSearch] = useState('');

  const { useGetServicesInfinite, useServicesQuery } = servicesHooks;
  const { params, queryParams, setSearchQuery } = useServicesQuery();

  const { data: services } = useGetServicesInfinite({
    ...queryParams,
    limit: 3,
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

  return (
    <div className='rounded-lg border border-gray-200'>
      <div className='bg-primary-50 p-4 rounded-t-lg'>
        <h3 className='font-medium'>{selectedService?.name ?? 'Select a service'}</h3>
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
            ItemElement={ServiceElement}
            searchMode={!order.serviceId}
            placeholder='Search by service name'
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
          />
          {selectedMaster && <MasterElement item={selectedMaster} isCard />}
        </div>
        <div className='grid grid-cols-3 gap-3'>
          <div className='col-span-2'>
            <label className='block mb-2 font-medium' htmlFor={`date-${index}`}>
              Date
            </label>
            <FormInput
              type='date'
              id={`date-${index}`}
              value={order.date || ''}
              onChange={(e) => {
                const newOrders = [...value];
                newOrders[index] = { ...newOrders[index], date: e.target.value };
                onChange(newOrders);
              }}
            />
          </div>
          <div className=' '>
            <label className='block mb-2 font-medium' htmlFor={`time-${index}`}>
              Time
            </label>
            <FormInput
              type='time'
              id={`time-${index}`}
              value={
                order.startTimeMinutes ? timeUtils.getTimeFromMinutes(order.startTimeMinutes) : ''
              }
              onChange={(e) => {
                const newOrders = [...value];
                const [hours, minutes] = e.target.value.split(':').map(Number);
                newOrders[index] = {
                  ...newOrders[index],
                  startTimeMinutes: hours * 60 + minutes,
                };
                onChange(newOrders);
              }}
            />
          </div>
        </div>
        <div className=''>
          <label className='block mb-2 font-medium' htmlFor={`notes-${index}`}>
            Notes
          </label>
          <FormInput
            type='text'
            id={`notes-${index}`}
            value={order.notes || ''}
            onChange={(e) => {
              const newOrders = [...value];
              newOrders[index] = { ...newOrders[index], notes: e.target.value };
              onChange(newOrders);
            }}
          />
        </div>
      </div>
    </div>
  );
}
