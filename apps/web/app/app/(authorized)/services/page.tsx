'use client';
import React, { useMemo } from 'react';
import AppWrapper from '@/_components/AppWrapper/AppWrapper';
import ServiceList from '@/_components/ServiceList/ServiceList';
import ServiceControls from '@/_components/ServiceControls/ServiceControls';
import { servicesHooks } from '@avoo/hooks/src/servicesHooks';
import { categoriesHooks } from '@avoo/hooks';

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
      <ServiceList
        categorySidebarItems={categories}
        services={services}
        allServicesCount={total}
        selectedCategoryId={params.categoryId}
        selectedCategoryName={selectedCategoryName}
        setSelectedCategory={setCategory}
        incrementPage={fetchNextPage}
        hasMore={hasNextPage}
        currency={currency}
      />
    </AppWrapper>
  );
}
