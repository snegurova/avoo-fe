'use client';

import React from 'react';
import Link from 'next/link';
import { navigationHooks } from '@/_hooks/navigationHooks';

type Props = {
  href: string;
  icon: React.ReactNode;
  label: string;
};

export default function IconLink(props: Props) {
  const { href, icon, label } = props;
  const isActive = navigationHooks.useIsActivePage(href);
  return (
    <Link
      href={href}
      className={`rounded-full w-10 h-10 flex items-center justify-center hover:text-dark focus:text-dark transition-colors ${isActive ? 'text-dark' : ''}`}
      onClick={(e) => e.currentTarget.blur()}
      aria-label={label}
    >
      {icon}
    </Link>
  );
}
