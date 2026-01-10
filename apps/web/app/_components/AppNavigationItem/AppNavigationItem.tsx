'use client';
import React from 'react';
import Link from 'next/link';
import { routerHooks } from '@/_hooks/routerHooks';
import { tv } from 'tailwind-variants';

type Props = {
  href: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
};

const navigationItem = tv({
  base: 'flex items-center gap-3.5 px-8 py-3 hover:bg-primary-500 focus:bg-primary-500 transition-colors',
  variants: {
    active: {
      true: 'bg-primary-100',
    },
  },
});

export default function DashboardNavigationItem(props: Props) {
  const { href, icon, label, onClick } = props;
  const isActive = routerHooks.useIsActivePage(href);

  return (
    <Link
      href={href}
      className={navigationItem({ active: isActive })}
      onClick={(e) => {
        e.currentTarget.blur();
        onClick?.();
      }}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
