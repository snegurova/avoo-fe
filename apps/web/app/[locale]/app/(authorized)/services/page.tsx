'use client';
import React, { useMemo } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { categoriesHooks, servicesHooks } from '@avoo/hooks';
import { useApiStatusStore } from '@avoo/store';

import AppPlaceholder from '@/_components/AppPlaceholder/AppPlaceholder';
import AppWrapper from '@/_components/AppWrapper/AppWrapper';
import ServiceControls from '@/_components/ServiceControls/ServiceControls';
import ServiceList from '@/_components/ServiceList/ServiceList';
import { CURRENCY } from '@/_constants/currency';
import { localizationHooks } from '@/_hooks/localizationHooks';
import AutoStoriesIcon from '@/_icons/AutoStoriesIcon';
import { AppRoutes } from '@/_routes/routes';

export default function ServicesPage() {
  const isPending = useApiStatusStore((state) => state.isPending);
  const { params, queryParams, selectedCategoryName, setSearchQuery, setCategory } =
    servicesHooks.useServicesQuery();

  const { data, fetchNextPage, hasNextPage } = servicesHooks.useGetServicesInfinite(queryParams);
  const categoriesResponse = categoriesHooks.useGetCategories(queryParams.search || '');
  const { categories, total } = categoriesResponse || { categories: null, total: 0 };
  const services = useMemo(
    () => data?.pages.flatMap((page) => page.data?.items ?? []) ?? [],
    [data],
  );

  const t = useTranslations('private.services');
  return (
    <AppWrapper withPadding>
      <ServiceControls setSearchQuery={setSearchQuery} />
      {params.search === '' && total === 0 ? (
        <AppPlaceholder
          title={isPending ? t('loading') : t('noServicesAdded')}
          icon={<AutoStoriesIcon className='w-20 h-20 xl:w-25 xl:h-25 fill-primary-300' />}
          description={
            isPending ? null : (
              <p>
                {t.rich('detailedNoServicesDescription', {
                  link: (chunks) => (
                    <Link
                      href={localizationHooks.useWithLocale(AppRoutes.CreateService)}
                      className='text-primary-300'
                    >
                      {chunks}
                    </Link>
                  ),
                })}
              </p>
            )
          }
        />
      ) : (
        <ServiceList
          categorySidebarItems={categories}
          services={services}
          allServicesCount={total}
          selectedCategoryId={params.categoryId ?? null}
          selectedCategoryName={selectedCategoryName}
          setSelectedCategory={setCategory}
          incrementPage={fetchNextPage}
          hasMore={hasNextPage}
          currency={CURRENCY}
        />
      )}
    </AppWrapper>
  );
}
