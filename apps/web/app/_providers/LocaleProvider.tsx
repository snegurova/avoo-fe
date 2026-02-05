'use client';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { DEFAULT_LOCALE, Locale, MESSAGES } from '@avoo/intl';

type Props = {
  children: React.ReactNode;
  locale: Locale;
};

export const LocaleProvider = (props: Props) => {
  const { children, locale } = props;

  const messages = MESSAGES[locale] ?? MESSAGES[DEFAULT_LOCALE];

  return (
    <IntlProvider
      locale={locale || DEFAULT_LOCALE}
      defaultLocale={DEFAULT_LOCALE}
      messages={messages}
    >
      {children}
    </IntlProvider>
  );
};
