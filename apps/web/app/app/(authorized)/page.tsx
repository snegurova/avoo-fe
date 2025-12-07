'use client';
import { Chip } from '@mui/material';

export default function DashboardPage() {
  return (
    <>
      <div className=''>DashboardPage</div>
      <Chip label='Pending' color='pending' size='small' />
      <Chip label='Out of Schedule' color='outOfSchedule' size='small' />
    </>
  );
}
