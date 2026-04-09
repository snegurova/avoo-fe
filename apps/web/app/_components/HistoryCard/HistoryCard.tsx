import React from 'react';

import { colors } from '@avoo/design-tokens';

import Avatar, { AvatarSize } from '../Avatar/Avatar';

type Props = {
  dateDay: string;
  dateMonth: string;
  time: string;
  title: string;
  duration: string;
  master: string;
  masterAvatarUrl?: string | null;
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
  masterAvatarUrl,
  price,
  note,
}: Readonly<Props>) {
  return (
    <article className='flex h-[125px] items-start gap-6 bg-white border border-gray-200 rounded-lg py-3 px-4 shadow-sm'>
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
            <div className='mt-1 flex min-w-0 items-center gap-1.5 text-xs text-gray-500'>
              <span className='whitespace-nowrap'>{duration}</span>
              <span aria-hidden className='text-black font-semibold leading-none'>
                |
              </span>
              <div className='flex min-w-0 flex-1 items-center gap-1 overflow-hidden'>
                <Avatar
                  name={master}
                  src={masterAvatarUrl}
                  size={AvatarSize.Small}
                  bgColor={colors.primary[200]}
                />
                <span
                  className='min-w-0 text-xs whitespace-normal break-words leading-[1.1]'
                  title={master}
                >
                  {master}
                </span>
              </div>
              <span aria-hidden className='text-black font-semibold'>
                |
              </span>
              <span className='font-medium text-sm text-black whitespace-nowrap leading-4'>
                {price}
              </span>
            </div>
          </div>
        </div>

        {note ? (
          <p className='text-xs text-gray-500 mt-2 line-clamp-3 leading-[1.1]'>{note}</p>
        ) : null}
      </div>
    </article>
  );
}
