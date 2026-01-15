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
      <div className='hidden lg:flex items-center gap-4 px-8 py-3 mb-8 text-sm text-black font-semibold bg-primary-50'>
        <div className='w-1/5'>Master name</div>
        <div className='w-1/5'>Mobile number</div>
        <div className='w-1/5'>Email address</div>
        <div className='w-1/5'>Languages</div>
        <div className='w-12 text-right'>Actions</div>
      </div>
      <div className='flex flex-col gap-4'>
        {masters.map((master) => (
          <MasterListItem key={master.id} master={master} />
        ))}
      </div>
    </div>
  );
};

export default MasterList;
