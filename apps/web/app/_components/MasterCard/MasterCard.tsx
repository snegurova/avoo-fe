'use client';

import React from 'react';

import { MasterWithRelationsEntityResponse } from '@avoo/axios/types/apiTypes';

import Avatar, { AvatarSize } from '@/_components/Avatar/Avatar';

type Props = {
  master: MasterWithRelationsEntityResponse;
};

export const MasterCard = ({ master }: Props) => {
  return (
    <div className='bg-white border border-gray-100 rounded-lg p-4 flex flex-col items-center'>
      <Avatar name={master.name} src={master.avatarPreviewUrl} size={AvatarSize.Large} />
      {master.name && (
        <p className='mt-3 text-sm font-semibold text-slate-900 text-center'>{master.name}</p>
      )}
    </div>
  );
};

export default MasterCard;
