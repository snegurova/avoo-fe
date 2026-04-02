import React from 'react';
import { useTranslations } from 'next-intl';

import dayjs from 'dayjs';

import { LONG_DATE_FORMAT, TIME_FORMAT } from '@avoo/constants';

import { localizationHooks } from '@/_hooks/localizationHooks';
import CalendarIcon from '@/_icons/CalendarIcon';
import ScheduleIcon from '@/_icons/ScheduleIcon';

type Props = {
  date: string;
  duration: number;
  onClick: () => void;
};

export default function PublicDateCard(props: Props) {
  const { date, duration, onClick } = props;
  const t = useTranslations('public.salon.createOrder');
  const locale = localizationHooks.useGetLocale();

  return (
    <div className='p-6 border rounded-lg border-gray-200 text-gray-600 flex justify-between flex-col md:flex-row md:items-center'>
      <div className='flex flex-col gap-2 '>
        <div className='flex items-center gap-1'>
          <CalendarIcon className='fill-current' />
          <span className='text-black'>{dayjs(date).locale(locale).format(LONG_DATE_FORMAT)}</span>
        </div>
        <div className='flex items-center gap-1'>
          <ScheduleIcon className='fill-current' />
          <span className='text-black'>
            {dayjs(date).locale(locale).format(TIME_FORMAT)} -{' '}
            {dayjs(date).add(duration, 'minute').locale(locale).format(TIME_FORMAT)}
          </span>
        </div>
      </div>
      <button
        type='button'
        onClick={onClick}
        className='cursor-pointer transition-colors text-gray-600 font-medium text-sm leading-base hover:text-black focus:text-black underline self-end md:self-auto'
      >
        {t('change')}
      </button>
    </div>
  );
}
