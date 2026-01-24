import React from 'react';
import { CreatePrivateOrder } from '@avoo/axios/types/apiTypes';
import ServiceFormItem from '../ServiceFormItem/ServiceFormItem';
import { Service } from '@avoo/axios/types/apiTypes';

type Props = {
  value: CreatePrivateOrder[];
  onChange: (orders: CreatePrivateOrder[]) => void;
  initialParams: {
    masterId?: number;
    date?: string;
    startTimeMinutes?: number;
  };
  selectedServices: (Service | null)[];
  setSelectedServices: (
    services: (Service | null)[] | ((prev: (Service | null)[]) => (Service | null)[]),
  ) => void;
};

export default function ServiceForm(props: Props) {
  const { value, onChange, initialParams, selectedServices, setSelectedServices } = props;

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

  return (
    <div className='flex flex-col gap-6'>
      {value.map((order, index) => (
        <ServiceFormItem
          key={`service-item-${index}`}
          order={order}
          onChange={onChange}
          value={value}
          index={index}
          initialParams={index === 0 ? initialParams : {}}
          selectedService={currentService(index)}
          setSelectedService={(service: Service | null) => changeCurrentService(index, service)}
        />
      ))}
    </div>
  );
}
