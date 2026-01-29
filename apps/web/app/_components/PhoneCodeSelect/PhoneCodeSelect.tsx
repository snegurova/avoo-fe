import { PHONE_CODE_OPTIONS } from '@avoo/constants';
import { sharedInputClass } from '@/_styles/formMixins';
import React, { useCallback, useMemo, useState, useEffect } from 'react';
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

  useEffect(() => {
    const prev = document.body.style.overflowX;
    if (isOpen) document.body.style.overflowX = 'hidden';
    return () => {
      document.body.style.overflowX = prev;
    };
  }, [isOpen]);

  const options = useMemo(
    () =>
      PHONE_CODE_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      )),
    [],
  );

  const combinedClassName =
    (className ? className + ' ' : '') +
    sharedInputClass +
    ' text-sm appearance-none pr-10 box-border leading-[44px] py-0';

  return (
    <div className='relative inline-block h-[44px]'>
      <select
        id={id}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onMouseDown={handleMouseDown}
        className={combinedClassName}
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
