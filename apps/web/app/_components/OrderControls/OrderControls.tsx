'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';

import { IconButton, MenuItem, Select, Typography } from '@mui/material';

import { PrivateOrderQueryParams } from '@avoo/axios/types/apiTypes';
import { OrderStatus } from '@avoo/hooks/types/orderStatus';

import DateRangePicker from '@/_components/DateRangePicker/DateRangePicker';
import { SingleMasterSelect } from '@/_components/SingleMasterSelect/SingleMasterSelect';
import ResetSettingsIcon from '@/_icons/ResetSettingsIcon';

type Props = {
  setOrderStatus: (status?: OrderStatus) => void;
  setMasterId: (masterId?: number) => void;
  setDateFrom: (dateFrom?: string) => void;
  setDateTo: (dateTo?: string) => void;
  onResetFilters: () => void;
  params: PrivateOrderQueryParams;
};

export default function OrderControls(props: Props) {
  const { setOrderStatus, setMasterId, setDateFrom, setDateTo, onResetFilters, params } = props;
  const t = useTranslations('private.components.OrderControls.OrderControls');
  const tOrder = useTranslations('private.orders.order');

  const STATUSES_ITEMS = useMemo(
    () => [
      { label: tOrder('pending'), value: OrderStatus.PENDING },
      { label: tOrder('confirmed'), value: OrderStatus.CONFIRMED },
      { label: tOrder('completed'), value: OrderStatus.COMPLETED },
      { label: tOrder('cancelled'), value: OrderStatus.CANCELED },
      { label: tOrder('expired'), value: OrderStatus.EXPIRED },
    ],
    [tOrder],
  );

  return (
    <div className='mb-4'>
      <div className='gap-y-2 px-5 pt-4 md:px-11 pb-4'>
        <div className='flex flex-row gap-2 w-full items-center justify-between'>
          <Typography component='h1' variant='h1'>
            {t('orders')}
          </Typography>
        </div>
      </div>
      <div className='flex flex-col-reverse md:flex-row gap-3 bg-primary-50 px-5 py-2 md:px-11 md:justify-between'>
        <DateRangePicker
          dateFrom={params.dateFrom}
          dateTo={params.dateTo}
          setDateFrom={setDateFrom}
          setDateTo={setDateTo}
          className='md:border md:border-gray-300 md:rounded-lg md:px-4 w-full md:w-auto'
        />
        <div className='flex flex-col md:flex-row md:flex-row-reverse gap-2'>
          <div className='flex gap-2 w-full min-w-[200px] md:min-w-[300px]'>
            <SingleMasterSelect
              selectedId={params.masterId}
              setSelectedId={setMasterId}
              fullWidth
            />
            <IconButton onClick={onResetFilters}>
              <ResetSettingsIcon />
            </IconButton>
          </div>
          <div className='flex gap-2 w-full md:max-w-[300px]'>
            <Select
              fullWidth
              value={params.status ?? ''}
              onChange={(event) => {
                const value = event.target.value as string;
                setOrderStatus(value === '' ? undefined : (value as OrderStatus));
              }}
              displayEmpty
              renderValue={(selected) => {
                if (!selected) return <span>{t('allStatuses')}</span>;

                const found = STATUSES_ITEMS.find((i) => i.value === selected);
                return found?.label ?? selected;
              }}
            >
              <MenuItem value=''>
                <span>{t('allStatuses')}</span>
              </MenuItem>

              {STATUSES_ITEMS.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
