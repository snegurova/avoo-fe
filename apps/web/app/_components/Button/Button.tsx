import React, { JSX } from 'react';

import { useCallback } from 'react';
import { tv } from 'tailwind-variants';

export enum ButtonIntent {
  Primary = 'primary',
  Secondary = 'secondary',
  Cancel = 'cancel',
  Submit = 'submit',
}

export enum ButtonFit {
  Fill = 'fill',
  Inline = 'inline',
}

export type ButtonSize = 'sm' | 'md' | 'lg';

type UseOnClickParams = {
  disabled?: boolean;
  loading?: boolean;
  onClick?: React.MouseEventHandler;
};

const hooks = {
  useOnClick(props: UseOnClickParams) {
    const { disabled, loading, onClick } = props;

    return useCallback(
      (event: React.MouseEvent) => {
        if (onClick && !disabled && !loading) {
          onClick(event);
        }
      },
      [onClick, disabled, loading],
    );
  },
};

const button = tv({
  base: 'inline-flex items-center justify-center rounded-md font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer disabled:cursor-not-allowed',
  variants: {
    intent: {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 disabled:bg-gray-100',
      cancel: 'bg-transparent text-black border border-black hover:bg-gray-50',
      submit: 'bg-black text-white hover:bg-gray-900',
    },
    fit: {
      fill: 'w-full',
      inline: 'w-fit',
    },
    size: {
      sm: 'px-3 py-1 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    },
  },
  defaultVariants: { intent: 'primary', size: 'md' },
});

export type Props = {
  children: JSX.Element | string;
  fit?: ButtonFit;
  intent?: ButtonIntent;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  onClick?: React.MouseEventHandler;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
};

export const Button = (props: Props) => {
  const {
    children,
    fit = ButtonFit.Inline,
    intent = ButtonIntent.Primary,
    size = 'md',
    disabled = false,
    loading = false,
    onClick,
    type = 'button',
    className,
  } = props;

  const handleClick = hooks.useOnClick({ disabled, loading, onClick });

  return (
    <button
      type={type}
      className={`${button({ intent, fit, size })} ${className ?? ''}`}
      disabled={disabled}
      onClick={handleClick}
    >
      {loading ? 'loading...' : children}
    </button>
  );
};
