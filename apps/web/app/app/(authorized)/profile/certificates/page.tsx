'use client';

import { SectionHeader } from '@/_components/SectionHeader/SectionHeader';
import { IconButton } from '@/_components/IconButton/IconButton';
import { navigationHooks } from '@/_hooks/navigationHooks';

export default function CertificatesPage() {
  const handleBackClick = navigationHooks.useHandleBackClick();

  return (
    <div className='container mx-auto p-4 max-w-4xl'>
      <IconButton icon='⬅' onClick={handleBackClick} ariaLabel='Back' />
      <SectionHeader title='Certificates' />
      <div className='bg-white border border-gray-200 rounded-lg p-6'>
        <p className='text-gray-500'>Certificates content will be here</p>
      </div>
    </div>
  );
}
