'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

import AppWrapper from '@/_components/AppWrapper/AppWrapper';
import MasterAddForm from '@/_components/MasterAddForm/MasterAddForm';

export default function AddMasterPage() {
  const t = useTranslations('private.masters.addMaster');
  return (
    <AppWrapper>
      <div className='py-7 px-5 md:px-11 flex-1 min-h-0 overflow-auto hide-scrollbar max-w-4xl xl:max-w-screen-xl xl:mx-auto'>
        <h2 className='text-xl md:text-2xl font-semibold mb-8 md:mb-10 lg:mb-12 max-w-4xl xl:mx-auto'>
          {t('addMaster')}
        </h2>
        <MasterAddForm />
      </div>
    </AppWrapper>
  );
}
