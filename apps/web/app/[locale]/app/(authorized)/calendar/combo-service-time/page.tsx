'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { combinationHooks } from '@avoo/hooks';
import { useApiStatusStore } from '@avoo/store';

import AppPlaceholder from '@/_components/AppPlaceholder/AppPlaceholder';
import AppWrapper from '@/_components/AppWrapper/AppWrapper';
import ComboServiceControls from '@/_components/ComboServiceControls/ComboServiceControls';
import ComboServiceList from '@/_components/ComboServiceList/ComboServiceList';
import AutoStoriesIcon from '@/_icons/AutoStoriesIcon';

export default function WorkingHoursPage() {
  const t = useTranslations('private.calendar.comboServiceTime');
  const isPending = useApiStatusStore((state) => state.isPending);
  const { setSearchQuery, queryParams } = combinationHooks.useCombinationQuery();
  const { data, fetchNextPage, hasNextPage } = combinationHooks.useGetCombinationsInfinite({
    ...queryParams,
  });

  const combinations = useMemo(
    () => data?.pages.flatMap((page) => page.data?.items ?? []) ?? [],
    [data],
  );

  return (
    <AppWrapper withPadding>
      <ComboServiceControls setSearchQuery={setSearchQuery} />
      {combinations.length === 0 && !queryParams.search ? (
        <AppPlaceholder
          title={isPending ? t('loading') : t('setupFirstCombo')}
          icon={<AutoStoriesIcon className='w-20 h-20 lg:w-25 lg:h-25 fill-primary-300' />}
          description={
            isPending ? null : (
              <p>
                {t.rich('detailedMultipleServicesDescription', {
                  link: (chunks) => (
                    <Link href='#' className='text-primary-300'>
                      {chunks}
                    </Link>
                  ),
                })}
              </p>
            )
          }
        />
      ) : (
        <ComboServiceList
          hasMore={hasNextPage}
          combinations={combinations}
          incrementPage={fetchNextPage}
        />
      )}
    </AppWrapper>
  );
}
