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

type UseOnClickParams = {
  disabled?: boolean;
  loading?: boolean;
  onClick?: React.MouseEventHandler;
};

const hooks = {
  useOnClick({ disabled, loading, onClick }: UseOnClickParams) {
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
  base: 'inline-flex items-center justify-center rounded-md font-medium transition px-4 py-2 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed',
  variants: {
    intent: {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 disabled:bg-gray-100',
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
  fit: ButtonFit;
  intent: ButtonIntent;
  disabled?: boolean;
  loading?: boolean;
  onClick?: React.MouseEventHandler;
};

export const Button = (props: Props) => {
  const { children, fit, intent, disabled = false, loading = false, onClick } = props;

  const handleClick = hooks.useOnClick({ disabled, loading, onClick });

  return (
    <button className={button({ intent, fit })} disabled={disabled} onClick={handleClick}>
      {loading ? 'loading...' : children}
    </button>
  );
};
