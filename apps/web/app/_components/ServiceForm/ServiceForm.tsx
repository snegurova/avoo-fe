import React from 'react';
import { CreatePrivateOrder, MasterWithRelationsEntity, Service } from '@avoo/axios/types/apiTypes';
import ServiceFormItem from '@/_components/ServiceFormItem/ServiceFormItem';

type Props = {
  value: CreatePrivateOrder[];
  onChange: (orders: CreatePrivateOrder[]) => void;
  initialParams: {
    masterId?: number;
    date?: string;
  };
  selectedServices: (Service | null)[];
  setSelectedServices: (
    services: (Service | null)[] | ((prev: (Service | null)[]) => (Service | null)[]),
  ) => void;
  remove: (index: number) => void;
  errors?: unknown[];
  selectedMasters: (MasterWithRelationsEntity | null)[];
  setSelectedMasters: (
    masters:
      | (MasterWithRelationsEntity | null)[]
      | ((prev: (MasterWithRelationsEntity | null)[]) => (MasterWithRelationsEntity | null)[]),
  ) => void;
};

export default function ServiceForm(props: Props) {
  const {
    value,
    onChange,
    initialParams,
    selectedServices,
    setSelectedServices,
    remove,
    errors,
    selectedMasters,
    setSelectedMasters,
  } = props;
  const currentService = (index: number): Service | null => {
    return selectedServices[index] || null;
  };

  const changeCurrentService = (index: number, service: Service | null) => {
    setSelectedServices((prev: (Service | null)[]) => {
      const newServices = [...prev];
      newServices[index] = service;
      return newServices;
    });
  };

  const removeEl = (index: number) => {
    remove(index);
    setSelectedServices((prev) => {
      const newServices = [...prev];
      newServices.splice(index, 1);
      return newServices;
    });
  };

  return (
    <div className='flex flex-col gap-6'>
      {value.map((order, index, arr) => (
        <ServiceFormItem
          key={`service-item-${index}`}
          order={order}
          onChange={onChange}
          value={value}
          index={index}
          initialParams={index === 0 ? initialParams : {}}
          selectedService={currentService(index)}
          setSelectedService={(service: Service | null) => changeCurrentService(index, service)}
          remove={arr.length > 1 && index === arr.length - 1 ? () => removeEl(index) : null}
          selectedMasters={selectedMasters}
          setSelectedMasters={setSelectedMasters}
          errors={
            Array.isArray(errors)
              ? (errors[index] as { [key: string]: { message: string } }) || {}
              : {}
          }
        />
      ))}
    </div>
  );
}
