import React, { useState } from 'react';

import { tv } from 'tailwind-variants';

import { GetPublicUserProfileResponse } from '@avoo/axios/types/apiTypes';

import SalonPageGalleryTab from '@/_components/SalonPageGalleryTab/SalonPageGalleryTab';
import SalonPageServicesTab from '@/_components/SalonPageServicesTab/SalonPageServicesTab';
import SalonPageTeamTab from '@/_components/SalonPageTeamTab/SalonPageTeamTab';

import SalonPageCertificatesTab from '../SalonPageCertificatesTab/SalonPageCertificatesTab';

const tabButton = tv({
  base: 'transition-colors p-4 rounded-t-[18px]',
  variants: {
    active: {
      true: 'text-white bg-black',
      false: 'text-black cursor-pointer hover:bg-gray-200 focus:bg-gray-200',
    },
  },
});

type Props = {
  userId: number;
  data: GetPublicUserProfileResponse | null;
};

export default function SalonPageTabsPanel(props: Props) {
  const { userId, data } = props;
  const [activeTab, setActiveTab] = useState('services');
  const tabs = [
    { key: 'services', label: 'Services' },
    { key: 'gallery', label: 'Gallery' },
    { key: 'team', label: 'Team' },
    { key: 'certificates', label: 'Certificates' },
  ];

  return (
    <div className='mt-8 flex flex-col flex-1'>
      <div className='grid grid-cols-4 border-b border-gray-200 mb-8'>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={tabButton({ active: activeTab === tab.key })}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className='flex flex-col flex-1'>
        {activeTab === 'services' && <SalonPageServicesTab userId={userId} />}
        {activeTab === 'gallery' && <SalonPageGalleryTab userId={userId} />}
        {activeTab === 'team' && <SalonPageTeamTab masters={data?.masters} />}
        {activeTab === 'certificates' && <SalonPageCertificatesTab userId={userId} />}
      </div>
    </div>
  );
}
