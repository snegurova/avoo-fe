import { utils } from '@avoo/hooks/utils/utils';
import { customerApi } from '@avoo/axios';
import {
  BaseResponse,
  CustomerInfoResponse,
  CreateCustomerRequest,
  GetCustomersQueryParams,
  GetCustomersResponse,
  ApiStatus,
} from '@avoo/axios/types/apiTypes';
import { queryKeys } from './queryKeys';
import { useMutation, useQuery, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

export const customerHooks = {
  useGetCustomers: (params?: GetCustomersQueryParams) => {
    const memoParams = useMemo<GetCustomersQueryParams>(
      () => ({
        ...params,
      }),
      [params],
    );

    const { data: customersData, isPending, isSuccess } = useQuery<BaseResponse<GetCustomersResponse>, Error>({
      queryKey: ['customers', queryKeys.customers.byParams(memoParams)],
      queryFn: () => customerApi.getCustomers(memoParams),
    });

    utils.useSetPendingApi(isPending);

    if (isSuccess &&
      customersData.status === ApiStatus.SUCCESS) {
      return customersData.data;
    }

    return { pagination: null, items: [] };
  },
  useGetCustomersInfinite: (params?: GetCustomersQueryParams) => {
    const memoParams = useMemo<GetCustomersQueryParams>(
      () => ({
        ...params,
      }),
      [params],
    );

    const query = useInfiniteQuery<BaseResponse<GetCustomersResponse>, Error>({
      queryKey: ['customers', 'infinite', queryKeys.customers.byParams(memoParams)],
      queryFn: ({ pageParam = 1 }) =>
        customerApi.getCustomers({ ...memoParams, page: pageParam as number }),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        const { currentPage, total } = lastPage.data?.pagination || { currentPage: 0, total: 0 };
        return currentPage * (memoParams.limit ?? 10) < total ? currentPage + 1 : undefined;
      },
    });

    const isPending = query.isFetching;

    utils.useSetPendingApi(isPending);

    return query;
  },

  useGetCustomerById: (id?: number | null) => {
    if (!id) return null;

    const queryClient = useQueryClient();

    const { data: customerData, isPending, isSuccess } = useQuery<
      BaseResponse<CustomerInfoResponse> | null,
      Error
    >({
      queryKey: ['customer', id],
      queryFn: async () => {

        const cached = queryClient.getQueryData<BaseResponse<CustomerInfoResponse[]>>(
          queryKeys.customers.all,
        );
        const maybeList = cached?.data;
        if (maybeList && Array.isArray(maybeList)) {
          const found = maybeList.find((c) => c.id === id);
          if (found) {
            const result: BaseResponse<CustomerInfoResponse> = {
              status: ApiStatus.SUCCESS,
              data: found,
            };
            return result;
          }
        }

        const listResp = await customerApi.getCustomers({}).catch(() => null);
        if (listResp && Array.isArray(listResp.data)) {
          const found = listResp.data.find((customer: { id: number }) => customer.id === id);
          if (found) {
            const result: BaseResponse<CustomerInfoResponse> = {
              status: ApiStatus.SUCCESS,
              data: found,
            };
            return result;
          }
        }

        return null;
      },
      enabled: !!id,
    });

    utils.useSetPendingApi(isPending);

    if (isSuccess && !!customerData &&
      customerData.status === ApiStatus.SUCCESS) {
      return customerData.data;
    }

    return null;
  },

  useCreateCustomer: () => {
    const queryClient = useQueryClient();
    const {
      mutate: createCustomer,
      mutateAsync: createCustomerAsync,
      isPending,
    } = useMutation<BaseResponse<CustomerInfoResponse>, Error, CreateCustomerRequest>({
      mutationFn: (payload) => customerApi.createCustomer(payload),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.customers.all });
      },
    });

    utils.useSetPendingApi(isPending);
    return { createCustomer, createCustomerAsync, isPending };
  },

  useUpdateCustomer: () => {
    const queryClient = useQueryClient();
    const {
      mutate: updateCustomer,
      mutateAsync: updateCustomerAsync,
      isPending,
    } = useMutation<
      BaseResponse<CustomerInfoResponse>,
      Error,
      { id: number; body: Partial<CreateCustomerRequest> }
    >({
      mutationFn: ({ id, body }) => customerApi.updateCustomer(id, body),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.customers.all });
      },
    });

    utils.useSetPendingApi(isPending);
    return { updateCustomer, updateCustomerAsync, isPending };
  },

  useDeleteCustomer: () => {
    const queryClient = useQueryClient();
    const {
      mutate: deleteCustomer,
      mutateAsync: deleteCustomerAsync,
      isPending,
    } = useMutation<BaseResponse<null>, Error, number>({
      mutationFn: (id) => customerApi.deleteCustomer(id),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.customers.all }),
    });

    utils.useSetPendingApi(isPending);
    return { deleteCustomer, deleteCustomerAsync, isPending };
  },
  useFilterCustomers: (customers: CustomerInfoResponse[] | null, searchQuery: string) => {
    return useMemo(() => {
      if (!customers) return [];
      if (!searchQuery?.trim()) return customers;

      const query = searchQuery.toLowerCase();
      return customers.filter((customer) => {
        const name = (customer.name || '').toLowerCase();
        const phone = (customer.phone || '').toLowerCase();
        const email = (customer.email || '').toLowerCase();
        return name.includes(query) || phone.includes(query) || email.includes(query);
      });
    }, [customers, searchQuery]);
  },
};
