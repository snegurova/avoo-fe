import React from 'react';

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
}: Props) {
  return (
    <article className='flex items-start gap-6 bg-white border border-gray-200 rounded-lg py-2.5 px-4 shadow-sm max-h-[112px] md:max-h-[136px]'>
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
          <div>
            <h4 className='text-sm font-semibold'>{title}</h4>
            <div className='text-xs text-gray-500 flex items-center gap-3'>
              <small>{duration}</small>
              <span aria-hidden className='text-black font-semibold'>
                |
              </span>
              <small className='text-xs'>{master}</small>
              <span aria-hidden className='text-black font-semibold'>
                |
              </span>
              <span className='font-medium text-sm text-black'>{price}</span>
            </div>
          </div>
        </div>

        {note ? (
          <p className='text-xs text-gray-500 mt-1.5 line-clamp-3 leading-[1.2]'>{note}</p>
        ) : null}
      </div>
    </article>
  );
}
