import { InputHTMLAttributes, ReactNode } from 'react';
import { tv } from 'tailwind-variants';

export enum AccessoryPosition {
  Left = 'left',
  Right = 'right',
}

const input = tv({
  base: 'block w-full rounded-lg border bg-gray-50 p-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500',
  variants: {
    error: {
      true: 'border-red-500',
      false: 'border-gray-200',
    },
    accessoryPadding: {
      left: 'pl-12',
      right: 'pr-12',
      none: '',
    },
  },
  defaultVariants: {
    error: false,
    accessoryPadding: 'none',
  },
});

const container = tv({
  base: '',
});

const wrapper = tv({
  base: '',
  variants: {
    hasAccessory: {
      true: 'relative',
      false: '',
    },
  },
  defaultVariants: {
    hasAccessory: false,
  },
});

const accessoryWrapper = tv({
  base: 'absolute top-1/2 -translate-y-1/2',
  variants: {
    position: {
      left: 'left-3',
      right: 'right-3',
    },
  },
});

const errorText = tv({
  base: 'mt-1 text-sm text-red-500',
});

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> & {
  label?: string;
  error?: string;
  className?: string;
  accessory?: ReactNode;
  accessoryPosition?: AccessoryPosition;
  classNames?: {
    container?: string;
    input?: string;
    error?: string;
  };
  name: string;
};

export default function FormInput(props: Props) {
  const {
    label,
    error,
    className = '',
    classNames,
    accessory,
    accessoryPosition = AccessoryPosition.Right,
    name,
    ...rest
  } = props;

  const hasError = !!error;
  const hasAccessory = !!accessory;

  const inputClassName = classNames?.input
    ? classNames.input
    : input({
        error: hasError,
        accessoryPadding: hasAccessory ? accessoryPosition : 'none',
        className,
      });

  const containerClassName = classNames?.container || container();
  const wrapperClassName = wrapper({ hasAccessory });
  const accessoryClassName = accessoryWrapper({ position: accessoryPosition });
  const errorClassName = classNames?.error || errorText();

  return (
    <div className={containerClassName}>
      {label && (
        <label htmlFor={`input-${name}`} className='text-sm font-medium text-gray-700'>
          {label}
        </label>
      )}
      <div className={wrapperClassName}>
        <input name={name} id={`input-${name}`} {...rest} className={inputClassName} />
        {accessory && <div className={accessoryClassName}>{accessory}</div>}
      </div>
      {error && <p className={errorClassName}>{error}</p>}
    </div>
  );
}
