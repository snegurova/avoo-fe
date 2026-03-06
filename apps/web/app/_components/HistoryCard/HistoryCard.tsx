import React from 'react';
import Avatar, { AvatarSize } from '../Avatar/Avatar';
import { colors } from '@avoo/design-tokens';

type Props = {
  dateDay: string;
  dateMonth: string;
  time: string;
  title: string;
  duration: string;
  master: string;
  price: string;
  note?: string;
};

export default function HistoryCard({
  dateDay,
  dateMonth,
  time,
  title,
  duration,
  master,
  price,
  note,
}: Readonly<Props>) {
  return (
    <article className='flex items-start gap-6 bg-white border border-gray-200 rounded-lg py-3 px-4 shadow-sm max-h-[112px] md:max-h-[136px]'>
      <div className='flex flex-col items-center justify-center w-14'>
        <span className='text-sm font-semibold' aria-hidden>
          {dateDay}
        </span>
        <span className='text-sm font-semibold' aria-hidden>
          {dateMonth}
        </span>
        <time className='text-xs text-gray-500 mt-3' dateTime={time}>
          {time}
        </time>
      </div>

      <div className='flex-1'>
        <div className='flex items-start justify-between'>
          <div className='min-w-0'>
            <h4 className='text-sm font-semibold truncate' title={title}>
              {title}
            </h4>
            <div className='flex min-w-0 items-center gap-2 mt-1 text-xs text-gray-500 whitespace-nowrap'>
              <span className='whitespace-nowrap leading-4'>{duration}</span>
              <span aria-hidden className='text-black font-semibold leading-none'>
                |
              </span>
              <div className='flex min-w-0 flex-1 items-center gap-1 overflow-hidden'>
                <Avatar name={master} size={AvatarSize.Small} bgColor={colors.primary[200]} />
                <span className='text-xs truncate leading-4' title={master}>
                  {master}
                </span>
              </div>
              <span aria-hidden className='text-black font-semibold leading-none'>
                |
              </span>
              <span className='font-medium text-sm text-black whitespace-nowrap leading-4'>
                {price}
              </span>
            </div>
          </div>
        </div>

        {note ? (
          <p className='text-xs text-gray-500 mt-3 line-clamp-3 leading-[1.2]'>{note}</p>
        ) : null}
      </div>
    </article>
  );
}
