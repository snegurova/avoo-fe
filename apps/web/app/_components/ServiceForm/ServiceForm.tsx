import React from 'react';
import { CreateOrder, MasterWithRelationsEntity, Service } from '@avoo/axios/types/apiTypes';

type Props = {
  value: CreateOrder[];
  onChange: (orders: CreateOrder[]) => void;
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
  Item: React.ComponentType<{
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
    selectedMasters: (MasterWithRelationsEntity | null)[];
    setSelectedMasters: (
      masters:
        | (MasterWithRelationsEntity | null)[]
        | ((prev: (MasterWithRelationsEntity | null)[]) => (MasterWithRelationsEntity | null)[]),
    ) => void;
    errors: { [key: string]: { message: string } };
  }>;
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
    Item,
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
        <Item
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
