import React from 'react';
import { MasterWithRelationsEntity } from '@avoo/axios/types/apiTypes';
import { CalendarAvatar, AvatarSize } from '@/_components/CalendarAvatar/CalendarAvatar';
import { CalendarViewType } from '@avoo/hooks/types/calendarViewType';
import { tv } from 'tailwind-variants';

type Props = {
  master: MasterWithRelationsEntity;
  idx?: number;
  type: CalendarViewType;
};

const container = tv({
  base: 'bg-white flex-1',
  variants: {
    type: {
      [CalendarViewType.DAY]: 'min-w-25 md:min-w-55 2xl:min-w-90 h-19 py-2',
      [CalendarViewType.WEEK]:
        'w-20 first:min-h-50 min-h-40 px-2 flex items-center justify-center  border-r border-gray-300 first:pt-10',
      [CalendarViewType.MONTH]: '',
    },
  },
});

export default function CalendarColumnHead(props: Props) {
  const { master, idx, type } = props;
  return (
    <div className={container({ type })}>
      <CalendarAvatar
        name={master ? master.name : undefined}
        size={AvatarSize.Large}
        idx={idx}
        addName
      />
    </div>
  );
}
