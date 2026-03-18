'use client';

import { useTranslations } from 'next-intl';

import { Typography } from '@mui/material';

import AppWrapper from '@/_components/AppWrapper/AppWrapper';
import ComboServiceAddForm from '@/_components/ComboServiceAddFrom/ComboServiceAddFrom';

export default function WorkingHoursCreatePage() {
  const t = useTranslations('private.calendar.comboServiceTime.create');
  return (
    <AppWrapper withPadding>
      <Typography variant='h1'>{t('setupNewCombo')}</Typography>
      <ComboServiceAddForm />
    </AppWrapper>
  );
}
