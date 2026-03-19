import React from 'react';

import { MasterWithRelationsEntity } from '@avoo/axios/types/apiTypes';

import LanguageIcon from '@/_icons/LanguageIcon';

type Props = {
  masters: MasterWithRelationsEntity[] | undefined;
};

export default function SalonPageTeamTab(props: Props) {
  const { masters } = props;

  return (
    <div className='pt-4 pb-8 xl:pt-8 xl:pb-22 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-4 gap-x-2'>
      {masters?.map((master) => (
        <div key={master.id} className='flex flex-col items-center gap-3 p-1.5'>
          <div className='rounded-full w-25 h-25 md:w-40 md:h-40 bg-gray-100'>
            {master.avatarPreviewUrl && (
              <img
                src={master.avatarPreviewUrl}
                alt={master.name}
                className='rounded-full w-full h-full object-cover'
              />
            )}
          </div>
          <div className='text-center flex flex-col gap-2 justify-between'>
            <div className=''>
              <p className='text-base font-bold text-black'>{master.name}</p>
              {master.headline && <p className='text-xs leading-tight mt-1'>{master.headline}</p>}
            </div>
            {master.languages && (
              <div className='flex items-center justify-center gap-1'>
                <LanguageIcon className='w-6 h-6 fill-current' />
                <p className='text-xs leading-tight'>{master.languages.join(', ').toUpperCase()}</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
