import Link from 'next/link';

import { Button, Typography } from '@mui/material';

import SearchTextInput from '@/_components/SearchTextInput/SearchTextInput';
import { localizationHooks } from '@/_hooks/localizationHooks';
import { AppRoutes } from '@/_routes/routes';

type Props = {
  setSearchQuery: (value: string) => void;
};

export default function ComboServiceControls(props: Props) {
  const { setSearchQuery } = props;

  return (
    <div className='pb-8 flex flex-wrap items-center gap-y-4'>
      <div className='flex flex-col md:flex-col lg:flex-row w-full gap-4 lg:items-center'>
        <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 lg:contents'>
          <Typography component='h1' variant='h1' className='order-1'>
            Combo service time
          </Typography>
          <div className='order-2 lg:order-3 w-full md:w-auto'>
            <Link href={localizationHooks.useWithLocale(AppRoutes.ComboServiceTimeCreate)}>
              <Button fullWidth color='primary' variant='outlined'>
                New combo
              </Button>
            </Link>
          </div>
        </div>
        <div className='order-3 md:order-2 w-full lg:ml-auto lg:w-auto'>
          <SearchTextInput
            fullWidth
            placeholder='Search by combo name'
            setSearchQuery={setSearchQuery}
            style={{
              width: {
                md: '100%',
                lg: '306px',
              },
              marginRight: {
                md: '0',
                lg: '48px',
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
