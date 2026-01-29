'use client';
import React, { useMemo } from 'react';
import AppWrapper from '@/_components/AppWrapper/AppWrapper';
import ServiceList from '@/_components/ServiceList/ServiceList';
import ServiceControls from '@/_components/ServiceControls/ServiceControls';
import { servicesHooks } from '@avoo/hooks/src/servicesHooks';
import { categoriesHooks } from '@avoo/hooks';
import Link from 'next/link';
import { appRoutes } from '@/_routes/routes';
import AutoStoriesIcon from '@/_icons/AutoStoriesIcon';
import AppPlaceholder from '@/_components/AppPlaceholder/AppPlaceholder';

export default function ServicesPage() {
  const currency = 'EUR';

  const { params, queryParams, selectedCategoryName, setSearchQuery, setCategory } =
    servicesHooks.useServicesQuery();

  const { data, fetchNextPage, hasNextPage } = servicesHooks.useGetServicesInfinite(queryParams);
  const categoriesResponse = categoriesHooks.useGetCategories(queryParams.search || '');
  const { categories, total } = categoriesResponse || { categories: null, total: 0 };
  const services = useMemo(
    () => data?.pages.flatMap((page) => page.data?.items ?? []) ?? [],
    [data],
  );

  return (
    <AppWrapper>
      <ServiceControls setSearchQuery={setSearchQuery} />
      {params.search === '' && !categories ? (
        <AppPlaceholder
          title='No services added'
          icon={<AutoStoriesIcon className='w-20 h-20 lg:w-25 lg:h-25 fill-primary-300' />}
          description={
            <p>
              Start by creating your first{' '}
              <Link href={appRoutes.CreateService} className='text-primary-300'>
                service
              </Link>{' '}
              to make it available for booking
            </p>
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
          currency={currency}
        />
      )}
    </AppWrapper>
  );
}
