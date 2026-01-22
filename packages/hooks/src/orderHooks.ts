import { orderApi } from '@avoo/axios';
import { utils } from '@avoo/hooks/utils/utils';
import {
  CreatePrivateOrdersRequest,
  UpdateOrderStatusRequest,
  PrivateOrderQueryParams,
  Order,
  BaseResponse,
} from '@avoo/axios/types/apiTypes';
import { apiStatus } from '@avoo/hooks/types/apiTypes';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { queryKeys } from './queryKeys';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  createPrivateOrdersSchema,
  updateOrderStatusSchema,
  CreatePrivateOrdersData,
  UpdateOrderStatusData,
} from '../schemas/validationSchemas';

type useCreateOrdersFormParams = {
  onSuccess?: () => void;
};

type useUpdateOrderStatusParams = {
  id?: number;
  onSuccess?: () => void;
};

export const orderHooks = {
  useGetOrders: (params: PrivateOrderQueryParams) => {
    const memoParams = useMemo<PrivateOrderQueryParams>(
      () => ({
        ...params,
      }),
      [params],
    );

    const { data: ordersData, isPending } = useQuery<BaseResponse<Order[]>, Error>({
      queryKey: ['orders', queryKeys.orders.byParams(memoParams)],
      queryFn: () => orderApi.getOrders(memoParams),
    });

    utils.useSetPendingApi(isPending);

    if (ordersData?.status === apiStatus.SUCCESS && ordersData.data) {
      return ordersData.data;
    }

    return null;
  },
  useCreateOrders: ({ onSuccess }: useCreateOrdersFormParams = {}) => {
    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<CreatePrivateOrdersData>({
      resolver: yupResolver(createPrivateOrdersSchema),
      mode: 'onSubmit',
      defaultValues: {
        ordersData: [],
        customerData: {},
      },
    });

    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation<
      BaseResponse<Order[]>,
      Error,
      CreatePrivateOrdersRequest
    >({
      mutationFn: orderApi.createOrder,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
        onSuccess?.();
      },
    });

    utils.useSetPendingApi(isPending);

    return {
      control,
      handleSubmit: handleSubmit(utils.submitAdapter<CreatePrivateOrdersRequest>(mutate)),
      errors,
      isPending,
    };
  },
  useUpdateOrderStatus: ({ id, onSuccess }: useUpdateOrderStatusParams = {}) => {
    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<UpdateOrderStatusData>({
      resolver: yupResolver(updateOrderStatusSchema),
      mode: 'onSubmit',
      defaultValues: {
        status: 'PENDING',
      },
    });

    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation<BaseResponse<Order>, Error, UpdateOrderStatusRequest>(
      {
        mutationFn: (data: UpdateOrderStatusRequest) => orderApi.updateOrderStatus(id, data),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
          onSuccess?.();
        },
      },
    );

    utils.useSetPendingApi(isPending);

    return {
      control,
      handleSubmit: handleSubmit(utils.submitAdapter<UpdateOrderStatusRequest>(mutate)),
      errors,
      isPending,
    };
  },
};
