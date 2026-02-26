import Link from 'next/link';
import { Button, InputAdornment, TextField, Typography } from '@mui/material';
import { useApiStatusStore } from '@avoo/store';
import { colors } from '@avoo/design-tokens';
import SearchIcon from '@/_icons/SearchIcon';
import { appRoutes } from '@/_routes/routes';
import SortOptions from '@/_components/SortOptions/SortOptions';

type Props = {
  setSearchQuery: (value: string) => void;
};

export default function SchedulesControls(props: Props) {
  const { setSearchQuery } = props;
  const isPending = useApiStatusStore((state) => state.isPending);
  const options = [
    { label: 'Sort by name', value: 'name' },
    { label: 'Sort by start date', value: 'startAt' },
    { label: 'Sort by end date', value: 'endAt' },
  ];
  return (
    <div className='pb-8 flex flex-wrap items-center gap-y-4'>
      <div className='flex flex-col md:flex-col lg:flex-row w-full gap-4 lg:items-center'>
        <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 lg:contents'>
          <Typography component='h1' variant='h1' className='order-1'>
            Working schedules
          </Typography>
          <div className='order-2 lg:order-3 w-full md:w-auto'>
            <Link href={appRoutes.WorkingHoursCreate}>
              <Button
                fullWidth
                color='primary'
                variant='outlined'
                loading={isPending}
                disabled={isPending}
              >
                Setup new schedule
              </Button>
            </Link>
          </div>
        </div>
        <div className='order-3 lg:order-2 w-full lg:w-auto lg:ml-auto flex items-center gap-2 md:bg-primary-50 md:p-2 lg:bg-transparent lg:p-0'>
          <TextField
            size='small'
            placeholder='Search by schedule name or master'
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              minWidth: {
                xs: '160px',
                md: '306px',
                lg: '100%',
                xl: '306px',
              },
              width: '100%',
              maxWidth: {
                xs: '300px',
                lg: '306px',
              },
              '& .MuiOutlinedInput-root': {
                backgroundColor: colors.white,
                borderRadius: '24px',
                paddingLeft: 0,
                height: {
                  xs: '36px',
                  lg: '44px',
                },
                minHeight: {
                  xs: '34px',
                  lg: '44px',
                },
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
                        fill: colors.gray[500],
                      }}
                    />
                  </InputAdornment>
                ),
              },
            }}
          />
          <div className='relative lg:hidden ml-auto'>
            <SortOptions options={options} onSelect={() => {}} />
          </div>
        </div>
      </div>
    </div>
  );
}
