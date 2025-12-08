import React from 'react';
import { MasterWithRelationsEntity } from '@avoo/axios/types/apiTypes';
import { Avatar, AvatarSize } from '@/_components/Avatar/Avatar';

type Props = {
  master: MasterWithRelationsEntity;
  idx?: number;
};

export default function CalendarColumnHead(props: Props) {
  const { master, idx } = props;

  return (
    <div className='min-w-90 flex-1 py-2 h-19 bg-white'>
      <Avatar name={master ? master.name : undefined} size={AvatarSize.Small} idx={idx} addName />
      {/* Render calendar data here */}
    </div>
  );
}
