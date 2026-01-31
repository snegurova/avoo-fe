'use client';
import React, { useMemo } from 'react';
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
  base: 'flex items-center gap-3.5 px-8 py-3 hover:bg-primary-100 focus:bg-primary-100 transition-colors',
  variants: {
    active: {
      true: 'bg-primary-50',
    },
  },
});

export default function DashboardNavigationItem(props: Props) {
  const { href, icon, label, onClick } = props;
  const isActive = routerHooks.useIsActivePage(href);

  const onClickHandler = useMemo(
    () => (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.currentTarget.blur();
      onClick?.();
    },
    [],
  );

  return (
    <Link href={href} className={navigationItem({ active: isActive })} onClick={onClickHandler}>
      {icon}
      <span>{label}</span>
    </Link>
  );
}
