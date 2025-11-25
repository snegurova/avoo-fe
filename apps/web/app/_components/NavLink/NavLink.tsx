import type { Route } from 'next';
import React, { JSX } from 'react';
import { tv } from 'tailwind-variants';
import Link from 'next/link';

export enum LinkIntent {
  Primary = 'primary',
  Secondary = 'secondary',
}

export enum LinkFit {
  Fill = 'fill',
  Inline = 'inline',
  Outlined = 'outlined',
}

const link = tv({
  base: 'text-sm hover:underline',
  variants: {
    intent: {
      primary: 'text-blue-600',
      secondary: 'text-gray-600',
    },
    fit: {
      fill: 'w-full px-2 py-1 rounded text-white hover:no-underline',
      inline: 'w-fit',
      outlined: 'w-fit px-2 py-1 border rounded hover:text-white hover:no-underline',
    },
    disabled: {
      true: 'cursor-not-allowed opacity-50',
    },
    loading: {
      true: 'cursor-not-allowed opacity-50',
    },
  },
  compoundVariants: [
    {
      intent: 'primary',
      fit: 'fill',
      class: 'bg-blue-600 hover:bg-blue-800',
    },
    {
      intent: 'secondary',
      fit: 'fill',
      class: 'bg-gray-600 hover:bg-gray-700',
    },
    {
      intent: 'primary',
      fit: 'outlined',
      class: 'border-blue-600 hover:bg-blue-600',
    },
    {
      intent: 'secondary',
      fit: 'outlined',
      class: 'border-gray-600 hover:bg-gray-600',
    },
  ],
  defaultVariants: {
    intent: 'primary',
    fit: 'inline',
  },
});

export type Props = {
  children: JSX.Element | string;
  to: Route;
  intent: LinkIntent;
  fit: LinkFit;
  disabled?: boolean;
  loading?: boolean;
};

export const NavLink = (props: Props) => {
  const { children, to, intent, fit, disabled, loading } = props;
  const href = disabled || loading ? '#' : to;
  return (
    <Link href={href} className={link({ intent, fit, disabled, loading })}>
      {loading ? 'loading...' : children}
    </Link>
  );
};
