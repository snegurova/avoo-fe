import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Button, Typography } from '@mui/material';

import { colors } from '@avoo/design-tokens';
import { SortScheduleField } from '@avoo/hooks';
import { SortDirection } from '@avoo/shared';
import { useApiStatusStore } from '@avoo/store';

import SearchTextInput from '@/_components/SearchTextInput/SearchTextInput';
import SortIconButton from '@/_components/SortIconButton/SortIconButton';
import SortOptions from '@/_components/SortOptions/SortOptions';
import { localizationHooks } from '@/_hooks/localizationHooks';
import { AppRoutes } from '@/_routes/routes';

type Props = {
  setSearchQuery: (value: string) => void;
  onSortClick: (field: SortScheduleField) => void;
  activeSortDirection: SortDirection;
  activeSortField: SortScheduleField;
};

export default function SchedulesControls(props: Props) {
  const { setSearchQuery, onSortClick, activeSortDirection, activeSortField } = props;
  const t = useTranslations('private.components.SchedulesControls.SchedulesControls');
  const options: { label: string; value: SortScheduleField }[] = [
    { label: t('sortByName'), value: 'name' },
    { label: t('sortByStartDate'), value: 'startAt' },
    { label: t('sortByEndDate'), value: 'endAt' },
  ];

  const isPending = useApiStatusStore((state) => state.isPending);

  return (
    <>
      <div className='pb-8 flex flex-wrap items-center gap-y-4'>
        <div className='flex flex-col md:flex-col lg:flex-row w-full gap-4 lg:items-center'>
          <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 lg:contents'>
            <Typography component='h1' variant='h1' className='order-1'>
              {t('workingSchedules')}
            </Typography>
            <div className='order-2 lg:order-3 w-full md:w-auto'>
              <Link href={localizationHooks.useWithLocale(AppRoutes.WorkingHoursCreate)}>
                <Button fullWidth color='primary' variant='outlined'>
                  {t('setupNewSchedule')}
                </Button>
              </Link>
            </div>
          </div>
          <div className='order-3 lg:order-2 w-full lg:w-auto lg:ml-auto flex items-center gap-2 md:bg-primary-50 md:p-2 lg:bg-transparent lg:p-0'>
            <SearchTextInput
              placeholder={t('searchScheduleNameMaster')}
              setSearchQuery={setSearchQuery}
              style={{
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
            />
            <div className='relative lg:hidden ml-auto'>
              <SortOptions options={options} onSelect={onSortClick} />
            </div>
          </div>
        </div>
      </div>
      <div className='hidden lg:grid grid-cols-[2fr_1.2fr_1.2fr_1.2fr_72px] gap-3 p-6 mb-8 text-sm text-black font-semibold bg-primary-50'>
        <div onClick={() => onSortClick('name')} className='cursor-pointer flex items-center gap-1'>
          <span>Schedule name</span>
          <SortIconButton
            reverse={activeSortField === 'name' && activeSortDirection === 'asc'}
            isPending={isPending}
          />
        </div>
        <div className='flex items-center'>Applies to</div>
        <div
          onClick={() => onSortClick('startAt')}
          className='cursor-pointer flex items-center gap-1'
        >
          <span>Start date</span>
          <SortIconButton
            reverse={activeSortField === 'startAt' && activeSortDirection === 'asc'}
            isPending={isPending}
          />
        </div>
        <div
          onClick={() => onSortClick('endAt')}
          className='cursor-pointer flex items-center gap-1'
        >
          <span>End date</span>
          <SortIconButton
            reverse={activeSortField === 'endAt' && activeSortDirection === 'asc'}
            isPending={isPending}
          />
        </div>
        <div className='flex items-center'>Actions</div>
      </div>
    </>
  );
}
