'use client';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Typography } from '@mui/material';

import { messages } from '@avoo/intl/messages/private/orders/create';

import AppWrapper from '@/_components/AppWrapper/AppWrapper';
import OrderCreate from '@/_components/OrderCreate/OrderCreate';

export default function CreateOrderPage() {
  return (
    <AppWrapper>
      <div className='p-4 flex justify-between items-center'>
        <Typography component='h1' variant='h1'>
          <FormattedMessage {...messages.title} />
        </Typography>
      </div>
      <OrderCreate />
    </AppWrapper>
  );
}
