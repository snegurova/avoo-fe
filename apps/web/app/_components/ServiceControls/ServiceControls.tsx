import Link from 'next/link';

import { Button, Typography } from '@mui/material';

import SearchTextInput from '@/_components/SearchTextInput/SearchTextInput';
import { localizationHooks } from '@/_hooks/localizationHooks';
import { AppRoutes } from '@/_routes/routes';

type Props = {
  setSearchQuery: (value: string) => void;
};

export default function ServiceControls(props: Props) {
  const { setSearchQuery } = props;

  return (
    <div className='pb-4 flex flex-wrap items-center gap-y-3'>
      <div className='flex flex-wrap md:flex-nowrap w-full items-center gap-y-2'>
        <Typography component='h1' variant='h1' className='order-1'>
          Services
        </Typography>

        <div className='order-2 md:order-3 ml-auto md:ml-0'>
          <Link href={localizationHooks.useWithLocale(AppRoutes.CreateService)}>
            <Button fullWidth color='primary' variant='outlined'>
              Add service
            </Button>
          </Link>
        </div>

        <div className='order-3 md:order-2 w-full md:ml-auto md:w-auto'>
          <SearchTextInput
            fullWidth
            placeholder='Search by service name'
            setSearchQuery={setSearchQuery}
          />
        </div>
      </div>
    </div>
  );
}
