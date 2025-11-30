import React, { useState, useRef, useEffect } from 'react';
import { tv } from 'tailwind-variants';

export type Option = { label: string; value: string | number };

export enum SelectIntent {
  Primary = 'primary',
  Neutral = 'neutral',
  Error = 'error',
}

export enum SelectSize {
  Md = 'md',
  Sm = 'sm',
}

export type Props = {
  id?: string;
  name: string;
  label?: string;
  options: Option[];
  selected: (string | number)[];
  placeholder?: string;
  disabled?: boolean;
  error?: string | boolean;
  intent?: SelectIntent;
  size?: SelectSize;
  selectAll?: boolean;
  selectAllLabel?: string;
  onChange?: (values: (string | number)[]) => void;
};

const styles = tv({
  slots: {
    container: 'flex flex-col gap-1 w-full relative',
    trigger:
      'w-full rounded-md bg-white border transition px-3 py-2 flex justify-between items-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60',
    dropdown:
      'absolute mt-1 w-full bg-white border rounded-md shadow-lg z-50 p-2 max-h-60 overflow-auto',
    option:
      'flex items-center gap-2 px-2 py-1 hover:bg-gray-100 rounded cursor-pointer select-none',
  },
  variants: {
    intent: {
      primary: {},
      neutral: {},
      error: {},
    },
    size: {
      md: {},
      sm: {},
    },
  },
});

// Add color classes manually to match FormSelect
const intentClasses = {
  [SelectIntent.Primary]: 'border-gray-300 focus:ring-blue-400',
  [SelectIntent.Neutral]: 'border-gray-200 focus:ring-gray-300',
  [SelectIntent.Error]: 'border-red-500 focus:ring-red-400',
};

const sizeClasses = {
  [SelectSize.Md]: 'px-3 py-2 text-base',
  [SelectSize.Sm]: 'px-2 py-1 text-sm',
};

export const FormMultiSelect = ({
  name,
  label,
  options,
  selected,
  onChange,
  disabled = false,
  selectAll = true,
  selectAllLabel = 'Select All',
  placeholder = 'Select…',
  intent = SelectIntent.Primary,
  size = SelectSize.Md,
}: Props) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const [selectedValues, setSelectedValues] = useState<(string | number)[]>(selected);

  const toggleValue = (value: string | number) => {
    setSelectedValues((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };

  const { container, trigger, dropdown, option } = styles({ intent, size });

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const selectAllHandler = () => {
    if (selectedValues.length === options.length) {
      onChange?.([]);
      setSelectedValues([]);
    } else {
      onChange?.(options.map((o) => o.value));
      setSelectedValues(options.map((o) => o.value));
    }
  };

  const getSelectPlaceholder = () => {
    if (!selectAll) return placeholder;
    const isSelectAll = selectedValues.length === options.length;
    if (isSelectAll) return selectAllLabel;
    return selectedValues.map((s) => options.find((o) => o.value === s)?.label).join(', ');
  };

  return (
    <div className={container()}>
      {label && (
        <label htmlFor={`multi-select-${name}`} className='text-sm font-medium text-gray-700'>
          {label}
        </label>
      )}

      <div ref={ref} className='relative'>
        <button
          type='button'
          id={`multi-select-${name}`}
          disabled={disabled}
          onClick={() => setOpen(!open)}
          className={`${trigger()} ${intentClasses[intent]} ${sizeClasses[size]}`}
        >
          <span className='text-gray-700'>
            {selectedValues.length > 0 ? getSelectPlaceholder() : placeholder}
          </span>
          <span>⌄</span>
        </button>

        {open && (
          <div className={dropdown()}>
            {selectAll && (
              <>
                <div className={option()} onClick={() => selectAllHandler()}>
                  <input
                    type='checkbox'
                    checked={selectedValues.length === options.length}
                    onChange={() => selectAllHandler()}
                  />
                  <span>{selectAllLabel}</span>
                </div>
                <hr className='my-2' />
              </>
            )}
            {options.map((o) => (
              <div key={o.value} className={option()} onClick={() => toggleValue(o.value)}>
                <input
                  type='checkbox'
                  checked={selectedValues.includes(o.value)}
                />
                <span>{o.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
