'use client';

import { Typography } from '@mui/material';

import AppWrapper from '@/_components/AppWrapper/AppWrapper';
import ComboServiceAddForm from '@/_components/ComboServiceAddFrom/ComboServiceAddFrom';

export default function WorkingHoursCreatePage() {
  return (
    <AppWrapper withPadding>
      <Typography variant='h1'>Setup new combo service time</Typography>
      <ComboServiceAddForm />
    </AppWrapper>
  );
}
