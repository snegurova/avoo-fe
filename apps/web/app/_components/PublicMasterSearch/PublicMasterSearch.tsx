import React from 'react';
import { useTranslations } from 'next-intl';

import { MasterWithRelationsEntity } from '@avoo/axios/types/apiTypes';

type Props = {
  selectedMaster: MasterWithRelationsEntity | null;
};

export default function PublicMasterSearch(props: Props) {
  const { selectedMaster } = props;
  const t = useTranslations('public.salon.createOrder');

  return (
    <div>
      <div className=''>
        <h2 className='font-medium text-2xl leading-normal text-black'>{t('selectMaster')}</h2>
      </div>
      <div className=''>
        <span>{selectedMaster?.name}</span>
      </div>
    </div>
  );
}
