'use client';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import AppWrapper from '@/_components/AppWrapper/AppWrapper';
import { Typography } from '@mui/material';
import Calendar from '@/_components/Calendar/Calendar';

export default function DashboardPage() {
  return (
    <div className='flex flex-col lg:grid lg:grid-cols-3 gap-8 w-full h-full'>
      <AppWrapper className='lg:col-span-2 order-2 lg:order-1'>
        <div className='p-4 flex justify-between items-center'>
          <Typography component='h1' variant='h1'>
            Calendar
          </Typography>
        </div>
        <Calendar isWidget />
      </AppWrapper>
      <div className='flex flex-col md:flex-row lg:flex-col gap-8 order-1 lg:order-2'>
        <div className='md:flex-1 lg:flex-none'>
          <AppWrapper isWidget>
            <div className='p-4 flex justify-between items-center'>
              <Typography component='h1' variant='h1'>
                New notifications
              </Typography>
            </div>
          </AppWrapper>
        </div>
        <div className='md:flex-1 lg:flex-none'>
          <AppWrapper isWidget>
            <div className='p-4 flex justify-between items-center'>
              <Typography component='h1' variant='h1'>
                Next appointments
              </Typography>
            </div>
          </AppWrapper>
        </div>
      </div>
    </div>
  );
}
