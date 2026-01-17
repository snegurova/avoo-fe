'use client';

import React from 'react';
import Avatar, { AvatarSize } from '@/_components/Avatar/Avatar';
import { MasterWithRelationsEntityResponse } from '@avoo/axios/types/apiTypes';

type Props = {
  master: MasterWithRelationsEntityResponse;
};

export const MasterCard = ({ master }: Props) => {
  return (
    <div className='bg-white border border-gray-100 rounded-lg p-4 flex flex-col items-center'>
      <Avatar
        name={master.name ?? 'No name'}
        src={master.avatarPreviewUrl ?? master.avatarUrl}
        size={AvatarSize.Large}
        bgColor={undefined}
      />
      {master.name && (
        <p className='mt-3 text-sm font-semibold text-slate-900 text-center'>{master.name}</p>
      )}
    </div>
  );
};

export default MasterCard;
