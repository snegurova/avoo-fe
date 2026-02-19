import React, { useCallback } from 'react';
import { TimeOffMode } from '@avoo/hooks/types/timeOffType';

type Props = {
  value: TimeOffMode;
  onChange: (mode: TimeOffMode) => void;
  className?: string;
};

export default function ModeToggle({ value, onChange, className = '' }: Props) {
  const handleTimeOffClick = useCallback(() => onChange(TimeOffMode.TimeOff), [onChange]);

  const handleExtraTimeClick = useCallback(() => onChange(TimeOffMode.ExtraTime), [onChange]);

  return (
    <div
      className={`${className} mt-6 mb-8 flex w-full relative bg-white border border-gray-200 rounded-lg md:max-w-[335px]`}
      role='tablist'
      aria-label='Time off mode'
    >
      <div
        className={`absolute left-0 top-0 h-full bg-primary-100 rounded-md transition-transform duration-500 ease-in-out w-1/2 transform ${
          value === TimeOffMode.TimeOff ? 'translate-x-0' : 'translate-x-full'
        }`}
      />
      <button
        type='button'
        role='tab'
        aria-selected={value === TimeOffMode.TimeOff}
        onClick={handleTimeOffClick}
        className='relative z-10 flex-1 py-1.5 px-4 font-normal text-base transition-colors duration-300 text-center cursor-pointer'
      >
        Time off
      </button>
      <button
        type='button'
        role='tab'
        aria-selected={value === TimeOffMode.ExtraTime}
        onClick={handleExtraTimeClick}
        className='relative z-10 flex-1 py-1.5 px-4 font-normal text-base transition-colors duration-300 text-center cursor-pointer'
      >
        Extra working time
      </button>
    </div>
  );
}
