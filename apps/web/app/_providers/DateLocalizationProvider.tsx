'use client';
import React from 'react';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import updateLocale from 'dayjs/plugin/updateLocale';

import { localizationHooks } from '@/_hooks/localizationHooks';

import 'dayjs/locale/en';
import 'dayjs/locale/pl';
import 'dayjs/locale/uk';

type Props = {
  readonly children: React.ReactNode;
};

dayjs.extend(updateLocale);

export default function DateLocalizationProvider({ children }: Props) {
  const locale = localizationHooks.useGetLocale();
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locale}>
      {children}
    </LocalizationProvider>
  );
}
