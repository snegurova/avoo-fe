'use client';

import type { ComponentProps } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { DEFAULT_LOCALE, Locale, SUPPORTED_LOCALES } from '@avoo/intl';

type Props = ComponentProps<typeof Link>;

export const LocalizedLink = (props: Props) => {
  const { href, ...rest } = props;
  const params = useParams();
  const rawLocale = params?.locale;

  const locale: Locale = SUPPORTED_LOCALES.includes(rawLocale as Locale)
    ? (rawLocale as Locale)
    : DEFAULT_LOCALE;

  const localizedHref =
    typeof href === 'string'
      ? `/${locale}${href.startsWith('/') ? href : `/${href}`}`
      : {
          ...href,
          pathname: `/${locale}${href.pathname}`,
        };

  return <Link href={localizedHref} {...rest} />;
};
