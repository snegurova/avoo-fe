'use client';

import React from 'react';
import { MasterWithRelationsEntityResponse } from '@avoo/axios/types/apiTypes';
import MasterListItem from '@/_components/MasterListItem/MasterListItem';

type Props = {
  masters: MasterWithRelationsEntityResponse[] | null;
};

export const MasterList = ({ masters }: Props) => {
  if (!masters || masters.length === 0) {
    return <div className='py-8 text-center text-gray-500'>No masters yet</div>;
  }

  return (
    <div>
      <div className='hidden md:flex items-center gap-4 px-3 py-2 text-sm text-gray-500 border-b'>
        <div className='w-2/5'>Client name</div>
        <div className='w-1/5'>Mobile number</div>
        <div className='w-1/5'>Email address</div>
        <div className='w-1/5'>Languages</div>
        <div className='w-12 text-right'>Actions</div>
      </div>
      <div className='flex flex-col gap-4 py-4'>
        {masters.map((m) => (
          <MasterListItem key={m.id} master={m} />
        ))}
      </div>
    </div>
  );
};

export default MasterList;
