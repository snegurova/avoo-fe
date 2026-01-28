'use client';
import React from 'react';
import AppWrapper from '@/_components/AppWrapper/AppWrapper';
import { Typography } from '@mui/material';
import OrderCreate from '@/_components/OrderCreate/OrderCreate';

export default function CreateOrderPage() {
  return (
    <AppWrapper>
      <div className='p-4 flex justify-between items-center'>
        <Typography component='h1' variant='h1'>
          New Booking
        </Typography>
      </div>
      <OrderCreate />
    </AppWrapper>
  );
}
