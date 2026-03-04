'use client';

import { ReactNode } from 'react';
import Link from 'next/link';

import { localizationHooks } from '@/_hooks/localizationHooks';
import { AppRoutes } from '@/_routes/routes';

type Props = {
  children: ReactNode;
  href: AppRoutes;
  className?: string;
};

export const LocalizedLink = (props: Props) => {
  const { href, children, ...rest } = props;
  const hrefWithLocale = localizationHooks.useWithLocale(href);

  return (
    <Link href={hrefWithLocale} {...rest}>
      {children}
    </Link>
  );
};
