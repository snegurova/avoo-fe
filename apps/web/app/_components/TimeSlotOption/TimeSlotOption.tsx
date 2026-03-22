import React, { useMemo } from 'react';

import { timeUtils } from '@avoo/shared';

type Props = {
  date: Date;
  onChange: (date: Date) => void;
  selectedSlot: Date | null;
  isTheSameDay: boolean;
};

export default function TimeSlotOption(props: Props) {
  const { date, onChange, selectedSlot, isTheSameDay } = props;

  const time = useMemo(() => timeUtils.convertDateToTimeString(date), [date]);
  const isSelected =
    isTheSameDay && !!selectedSlot && time === timeUtils.convertDateToTimeString(selectedSlot);

  return (
    <label
      htmlFor={`slot-${time}`}
      className={`relative p-2 rounded-lg border flex items-center cursor-pointer transition-colors select-none w-full ${isSelected ? 'border-black bg-gray-50' : 'border-gray-200'} hover:bg-gray-200 focus-within:border-blackfocus-within:bg-gray-200 text-black`}
      tabIndex={0}
    >
      <input
        type='radio'
        id={`slot-${time}`}
        name='slot'
        value={time}
        checked={isSelected}
        onChange={() => onChange(date)}
        className='absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10'
        tabIndex={-1}
      />

      <span className='text-sm'>{time}</span>
    </label>
  );
}
