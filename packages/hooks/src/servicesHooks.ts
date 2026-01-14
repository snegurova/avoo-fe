import { utils } from '@avoo/hooks/utils/utils';
import { GetServiceResponse, PrivateServiceQueryParams } from '@avoo/axios/types/apiTypes';

import { BaseResponse } from '@avoo/axios/types/apiTypes';
import { apiStatus } from '@avoo/hooks/types/apiTypes';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { queryKeys } from './queryKeys';
import { servicesApi } from '@avoo/axios/src/modules/services';

type ServicesQueryProps = {
  page: number;
  limit: number;
  categoryId: number | null;
  search: string;
};

export const servicesHooks = {
  useGetServices: ({
    page,
    limit,
    categoryId,
    minPrice,
    maxPrice,
    search,
    isActive,
  }: PrivateServiceQueryParams) => {
    const memoParams = useMemo<PrivateServiceQueryParams>(
      () => ({
        page,
        limit,
        categoryId,
        minPrice,
        maxPrice,
        search,
        isActive,
      }),
      [page, limit, categoryId, minPrice, maxPrice, search, isActive],
    );

    const { data: servicesData, isPending } = useQuery<BaseResponse<GetServiceResponse>, Error>({
      queryKey: ['services', queryKeys.services.byParams(memoParams)],
      queryFn: () => servicesApi.getServices(memoParams),
    });

    utils.useSetPendingApi(isPending);

    if (servicesData?.status === apiStatus.SUCCESS && servicesData.data) {
      return servicesData.data;
    }

    return null;
  },
  useServicesQuery() {
    const [params, setParams] = useState<ServicesQueryProps>({
      page: 1,
      limit: 10,
      categoryId: null,
      search: '',
    });

    const [selectedCategoryName, setSelectedCategoryName] = useState<string>('All categories');

    const setSearchQuery = (value: string) => {
      setParams((prev) => ({
        ...prev,
        page: 1,
        categoryId: null,
        search: value,
      }));
      setSelectedCategoryName('All categories');
    };

    const setCategory = (categoryId: number | null, name = 'All categories') => {
      setParams((prev) => ({
        ...prev,
        page: 1,
        categoryId,
      }));
      setSelectedCategoryName(name);
    };

    const setPage = (page: number) => {
      setParams((prev) => ({
        ...prev,
        page,
      }));
    };

    const incrementPage = () => {
      setPage(params.page + 1);
    };

    const queryParams: PrivateServiceQueryParams = useMemo(
      () => ({
        page: params.page,
        limit: params.limit,
        search: params.search,
        ...(params.categoryId !== null && { categoryId: params.categoryId }),
      }),
      [params],
    );

    return {
      params,
      queryParams,
      selectedCategoryName,
      setSearchQuery,
      setCategory,
      setPage,
      incrementPage,
    };
  },
};
