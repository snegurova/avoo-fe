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

const navigationItem = tv({
  base: 'flex items-center gap-3.5 px-8 py-3 hover:bg-primary focus:bg-primary transition-colors',
  variants: {
    active: {
      true: 'bg-secondary',
    },
  },
});

export default function DashboardNavigationItem(props: Props) {
  const { href, icon, label } = props;
  const isActive = navigationHooks.useIsActivePage(href);

  return (
    <Link
      href={href}
      className={navigationItem({ active: isActive })}
      onClick={(e) => e.currentTarget.blur()}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
