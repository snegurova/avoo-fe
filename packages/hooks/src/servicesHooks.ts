import { utils } from '@avoo/hooks/utils/utils';
import {
  CreateServiceRequest,
  CreateServiceResponse,
  GetServiceResponse,
  ServicesQueryParams,
} from '@avoo/axios/types/apiTypes';

import { BaseResponse } from '@avoo/axios/types/apiTypes';
import { InfiniteData, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { servicesApi } from '@avoo/axios/src/modules/services';
import { useDebounce } from './useDebounce';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { CreateServiceFormData, createServiceSchema } from '../schemas/validationSchemas';
import { queryKeys } from './queryKeys';

const DEFAULT_LIMIT = 10;

type UseServiceCreateFormParams = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

export const servicesHooks = {
  useGetServicesInfinite: ({
    limit = DEFAULT_LIMIT,
    categoryId,
    minPrice,
    maxPrice,
    search,
    isActive,
    masterIds,
  }: ServicesQueryParams) => {
    const filterParams = { limit, categoryId, minPrice, maxPrice, search, isActive, masterIds };
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
    const [params, setParams] = useState({
      limit: DEFAULT_LIMIT,
      categoryId: null,
      search: '',
      masterIds: [],
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

    const setMasterIds = (masterIds: number[]) => {
      setParams((prev) => ({
        ...prev,
        masterIds,
      }));
    };

    const debouncedSearch = useDebounce(params.search, 400);

    const queryParams = useMemo(
      () => ({
        limit: params.limit,
        search: debouncedSearch,
        ...(params.categoryId !== null && { categoryId: params.categoryId }),
        ...(params.masterIds.length > 0 && { masterIds: params.masterIds }),
      }),
      [params.limit, params.categoryId, debouncedSearch, params.masterIds],
    );

    return {
      params,
      queryParams,
      selectedCategoryName,
      setSearchQuery,
      setCategory,
      setMasterIds,
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
          queryKey: queryKeys.categories.all,
        });
      },
    });

    utils.useSetPendingApi(deleteServiceMutation.isPending);

    return {
      deleteServiceMutation,
      deleteServiceMutationAsync: deleteServiceMutation.mutateAsync,
    };
  },

  useCreateServiceForm: ({ onSuccess, onError }: UseServiceCreateFormParams) => {
    const {
      register,
      control,
      setValue,
      getValues,
      handleSubmit,
      formState: { errors },
    } = useForm<CreateServiceFormData>({
      resolver: yupResolver(createServiceSchema),
      mode: 'onSubmit',
      defaultValues: {
        durationMinutes: 15,
        mediaIds: [],
        masterIds: [],
        isActive: true,
      },
    });
    const queryClient = useQueryClient();

    const { mutate: createService, isPending } = useMutation<
      BaseResponse<CreateServiceResponse>,
      Error,
      CreateServiceRequest
    >({
      mutationFn: servicesApi.createService,
      meta: {
        successMessage: 'Service created successfully',
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: queryKeys.categories.all,
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.services.all,
        });

        onSuccess?.();
      },
      onError: (error) => {
        onError?.(error);
      },
    });

    utils.useSetPendingApi(isPending);

    return {
      register,
      control,
      setValue,
      getValues,
      handleSubmit: handleSubmit(
        utils.submitAdapter<CreateServiceRequest, CreateServiceFormData>(createService),
      ),
      errors,
    };
  },
};
