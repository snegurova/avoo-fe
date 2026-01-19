import { utils } from '@avoo/hooks/utils/utils';
import { GetServiceResponse, PrivateServiceQueryParams } from '@avoo/axios/types/apiTypes';

import { BaseResponse } from '@avoo/axios/types/apiTypes';
import { InfiniteData, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { servicesApi } from '@avoo/axios/src/modules/services';
import { useDebounce } from './useDebounce';

type ServicesQueryProps = {
  limit: number;
  categoryId: number | null;
  search: string;
};

const DEFAULT_LIMIT = 10;

export const servicesHooks = {
  useGetServicesInfinite: ({
    limit = DEFAULT_LIMIT,
    categoryId,
    minPrice,
    maxPrice,
    search,
    isActive,
  }: Omit<PrivateServiceQueryParams, 'page'>) => {
    const filterParams = { limit, categoryId, minPrice, maxPrice, search, isActive };
    const query = useInfiniteQuery<BaseResponse<GetServiceResponse>, Error>({
      queryKey: ['services', 'list', filterParams],
      queryFn: ({ pageParam = 1 }) =>
        servicesApi.getServices({ ...filterParams, page: pageParam as number }),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        const { currentPage, total } = lastPage.data?.pagination || { currentPage: 0, total: 0 };
        return currentPage * limit < total ? currentPage + 1 : undefined;
      },
    });

    const isPending = query.isFetching;

    utils.useSetPendingApi(isPending);

    return query;
  },
  useServicesQuery() {
    const [params, setParams] = useState<ServicesQueryProps>({
      limit: DEFAULT_LIMIT,
      categoryId: null,
      search: '',
    });

    const [selectedCategoryName, setSelectedCategoryName] = useState<string>('All categories');

    const setSearchQuery = (value: string) => {
      setParams((prev) => ({
        ...prev,
        categoryId: null,
        search: value,
      }));
      setSelectedCategoryName('All categories');
    };

    const setCategory = (categoryId: number | null, name = 'All categories') => {
      setParams((prev) => ({
        ...prev,
        categoryId,
      }));
      setSelectedCategoryName(name);
    };

    const debouncedSearch = useDebounce(params.search, 400);

    const queryParams: Omit<PrivateServiceQueryParams, 'page'> = useMemo(
      () => ({
        limit: params.limit,
        search: debouncedSearch,
        ...(params.categoryId !== null && { categoryId: params.categoryId }),
      }),
      [params.limit, params.categoryId, debouncedSearch],
    );

    return {
      params,
      queryParams,
      selectedCategoryName,
      setSearchQuery,
      setCategory,
    };
  },
  useDeleteService: () => {
    const queryClient = useQueryClient();

    const deleteServiceMutation = useMutation({
      mutationFn: (id: number) => servicesApi.deleteService(id),
      onSuccess: (_, deletedId) => {
        queryClient.setQueriesData<InfiniteData<BaseResponse<GetServiceResponse>>>(
          {
            predicate: (query) => query.queryKey[0] === 'services' && query.queryKey[1] === 'list',
          },
          (oldData) => {
            if (!oldData) return oldData;

            const newPages = oldData.pages.map((page) => {
              const newItems = page.data.items.filter((s) => s.id !== deletedId);

              return {
                ...page,
                data: {
                  ...page.data,
                  items: newItems,
                  pagination: {
                    ...page.data.pagination,
                    total: Math.max(page.data.pagination.total - 1, 0),
                  },
                },
              };
            });

            return { ...oldData, pages: newPages };
          },
        );
        queryClient.invalidateQueries({
          queryKey: ['categories'],
        });
      },
    });

    utils.useSetPendingApi(deleteServiceMutation.isPending);

    return {
      deleteServiceMutation,
      deleteServiceMutationAsync: deleteServiceMutation.mutateAsync,
    };
  },
};
