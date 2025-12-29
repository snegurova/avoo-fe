import React, { useEffect } from 'react';
import { PX_IN_MINUTE } from '@/_constants/time';
import { timeUtils } from '@/_utils/timeUtils';
import { tv } from 'tailwind-variants';

type Props = {
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
  },
});

const label = tv({
  base: '',
  variants: {
    showLabel: {
      true: 'w-min border border-red-700 rounded-2xl bg-white p-1 font-medium text-[10px] leading-[1.2] text-red-700',
      false: '',
    },
  },
});

export default function CalendarCurrentTime(props: Props) {
  const { showLabel = false, time, setTime } = props;

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    const now = new Date();
    const delay = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        setTime(timeUtils.getMinutesInDay(new Date().toString()));
      }, 60000);
      setTime(timeUtils.getMinutesInDay(new Date().toString()));
    }, delay);
    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, []);

  return (
    <div className={marker({ showLabel })} style={{ top: `${time * PX_IN_MINUTE}px` }}>
      <div className={label({ showLabel })}>
        {showLabel && <span>{timeUtils.getTimeFromMinutes(time)}</span>}
      </div>
    </div>
  );
}
