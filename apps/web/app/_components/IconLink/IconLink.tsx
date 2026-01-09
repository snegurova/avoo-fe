'use client';

import React from 'react';
import Link from 'next/link';
import { routerHooks } from '@/_hooks/routerHooks';
import { tv } from 'tailwind-variants';

type Props = {
  href: string;
  icon: React.ReactNode;
  label: string;
};

const iconLink = tv({
  base: 'rounded-full w-10 h-10 flex items-center justify-center hover:text-primary-700 focus:text-primary-700 transition-colors',
  variants: {
    active: {
      true: 'text-primary-700',
      false: '',
    },
  },
});

export default function IconLink(props: Props) {
  const { href, icon, label } = props;
  const isActive = routerHooks.useIsActivePage(href);
  return (
    <Link
      href={href}
      className={iconLink({ active: isActive })}
      onClick={(e) => e.currentTarget.blur()}
      aria-label={label}
    >
      {icon}
    </Link>
  );
}
