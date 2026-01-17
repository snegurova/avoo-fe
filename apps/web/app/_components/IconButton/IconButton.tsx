'use client';

import React, { ReactNode, useCallback } from 'react';
import { tv } from 'tailwind-variants';

export enum IconButtonSize {
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
}

export enum IconButtonRounded {
  None = 'none',
  Sm = 'sm',
  Md = 'md',
  Lg = 'lg',
  Full = 'full',
}

export enum IconButtonVariant {
  Default = 'default',
  Primary = 'primary',
  Secondary = 'secondary',
}

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
  base: 'inline-flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer',
  variants: {
    size: {
      [IconButtonSize.Small]: 'p-1 text-xs',
      [IconButtonSize.Medium]: 'p-1 text-sm',
      [IconButtonSize.Large]: 'p-2 text-base',
    },
    rounded: {
      [IconButtonRounded.None]: 'rounded-none',
      [IconButtonRounded.Sm]: 'rounded-sm',
      [IconButtonRounded.Md]: 'rounded-md',
      [IconButtonRounded.Lg]: 'rounded-lg',
      [IconButtonRounded.Full]: 'rounded-full',
    },
    variant: {
      [IconButtonVariant.Default]: 'text-slate-500 hover:text-slate-700',
      [IconButtonVariant.Primary]: 'text-blue-600 hover:text-blue-700',
      [IconButtonVariant.Secondary]: 'text-gray-600 hover:text-gray-700',
    },
  },
  defaultVariants: {
    size: IconButtonSize.Medium,
    rounded: IconButtonRounded.Md,
    variant: IconButtonVariant.Default,
  },
});

type Props = {
  icon: ReactNode | string;
  onClick?: React.MouseEventHandler;
  size?: IconButtonSize;
  rounded?: IconButtonRounded;
  variant?: IconButtonVariant;
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
