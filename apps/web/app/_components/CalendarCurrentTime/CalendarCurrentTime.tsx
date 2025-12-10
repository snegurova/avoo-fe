import React, { useEffect, useState } from 'react';
import { PX_IN_MINUTE } from '@/_constants/time';
import { timeUtils } from '@/_utils/timeUtils';
import { tv } from 'tailwind-variants';

type Props = {
  showLabel?: boolean;
};

const marker = tv({
  base: 'absolute w-full -translate-y-1/2 pointer-events-none flex items-center after:content-[""] after:h-px after:bg-important after:w-full after:grow min-h-1',
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
      true: 'w-min border border-important rounded-2xl bg-white p-1 font-medium text-[10px] leading-[1.2] text-important',
      false: '',
    },
  },
});

export default function CalendarCurrentTime(props: Props) {
  const { showLabel = false } = props;

  const [time, setTime] = useState(timeUtils.getMinutesInDay(new Date().toString()));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(timeUtils.getMinutesInDay(new Date().toString()));
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className=''>
      <div className={marker({ showLabel })} style={{ top: `${time * PX_IN_MINUTE}px` }}>
        <div className={label({ showLabel })}>
          {showLabel && <span>{timeUtils.getTimeFromMinutes(time)}</span>}
        </div>
      </div>
    </div>
  );
}
