'use client';
import React, { useEffect, useMemo, useState } from 'react';
import AppWrapper from '@/_components/AppWrapper/AppWrapper';
import ServiceList from '@/_components/ServiceList/ServiceList';
import ServiceControls from '@/_components/ServiceControls/ServiceControls';
import { servicesHooks } from '@avoo/hooks/src/servicesHooks';
import { categoriesHooks } from '@avoo/hooks';

export default function ServicesPage() {
  const currency = 'EUR';
  const [allCategoriesCount, setAllCategoriesCount] = useState<number>(0);

  const { params, queryParams, selectedCategoryName, setSearchQuery, setCategory } =
    servicesHooks.useServicesQuery();

  const categories = categoriesHooks.useGetCategories();
  const { data, fetchNextPage, hasNextPage } = servicesHooks.useGetServicesInfinite(queryParams);

  const services = useMemo(
    () => data?.pages.flatMap((page) => page.data?.items ?? []) ?? [],
    [data],
  );

  const totalServicesCount = data?.pages?.[0]?.data?.pagination?.total ?? 0;
  useEffect(() => {
    if (!params.categoryId) {
      setAllCategoriesCount(totalServicesCount);
    }
  }, [params.categoryId, totalServicesCount]);

  return (
    <AppWrapper>
      <ServiceControls setSearchQuery={setSearchQuery} />
      <ServiceList
        categorySidebarItems={categories}
        services={services}
        allServicesCount={allCategoriesCount}
        totalServicesCount={totalServicesCount}
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
