import { utils } from '@avoo/hooks/utils/utils';
import { customerApi } from '@avoo/axios';
import {
  BaseResponse,
  CustomerInfoResponse,
  CreateCustomerRequest,
} from '@avoo/axios/types/apiTypes';
import { queryKeys } from './queryKeys';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { apiStatus } from '@avoo/hooks/types/apiTypes';

export const customerHooks = {
  useGetCustomers: () => {
    const { data: customersData, isPending } = useQuery<
      BaseResponse<CustomerInfoResponse[]>,
      Error
    >({
      queryKey: queryKeys.customers.all,
      queryFn: customerApi.getCustomers,
    });

    utils.useSetPendingApi(isPending);

    if (
      (customersData?.status ?? '').toString().toLowerCase() === apiStatus.SUCCESS &&
      customersData.data
    ) {
      return customersData.data;
    }

    return null;
  },

  useGetCustomerById: (id?: number | null) => {
    const queryClient = useQueryClient();

    const { data: customerData, isPending } = useQuery<
      BaseResponse<CustomerInfoResponse> | null,
      Error
    >({
      queryKey: ['customer', id],
      queryFn: async () => {
        if (!id) return Promise.resolve(null);

        const cached = queryClient.getQueryData<BaseResponse<CustomerInfoResponse[]>>(
          queryKeys.customers.all,
        );
        const maybeList = cached && (cached.data as CustomerInfoResponse[] | undefined);
        if (maybeList && Array.isArray(maybeList)) {
          const found = maybeList.find((c) => c.id === id);
          if (found)
            return { status: apiStatus.SUCCESS, data: found } as BaseResponse<CustomerInfoResponse>;
        }

        const listResp = await customerApi.getCustomers().catch(() => null);
        if (listResp && Array.isArray(listResp.data)) {
          const found = listResp.data.find((customer: { id: number }) => customer.id === id);
          if (found)
            return { status: apiStatus.SUCCESS, data: found } as BaseResponse<CustomerInfoResponse>;
        }

        return Promise.resolve(null);
      },
      enabled: !!id,
    });

    utils.useSetPendingApi(isPending);

    if (
      (customerData?.status ?? '').toString().toLowerCase() === apiStatus.SUCCESS &&
      customerData.data
    ) {
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
      if (!searchQuery || !searchQuery.trim()) return customers;

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
