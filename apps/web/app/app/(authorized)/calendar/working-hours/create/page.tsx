'use client';

import AppWrapper from '@/_components/AppWrapper/AppWrapper';
import { ScheduleAddForm } from '@/_components/ScheduleAddForm/ScheduleAddForm';
import { Typography } from '@mui/material';

export default function WorkingHoursCreatePage() {
  return (
    <AppWrapper withPadding>
      <Typography variant='h1'>Setup new schedule</Typography>
      <ScheduleAddForm />
    </AppWrapper>
  );
}
