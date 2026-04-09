'use client';

import { useTranslations } from 'next-intl';

import { Typography } from '@mui/material';

import AppWrapper from '@/_components/AppWrapper/AppWrapper';
import { ScheduleAddForm } from '@/_components/ScheduleAddForm/ScheduleAddForm';

export default function WorkingHoursCreatePage() {
  const t = useTranslations('private.calendar.workingHours.create');
  return (
    <AppWrapper withPadding>
      <Typography variant='formTitle'>{t('setupNewSchedule')}</Typography>
      <ScheduleAddForm />
    </AppWrapper>
  );
}
