import { Button, InputAdornment, TextField, Typography } from '@mui/material';
import SearchIcon from '@/_icons/SearchIcon';
import { useApiStatusStore } from '@avoo/store';
import { appRoutes } from '@/_routes/routes';
import Link from 'next/link';

type Props = {
  setSearchQuery: (value: string) => void;
};

export default function SchedulesControls(props: Props) {
  const { setSearchQuery } = props;
  const isPending = useApiStatusStore((state) => state.isPending);

  return (
    <div className='pb-8 flex flex-wrap items-center gap-y-3'>
      <div className='flex flex-wrap md:flex-nowrap w-full items-center gap-y-2'>
        <Typography component='h1' variant='h1' className='order-1'>
          Working schedules
        </Typography>

        <div className='order-2 md:order-3 ml-auto md:ml-0'>
          <Link href={appRoutes.WorkingHoursCreate}>
            <Button
              fullWidth
              color='secondary'
              variant='outlined'
              loading={isPending}
              disabled={isPending}
            >
              Setup new schedule
            </Button>
          </Link>
        </div>

        <div className='order-3 md:order-2 w-full md:w-auto md:ml-auto'>
          <TextField
            size='small'
            fullWidth
            placeholder='Search by schedule name or master'
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              width: {
                md: '306px',
                lg: '306px',
              },
              marginRight: {
                md: '32px',
                lg: '48px',
              },
              '& .MuiOutlinedInput-root': {
                borderRadius: '18px',
                paddingLeft: 0,
                height: '44px',
                minHeight: '44px',
              },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position='start'>
                    <SearchIcon
                      style={{
                        marginLeft: '12px',
                        marginRight: '10px',
                        fill: 'var(--color-gray-500)',
                      }}
                    />
                  </InputAdornment>
                ),
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
