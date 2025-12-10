import React from 'react';
import { MasterWithRelationsEntity } from '@avoo/axios/types/apiTypes';
import { Avatar, AvatarSize } from '@/_components/Avatar/Avatar';
import { calendarViewType } from '@avoo/hooks/types/calendarViewType';
import { tv } from 'tailwind-variants';

type Props = {
  master: MasterWithRelationsEntity;
  idx?: number;
  type: calendarViewType;
};

const container = tv({
  base: 'bg-white flex-1',
  variants: {
    type: {
      [calendarViewType.DAY]: 'min-w-90 h-19 py-2',
      [calendarViewType.WEEK]: 'w-20 min-h-40 px-2 flex items-center justify-center',
      [calendarViewType.MONTH]: '',
    },
  },
});

export default function CalendarColumnHead(props: Props) {
  const { master, idx, type } = props;
  return (
    <div className={container({ type })}>
      <Avatar name={master ? master.name : undefined} size={AvatarSize.Small} idx={idx} addName />
    </div>
  );
}
