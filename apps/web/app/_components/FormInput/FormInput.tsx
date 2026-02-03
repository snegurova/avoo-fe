import { InputHTMLAttributes, ReactNode } from 'react';
import { tv } from 'tailwind-variants';

export enum AccessoryPosition {
  Left = 'left',
  Right = 'right',
}

const input = tv({
  base: 'p-3 w-full h-[44px] rounded-[8px] border border-gray-200 bg-transparent focus:outline-none focus:ring-1 focus:ring-purple-800 text-gray-900 text-sm leading-none',
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
  error?: string;
  className?: string;
  accessory?: ReactNode;
  accessoryPosition?: AccessoryPosition;
  classNames?: {
    container?: string;
    input?: string;
    error?: string;
  };
};

export default function FormInput(props: Props) {
  const {
    error,
    className = '',
    classNames,
    accessory,
    accessoryPosition = AccessoryPosition.Right,
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
      <div className={wrapperClassName}>
        <input {...rest} className={inputClassName} />
        {accessory && <div className={accessoryClassName}>{accessory}</div>}
      </div>
      {error && <p className={errorClassName}>{error}</p>}
    </div>
  );
}
