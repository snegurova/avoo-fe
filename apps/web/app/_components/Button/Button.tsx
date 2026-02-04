import React, { JSX } from 'react';

import { useCallback } from 'react';
import { tv } from 'tailwind-variants';

export enum ButtonIntent {
  Primary = 'primary',
  Secondary = 'secondary',
}

export enum ButtonFit {
  Fill = 'fill',
  Inline = 'inline',
}

export enum ButtonType {
  Button = 'button',
  Submit = 'submit',
  Reset = 'reset',
}

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
  base: 'inline-flex items-center justify-center min-w-40  font-medium hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer disabled:cursor-not-allowed rounded-lg py-3.5 px-6 leading-none transition-colors',
  variants: {
    intent: {
      primary:
        'bg-black text-white hover:bg-primary-500  focus:bg-primary-500 disabled:bg-gray-500',
      secondary:
        'bg-white text-black border-black border hover:border-primary-500 focus:border-primary-500 hover:text-primary-500 focus:text-primary-500 disabled:text-gray-500 disabled:text-gray-500',
      cancel: 'bg-transparent text-black border border-black hover:bg-gray-100',
      submit: 'bg-black text-white hover:bg-gray-800',
    },
    fit: {
      fill: 'w-full',
      inline: 'w-fit',
    },
  },
  defaultVariants: { intent: 'primary', size: 'md' },
});

export type Props = {
  children: JSX.Element | string;
  fit?: ButtonFit;
  intent?: ButtonIntent;
  disabled?: boolean;
  loading?: boolean;
  onClick?: React.MouseEventHandler;
  type?: ButtonType;
  className?: string;
};

export const Button = (props: Props) => {
  const {
    children,
    fit = ButtonFit.Inline,
    intent = ButtonIntent.Primary,
    disabled = false,
    loading = false,
    onClick,
    type = ButtonType.Button,
    className,
  } = props;

  const handleClick = hooks.useOnClick({ disabled, loading, onClick });

  return (
    <button
      type={type}
      className={button({ intent, fit, className })}
      disabled={disabled}
      onClick={handleClick}
    >
      {loading ? 'loading...' : children}
    </button>
  );
};
