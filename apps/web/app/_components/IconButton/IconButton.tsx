'use client';

import React, { ReactNode, useCallback } from 'react';
import { tv } from 'tailwind-variants';

type UseOnClickParams = {
  disabled?: boolean;
  onClick?: React.MouseEventHandler;
};

const hooks = {
  useOnClick({ disabled, onClick }: UseOnClickParams) {
    return useCallback(
      (event: React.MouseEvent) => {
        if (onClick && !disabled) {
          onClick(event);
        }
      },
      [onClick, disabled],
    );
  },
};

const iconButton = tv({
  base: 'inline-flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer',
  variants: {
    size: {
      small: 'p-1 text-xs',
      medium: 'p-1 text-sm',
      large: 'p-2 text-base',
    },
    rounded: {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      full: 'rounded-full',
    },
    variant: {
      default: 'text-slate-500 hover:text-slate-700',
      primary: 'text-blue-600 hover:text-blue-700',
      secondary: 'text-gray-600 hover:text-gray-700',
    },
  },
  defaultVariants: {
    size: 'medium',
    rounded: 'md',
    variant: 'default',
  },
});

type Props = {
  icon: ReactNode | string;
  onClick?: React.MouseEventHandler;
  size?: 'small' | 'medium' | 'large';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  variant?: 'default' | 'primary' | 'secondary';
  className?: string;
  ariaLabel?: string;
  disabled?: boolean;
};

export const IconButton = (props: Props) => {
  const { icon, onClick, size, rounded, variant, className, ariaLabel, disabled } = props;

  const handleClick = hooks.useOnClick({ disabled, onClick });

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={iconButton({ size, rounded, variant, className })}
      aria-label={ariaLabel}
    >
      {typeof icon === 'string' ? <span>{icon}</span> : icon}
    </button>
  );
};
