import React from 'react';
import { PX_IN_MINUTE } from '@/_constants/time';
import { timeUtils } from '@avoo/shared';
import { tv } from 'tailwind-variants';
import { useIntervalAction } from '@avoo/hooks';

type Props = {
  isSingleWeek?: boolean;
  showLabel?: boolean;
  time: number;
  setTime: React.Dispatch<React.SetStateAction<number>>;
};

const marker = tv({
  base: 'absolute w-full -translate-y-1/2 pointer-events-none flex items-center after:content-[""] after:h-px after:bg-red-700 after:w-full after:grow min-h-1 z-7',
  variants: {
    showLabel: {
      true: 'pl-0.5 h-5',
      false: '',
    },
    isSingleWeek: {
      true: 'before:content-[""] before:absolute before:right-full before:h-px before:w-10 before:bg-red-700',
      false: '',
    },
  },
});

const label = tv({
  base: '',
  variants: {
    showLabel: {
      true: 'w-min border border-red-700 rounded-2xl bg-white p-1 font-medium text-[10px] leading-[1.2] text-red-700',
      false: '',
    },
    isSingleWeek: {
      true: 'w-min border border-red-700 rounded-2xl bg-white p-1 font-medium text-[10px] leading-[1.2] text-red-700 absolute -translate-x-10.5',
      false: '',
    },
  },
});

export default function CalendarCurrentTime(props: Props) {
  const { showLabel = false, time, setTime, isSingleWeek = false } = props;
  useIntervalAction(() => {
    setTime(timeUtils.getMinutesInDay(new Date().toString()));
  });

  return (
    <div
      className={marker({ showLabel, isSingleWeek })}
      style={{ top: `${time * PX_IN_MINUTE}px` }}
    >
      <div className={label({ showLabel, isSingleWeek })}>
        {(showLabel || isSingleWeek) && <span>{timeUtils.getTimeFromMinutes(time)}</span>}
      </div>
    </div>
  );
}
