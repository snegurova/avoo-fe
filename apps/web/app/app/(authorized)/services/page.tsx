'use client';
import React, { useEffect, useState } from 'react';
import AppWrapper from '@/_components/AppWrapper/AppWrapper';
import ServiceList from '@/_components/ServiceList/ServiceList';
import ServiceControls from '@/_components/ServiceControls/ServiceControls';
import { servicesHooks } from '@avoo/hooks/src/servicesHooks';
import { categoriesHooks } from '@avoo/hooks';
import { Service } from '@avoo/axios/types/apiTypes';

export default function ServicesPage() {
  const currency = 'EUR';
  const [services, setServices] = useState<Service[]>([]);
  const [totalServicesCount, setTotalServicesCount] = useState<number>(0);
  const [allCategoriesCount, setAllCategoriesCount] = useState<number>(0);

  const { params, queryParams, selectedCategoryName, setSearchQuery, setCategory, incrementPage } =
    servicesHooks.useServicesQuery();

  const categories = categoriesHooks.useGetCategories();
  const servicesResponse = servicesHooks.useGetServices(queryParams);
  const { items = [], pagination } = servicesResponse ?? { items: [], pagination: { total: 0 } };

  useEffect(() => {
    if (params.page === 1) {
      setServices(items);
    } else {
      setServices((prev) => [...prev, ...items]);
    }

    if (params.categoryId === null) {
      setAllCategoriesCount(pagination?.total ?? 0);
    }

    setTotalServicesCount(pagination?.total ?? 0);
  }, [items, pagination, params.page, params.categoryId]);

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
        incrementPage={incrementPage}
        hasMore={services.length < totalServicesCount}
        currency={currency}
      />
    </AppWrapper>
  );
}
