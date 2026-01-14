'use client';
import React, { useEffect, useState } from 'react';
import AppWrapper from '@/_components/AppWrapper/AppWrapper';
import ServiceList from '@/_components/ServiceList/ServiceList';
import ServiceControls from '@/_components/ServiceControls/ServiceControls';
import { servicesHooks } from '@avoo/hooks/src/servicesHooks';
import { categoriesHooks } from '@avoo/hooks';
import { PrivateServiceQueryParams, Service } from '@avoo/axios/types/apiTypes';

type ServicesQueryProps = {
  page: number;
  limit: number;
  categoryId: number | null;
  search: string;
};

export default function ServicesPage() {
  const currency = 'EUR';
  const [services, setServices] = useState<Service[]>([]);
  const [totalServicesCount, setTotalServicesCount] = useState<number>(0);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>('All categories');
  const [allCategoriesCount, setAllCategoriesCount] = useState<number>(0);

  const [params, setParams] = useState<ServicesQueryProps>({
    page: 1,
    limit: 10,
    categoryId: null,
    search: '',
  });
  const query: PrivateServiceQueryParams = {
    page: params.page,
    limit: params.limit,
    search: params.search,
    ...(params.categoryId !== null && { categoryId: params.categoryId }),
  };

  const categories = categoriesHooks.useGetCategories();
  const servicesResponse = servicesHooks.useGetServices(query);
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

  const setSelectedCategory = (value: number | null, name: string) => {
    setParams({ ...params, page: 1, categoryId: value, search: '' });
    setSelectedCategoryName(name);
  };
  const setSearchQuery = (value: string) => {
    setParams({ ...params, page: 1, categoryId: null, search: value });
    setSelectedCategoryName('All categories');
  };

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
        setSelectedCategory={setSelectedCategory}
        incrementPage={() => setParams({ ...params, page: params.page + 1 })}
        hasMore={services.length < totalServicesCount}
        currency={currency}
      />
    </AppWrapper>
  );
}
