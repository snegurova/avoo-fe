import React from 'react';

interface DateTimeSelectProps {
  name: string;
  label?: string;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  error?: string | boolean;
  onChange?: (value: string) => void;
}

export const DateTimeSelect = ({
  name,
  label,
  value,
  defaultValue,
  disabled,
  error,
  onChange,
}: DateTimeSelectProps) => {
  return (
    <div className='flex flex-col gap-1'>
      <label className='text-sm font-medium text-gray-700'>
        {label}
        <input
          type='date'
          id={name}
          name={name}
          value={value}
          defaultValue={defaultValue}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.value)}
          className='w-full rounded-md border transition px-3 py-2 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60'
        />
      </label>
      {error && <p className='text-sm text-red-600'>{error}</p>}
    </div>
  );
};
