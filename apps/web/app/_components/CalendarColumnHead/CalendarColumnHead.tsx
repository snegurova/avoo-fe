import React from 'react';
import { MasterWithRelationsEntity } from '@avoo/axios/types/apiTypes';
import { CalendarAvatar, AvatarSize } from '@/_components/CalendarAvatar/CalendarAvatar';
import { CalendarViewType } from '@avoo/hooks/types/calendarViewType';
import { tv } from 'tailwind-variants';
import { CalendarType } from '@avoo/hooks/types/calendarType';

type Props = {
  master: MasterWithRelationsEntity;
  idx?: number;
  type: CalendarViewType;
  calendarType: CalendarType;
};

const container = tv({
  base: 'bg-white flex-1',
  variants: {
    type: {
      [CalendarViewType.DAY]: 'h-19 py-2 min-w-25 md:min-w-55',
      [CalendarViewType.WEEK]:
        'w-20 first:min-h-50 min-h-40 px-2 flex items-center justify-center  border-r border-gray-300 first:pt-10',
      [CalendarViewType.MONTH]: '',
    },
    calendarType: {
      [CalendarType.REGULAR]: '',
      [CalendarType.WIDGET]: '',
      [CalendarType.SELECTOR]: '',
    },
  },
  compoundVariants: [
    {
      calendarType: CalendarType.REGULAR,
      type: CalendarViewType.DAY,
      className: '2xl:min-w-90',
    },
    {
      calendarType: CalendarType.WIDGET,
      type: CalendarViewType.DAY,
      className: 'lg:min-w-25 xl:min-w-55',
    },
    {
      calendarType: CalendarType.SELECTOR,
      type: CalendarViewType.DAY,
      className: 'lg:min-w-25',
    },
  ],
});

export default function CalendarColumnHead(props: Props) {
  const { master, idx, type, calendarType } = props;
  return (
    <div className={container({ type, calendarType })}>
      <CalendarAvatar
        name={master ? master.name : undefined}
        size={AvatarSize.Large}
        idx={idx}
        addName
      />
    </div>
  );
}
