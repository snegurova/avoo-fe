import React, { forwardRef, useCallback } from 'react';
import { tv } from 'tailwind-variants';
import { FieldValues, UseFormRegister } from 'react-hook-form';

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

type UseOnChangeParams = {
  disabled?: boolean;
  onChange?: (value: string) => void;
};

const hooks = {
  useOnChange(props: UseOnChangeParams) {
    const { disabled, onChange } = props;

    return useCallback(
      (event: React.ChangeEvent<HTMLSelectElement>) => {
        if (!disabled && onChange) {
          onChange(event.target.value);
        }
      },
      [onChange, disabled],
    );
  },
};

const selectStyles = tv({
  base: 'w-full rounded-md transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60',
  variants: {
    intent: {
      primary: 'border border-gray-300 bg-white focus:ring-blue-400 text-gray-900',
      neutral: 'border border-gray-200 bg-white focus:ring-gray-300 text-gray-900',
      error: 'border border-red-500 bg-white focus:ring-red-400 text-red-900',
    },
    size: {
      md: 'px-3 py-2 text-base',
      sm: 'px-2 py-1 text-sm',
    },
  },
  defaultVariants: { intent: 'primary', size: 'md' },
});

export type FormSelectProps<T extends FieldValues = FieldValues> = {
  id?: string;
  name: string;
  label?: string;
  options: Option[];
  value?: string | number;
  defaultValue?: string | number;
  placeholder?: string;
  disabled?: boolean;
  error?: string | boolean;
  intent?: SelectIntent;
  size?: SelectSize;
  onChange?: (value: string) => void;
  register?: UseFormRegister<T>;
};

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>((props, ref) => {
  const {
    id,
    name,
    label,
    options,
    value,
    defaultValue,
    placeholder,
    disabled = false,
    error,
    intent = SelectIntent.Primary,
    size = SelectSize.Md,
    register,
    onChange,
  } = props;

  const handleChange = hooks.useOnChange({ disabled, onChange });

  const registerProps = register ? register(name) : {};

  return (
    <div className='flex flex-col gap-1 w-full relative'>
      {label && (
        <label htmlFor={`select-${name}-${id}`} className='text-sm font-medium text-gray-700'>
          {label}
        </label>
      )}

      <select
        id={`select-${name}-${id}`}
        name={name}
        ref={ref}
        value={value}
        defaultValue={defaultValue}
        disabled={disabled}
        onChange={handleChange}
        className={selectStyles({ intent: error ? SelectIntent.Error : intent, size })}
        {...registerProps}
      >
        {placeholder && (
          <option value='' disabled={!!defaultValue}>
            {placeholder}
          </option>
        )}

        {options.map((o) => (
          <option key={String(o.value)} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      {error && typeof error === 'string' && <p className='text-sm text-red-600'>{error}</p>}
    </div>
  );
});
