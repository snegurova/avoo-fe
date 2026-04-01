import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { combinationApi } from '@avoo/axios';
import {
  ApiStatus,
  BaseResponse,
  Combination,
  CreateCombinationRequest,
  ErrorResponse,
  GetCombinationsQueryParams,
  GetCombinationsResponse,
  UpdateCombinationRequest,
} from '@avoo/axios/types/apiTypes';
import {
  CreateCombinationFormData,
  createCombinationSchema,
  UpdateCombinationFormData,
  updateCombinationSchema,
} from '@avoo/hooks/schemas/validationSchemas';
import { utils } from '@avoo/hooks/utils/utils';

import { queryKeys } from './queryKeys';
import { useDebounce } from './useDebounce';

type UseCreateCombinationFormParams = {
  onSuccess?: () => void;
  onError?: (error: ErrorResponse) => void;
};

type UseUpdateCombinationFormParams = UseCreateCombinationFormParams & {
  defaultValue: Combination;
};

const DEFAULT_LIMIT = 10;

export const combinationHooks = {
  useGetCombinationsInfinite: ({
    limit = DEFAULT_LIMIT,
    search,
    masterIds,
    isActive,
    serviceIds,
  }: GetCombinationsQueryParams) => {
    const filterParams = { limit, search, isActive, masterIds, serviceIds };
    const query = useInfiniteQuery<BaseResponse<GetCombinationsResponse>, Error>({
      queryKey: ['combinations', 'list', filterParams],
      queryFn: ({ pageParam = 1 }) =>
        combinationApi.getCombinations({ ...filterParams, page: pageParam as number }),
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
  useCombinationQuery() {
    const [params, setParams] = useState<GetCombinationsQueryParams>({
      limit: DEFAULT_LIMIT,
      search: '',
      serviceIds: [],
    });

    const setSearchQuery = (value: string) => {
      setParams((prev) => ({
        ...prev,
        search: value,
      }));
    };

    const debouncedSearch = useDebounce(params.search, 400);

    const queryParams = useMemo(
      () => ({
        limit: params.limit,
        search: debouncedSearch,
      }),
      [params.limit, debouncedSearch],
    );

    return {
      params,
      queryParams,
      setSearchQuery,
    };
  },
  useCombinationControls() {
    const [selectedCombination, setSelectedCombination] = useState<Combination | null>(null);
    const [combinationToDelete, setCombinationToDelete] = useState<number | null>(null);
    const handleOpenDeleteDialog = (id: number) => {
      setCombinationToDelete(id);
    };
    const handleCloseDeleteDialog = () => {
      setCombinationToDelete(null);
      setSelectedCombination(null);
    };
    return {
      selectedCombination,
      handleOpenDeleteDialog,
      handleCloseDeleteDialog,
      setSelectedCombination,
      combinationToDelete,
      setCombinationToDelete,
    };
  },

  useGetCombinations: (params: GetCombinationsQueryParams) => {
    const memoParams = useMemo<GetCombinationsQueryParams>(
      () => ({
        serviceIds: params.serviceIds,
        masterIds: params.masterIds,
        isActive: params.isActive,
      }),
      [params],
    );

    const { data: combinationsData, isPending } = useQuery<
      BaseResponse<GetCombinationsResponse>,
      Error
    >({
      queryKey: [queryKeys.combinations.all, queryKeys.combinations.byParams(memoParams)],
      queryFn: () => combinationApi.getCombinations(memoParams),
      enabled: params.serviceIds && params.serviceIds?.length > 1,
    });

    utils.useSetPendingApi(isPending);

    if (combinationsData?.status === ApiStatus.SUCCESS && combinationsData.data) {
      return combinationsData.data;
    }

    return null;
  },
  useGetPublicCombinations: (params: GetCombinationsQueryParams) => {
    const memoParams = useMemo<GetCombinationsQueryParams>(
      () => ({
        serviceIds: params.serviceIds,
        masterIds: params.masterIds,
        isActive: params.isActive,
      }),
      [params],
    );

    const { data: combinationsData, isPending } = useQuery<
      BaseResponse<GetCombinationsResponse>,
      Error
    >({
      queryKey: [queryKeys.combinations.public, queryKeys.combinations.byParams(memoParams)],
      queryFn: () => combinationApi.getPublicCombinations(memoParams),
      enabled: params.serviceIds && params.serviceIds?.length > 1,
    });

    utils.useSetPendingApi(isPending);

    if (combinationsData?.status === ApiStatus.SUCCESS && combinationsData.data) {
      return combinationsData.data;
    }

    return null;
  },
  useDeleteCombination: () => {
    const queryClient = useQueryClient();

    const deleteCombinationMutation = useMutation({
      mutationFn: (id: number) => combinationApi.deleteCombination(id),
      onSuccess: (_, deletedId) => {
        queryClient.setQueriesData<InfiniteData<BaseResponse<GetCombinationsResponse>>>(
          {
            predicate: (query) =>
              query.queryKey[0] === 'combinations' && query.queryKey[1] === 'list',
          },
          (oldData) => {
            if (!oldData) return oldData;

            const newPages = oldData.pages.map((page) => {
              if (page.status !== ApiStatus.SUCCESS || !page.data) {
                return page;
              }
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

    utils.useSetPendingApi(deleteCombinationMutation.isPending);

    return {
      deleteCombinationMutation,
      deleteCombinationMutationAsync: deleteCombinationMutation.mutateAsync,
    };
  },
  useCreateCombinationForm: ({ onSuccess, onError }: UseCreateCombinationFormParams) => {
    const queryClient = useQueryClient();

    const {
      register,
      control,
      handleSubmit,
      watch,
      setValue,
      formState: { errors, isDirty },
    } = useForm<CreateCombinationFormData>({
      resolver: yupResolver(createCombinationSchema),
      mode: 'onSubmit',
      defaultValues: {
        name: '',
        durationMinutes: 15,
        masterIds: [],
        serviceIds: [],
        isActive: false,
      },
    });

    const { mutate: createCombination, isPending } = useMutation<
      BaseResponse<Combination>,
      ErrorResponse,
      CreateCombinationRequest
    >({
      mutationFn: combinationApi.createCombination,
      onSuccess: (response) => {
        if (response.status === ApiStatus.SUCCESS) {
          queryClient.invalidateQueries({
            queryKey: queryKeys.combinations.all,
          });
          onSuccess?.();
        }
      },
      onError: (error) => {
        onError?.(error);
      },
    });

    utils.useSetPendingApi(isPending);

    return {
      register,
      control,
      handleSubmit: handleSubmit(
        utils.submitAdapter<CreateCombinationRequest, CreateCombinationFormData>(createCombination),
      ),
      isDirty,
      errors,
      watch,
      setValue,
      isPending,
    };
  },
  useUpdateCombinationForm: ({
    onSuccess,
    onError,
    defaultValue,
  }: UseUpdateCombinationFormParams) => {
    const queryClient = useQueryClient();

    const {
      register,
      control,
      handleSubmit,
      watch,
      setValue,
      formState: { errors, isDirty },
    } = useForm<UpdateCombinationFormData>({
      resolver: yupResolver(updateCombinationSchema),
      mode: 'onSubmit',
      defaultValues: {
        name: defaultValue.name,
        durationMinutes: defaultValue.durationMinutes,
        masterIds: defaultValue.masters.map((m) => m.id),
        serviceIds: defaultValue.services.map((s) => s.id),
        isActive: defaultValue.isActive,
      },
    });

    const { mutate: updateCombination, isPending } = useMutation<
      BaseResponse<Combination>,
      ErrorResponse,
      UpdateCombinationRequest
    >({
      mutationFn: (data) => combinationApi.updateCombination(defaultValue.id, data),
      onSuccess: (response) => {
        if (response.status === ApiStatus.SUCCESS) {
          queryClient.invalidateQueries({
            queryKey: queryKeys.combinations.all,
          });
          onSuccess?.();
        }
      },
      onError: (error) => {
        onError?.(error);
      },
    });

    utils.useSetPendingApi(isPending);

    return {
      register,
      control,
      handleSubmit: handleSubmit(
        utils.submitAdapter<UpdateCombinationRequest, UpdateCombinationFormData>(updateCombination),
      ),
      errors,
      isDirty,
      watch,
      setValue,
      isPending,
    };
  },
};
