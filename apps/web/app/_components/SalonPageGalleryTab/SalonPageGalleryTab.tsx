import React, { useMemo } from 'react';
import { useTranslations } from 'next-intl';

import { MEDIA_TYPE_ENUM } from '@avoo/axios/types/apiEnums';
import { MediaEntity } from '@avoo/axios/types/apiTypes';
import { mediaHooks } from '@avoo/hooks';

type Props = {
  userId: number;
};

export default function SalonPageGalleryTab(props: Props) {
  const { userId } = props;
  const t = useTranslations('public.salon.page');

  const { data } = mediaHooks.useGetPublicMedia({
    limit: 9,
    type: MEDIA_TYPE_ENUM.USER,
    typeEntityId: userId,
    createdBy: userId,
  });

  const pictures = useMemo(
    () =>
      (data?.pages.flatMap((page) => page?.data?.items) || []).filter(
        (item): item is MediaEntity => item !== undefined,
      ),
    [data],
  );

  return (
    <div className='flex justify-center items-center py-8 flex-1'>
      {pictures.length < 1 && <p className='max-w-150 text-center'>{t('galleryPlaceholder')}</p>}
    </div>
  );
}
