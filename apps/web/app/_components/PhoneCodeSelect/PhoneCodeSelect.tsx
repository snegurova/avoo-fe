import { PHONE_CODE_OPTIONS } from '@avoo/constants';
import React, { useCallback, useMemo, useState } from 'react';
import ArrowDownIcon from '@/_icons/ArrowDownIcon';
import ArrowUpIcon from '@/_icons/ArrowUpIcon';

type Props = {
  value: string;
  onChange: (val: string) => void;
  id?: string;
  className?: string;
};

export default function PhoneCodeSelect({ value, onChange, id, className }: Readonly<Props>) {
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = useCallback(
    (evt: React.ChangeEvent<HTMLSelectElement>) => onChange(evt.target.value),
    [onChange],
  );

  const handleFocus = useCallback(() => setIsOpen(true), []);
  const handleBlur = useCallback(() => setIsOpen(false), []);
  const handleMouseDown = useCallback(() => setIsOpen((prev) => !prev), []);

  const options = useMemo(
    () =>
      PHONE_CODE_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      )),
    [],
  );

  return (
    <div className={`relative h-full w-full ${className ?? ''}`}>
      <select
        id={id}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onMouseDown={handleMouseDown}
        className='p-3 w-full h-[44px] rounded-[8px] border border-gray-200 bg-transparent focus:outline-none focus:ring-1 focus:ring-purple-800 text-sm appearance-none pr-10 box-border leading-[44px] py-0'
        aria-label='Country code'
      >
        {options}
      </select>

      <div className='pointer-events-none absolute right-2 top-1/2 -translate-y-1/2'>
        {isOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}
      </div>
    </div>
  );
}
