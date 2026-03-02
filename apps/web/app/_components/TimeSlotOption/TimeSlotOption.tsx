import React, { useMemo } from 'react';
import { timeUtils } from '@avoo/shared';

type Props = {
  date: Date;
  onChange: (date: Date) => void;
  selectedSlot: Date | null;
};

export default function TimeSlotOption(props: Props) {
  const { date, onChange, selectedSlot } = props;

  const time = useMemo(() => timeUtils.convertDateToTimeString(date), [date]);
  const isSelected = !!selectedSlot && time === timeUtils.convertDateToTimeString(selectedSlot);

  return (
    <label
      htmlFor={`slot-${time}`}
      className={`relative p-2 rounded-lg border border-gray-200 flex items-center cursor-pointer transition-colors select-none w-full
        ${isSelected ? 'border-primary-500 bg-primary-50' : ''}
        hover:border-primary-400 hover:bg-primary-50 focus-within:border-primary-500 focus-within:bg-primary-50`}
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
      <span
        className={`shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors
          ${isSelected ? 'border-primary-500 bg-primary-500' : 'border-gray-300 bg-white'}
          mr-2`}
        aria-hidden='true'
      >
        {isSelected && <span className='w-2 h-2 rounded-full bg-white block'></span>}
      </span>
      <span className='text-sm'>{time}</span>
    </label>
  );
}
