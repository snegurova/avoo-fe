import { utils } from '@avoo/hooks/utils/utils';
import { customerApi } from '@avoo/axios';
import { BaseResponse } from '@avoo/axios/types/apiTypes';
import { queryKeys } from './queryKeys';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { components } from '@avoo/axios/types/generated';

type CustomerInfoDto = components['schemas']['CustomerInfoDto'];
type CreateCustomerDto = components['schemas']['CreateCustomerDto'];

export const customerHooks = {
  useGetCustomers: () => {
    const { data: customersData, isPending } = useQuery<BaseResponse<CustomerInfoDto[]>, Error>({
      queryKey: queryKeys.customers.all,
      queryFn: customerApi.getCustomers,
    });

    utils.useSetPendingApi(isPending);

    if (customersData && (customersData.status || '').toString().toUpperCase() === 'SUCCESS') {
      return customersData.data;
    }

    return null;
  },

  useGetCustomerById: (id?: number | null) => {
    const queryClient = useQueryClient();

    const { data: customerData, isPending } = useQuery<BaseResponse<CustomerInfoDto> | null, Error>(
      {
        queryKey: ['customer', id],
        queryFn: async () => {
          if (!id) return Promise.resolve(null);

          const cached = queryClient.getQueryData<BaseResponse<CustomerInfoDto[]>>(
            queryKeys.customers.all,
          );
          const maybeList = cached && (cached.data as CustomerInfoDto[] | undefined);
          if (maybeList && Array.isArray(maybeList)) {
            const found = maybeList.find((c) => c.id === id);
            if (found) return { status: 'SUCCESS', data: found } as BaseResponse<CustomerInfoDto>;
          }
        
          const listResp = await customerApi.getCustomers().catch(() => null);
          if (listResp && Array.isArray(listResp.data)) {
            const found = listResp.data.find((c) => c.id === id);
            if (found) return { status: 'SUCCESS', data: found } as BaseResponse<CustomerInfoDto>;
          }

          return Promise.resolve(null);
        },
        enabled: !!id,
      },
    );

    utils.useSetPendingApi(isPending);

    if (customerData && (customerData.status || '').toString().toUpperCase() === 'SUCCESS') {
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
    } = useMutation<BaseResponse<CustomerInfoDto>, Error, CreateCustomerDto>({
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
      BaseResponse<CustomerInfoDto>,
      Error,
      { id: number; body: Partial<CreateCustomerDto> }
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
};
