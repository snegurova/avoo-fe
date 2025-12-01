'use client';

import React from 'react';
import Link from 'next/link';
import { navigationHooks } from '@/_hooks/navigationHooks';
import { tv } from 'tailwind-variants';

type Props = {
  href: string;
  icon: React.ReactNode;
  label: string;
};

const iconLink = tv({
  base: 'rounded-full w-10 h-10 flex items-center justify-center hover:text-dark focus:text-dark transition-colors',
  variants: {
    active: {
      true: 'text-dark',
    },
  },
});

export default function IconLink(props: Props) {
  const { href, icon, label } = props;
  const isActive = navigationHooks.useIsActivePage(href);
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
