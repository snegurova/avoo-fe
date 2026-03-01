import { orderApi } from '@avoo/axios';
import { utils } from '@avoo/hooks/utils/utils';
import {
  CreatePrivateOrdersRequest,
  CreatePublicOrdersRequest,
  UpdateOrderStatusRequest,
  PrivateOrderQueryParams,
  UpdateOrderRequest,
  Order,
  BaseResponse,
  Service,
  Combination,
  ApiStatus,
} from '@avoo/axios/types/apiTypes';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { queryKeys } from './queryKeys';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  createPrivateOrdersSchema,
  updateOrderStatusSchema,
  updateOrderSchema,
  CreatePrivateOrdersData,
  CreatePublicOrdersData,
  UpdateOrderStatusData,
  UpdateOrderData,
  createPublicOrdersSchema,
} from '../schemas/validationSchemas';
import { OrderType } from '@avoo/hooks/types/orderType';
import { OrderStatus } from '../types/orderStatus';
import { timeUtils } from '@avoo/shared';

type UseCreateOrderFormParams = {
  order: {
    masterId?: number;
    date?: string;
  };
  onSuccess?: () => void;
};

type UseUpdateOrderParams = {
  id: number;
  order: UpdateOrderRequest;
  onSuccess?: () => void;
};

export const orderHooks = {
  useGetOrders: (params: PrivateOrderQueryParams) => {
    const memoParams = useMemo<PrivateOrderQueryParams>(
      () => ({
        page: params.page,
        limit: params.limit,
        status: params.status,
        customerId: params.customerId,
        masterId: params.masterId,
      }),
      [params],
    );

    const { data: ordersData, isPending } = useQuery<BaseResponse<Order[]>, Error>({
      queryKey: ['orders', queryKeys.orders.byParams(memoParams)],
      queryFn: () => orderApi.getOrders(params),
    });

    utils.useSetPendingApi(isPending);

    if (ordersData?.status === ApiStatus.SUCCESS && ordersData.data) {
      return ordersData.data;
    }

    return null;
  },
  useCreateOrder: ({ order, onSuccess }: UseCreateOrderFormParams) => {
    const [selectedServices, setSelectedServices] = useState<(Service | null)[]>([null]);
    const [selectedCombinations, setSelectedCombinations] = useState<Combination[]>([]);
    const {
      control,
      handleSubmit,
      getValues,
      formState: { errors },
    } = useForm<CreatePrivateOrdersData>({
      resolver: yupResolver(createPrivateOrdersSchema),
      context: {
        services: selectedServices ?? [],
        combinations: selectedCombinations ?? [],
      },
      mode: 'onSubmit',
      defaultValues: {
        ordersData: [
          {
            masterId: order.masterId ?? undefined,
            date: order.date ?? timeUtils.convertDateToRoundedString(new Date()),
            type: OrderType.Service,
          },
        ],
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
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: [
            queryKeys.orders.all,
            queryKeys.orders.byParams,
            queryKeys.customers.all,
            queryKeys.customers.byParams,
            queryKeys.calendar.all,
            queryKeys.calendar.byParams,
            queryKeys.monthCalendar.all,
            queryKeys.monthCalendar.byParams,
          ],
        });
        onSuccess?.();
      },
    });

    utils.useSetPendingApi(isPending);

    return {
      control,
      handleSubmit: handleSubmit(utils.submitAdapter<CreatePrivateOrdersRequest>(mutate)),
      getValues,
      errors,
      isPending,
      selectedServices,
      setSelectedServices,
      selectedCombinations,
      setSelectedCombinations,
    };
  },
  useCreatePublicOrder: ({ onSuccess, userId }: { onSuccess?: () => void; userId: number }) => {
    const [selectedServices, setSelectedServices] = useState<(Service | null)[]>([null]);
    const [selectedCombinations, setSelectedCombinations] = useState<Combination[]>([]);
    const {
      control,
      handleSubmit,
      getValues,
      formState: { errors },
    } = useForm<CreatePublicOrdersData>({
      resolver: yupResolver(createPublicOrdersSchema),
      context: {
        services: selectedServices ?? [],
        combinations: selectedCombinations ?? [],
      },
      mode: 'onSubmit',
      defaultValues: {
        ordersData: [
          {
            type: OrderType.Service,
            date: timeUtils.convertDateToRoundedString(new Date()),
          },
        ],
        customerData: {
          name: '',
          phone: '',
          email: '',
        },
        userId,
      },
    });

    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation<
      BaseResponse<Order[]>,
      Error,
      CreatePublicOrdersRequest
    >({
      mutationFn: orderApi.createPublicOrder,
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: [
            queryKeys.orders.all,
            queryKeys.orders.byParams,
            queryKeys.customers.all,
            queryKeys.customers.byParams,
            queryKeys.calendar.all,
            queryKeys.calendar.byParams,
            queryKeys.monthCalendar.all,
            queryKeys.monthCalendar.byParams,
          ],
        });
        onSuccess?.();
      },
    });

    utils.useSetPendingApi(isPending);

    return {
      control,
      handleSubmit: handleSubmit(utils.submitAdapter<CreatePublicOrdersRequest>(mutate)),
      getValues,
      errors,
      isPending,
      selectedServices,
      setSelectedServices,
      selectedCombinations,
      setSelectedCombinations,
    };
  },
  useUpdateOrder: ({ id, order, onSuccess }: UseUpdateOrderParams) => {
    const {
      control,
      handleSubmit,
      formState: { errors },
      setValue,
      getValues,
    } = useForm<UpdateOrderData>({
      resolver: yupResolver(updateOrderSchema),
      mode: 'onSubmit',
      defaultValues: { ...order },
    });

    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation<BaseResponse<Order>, Error, UpdateOrderRequest>({
      mutationFn: (data: UpdateOrderRequest) => orderApi.updateOrder(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
        onSuccess?.();
      },
    });

    utils.useSetPendingApi(isPending);

    return {
      control,
      handleSubmit: handleSubmit((data) => {
        const cleanedData: UpdateOrderRequest = {
          ...data,
          masterId: data.masterId ?? undefined,
        };

        mutate(cleanedData);
      }),
      errors,
      isPending,
      setValue,
      getValues,
    };
  },
  useUpdateOrderStatus: ({ id, onSuccess }: UseUpdateOrderParams) => {
    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<UpdateOrderStatusData>({
      resolver: yupResolver(updateOrderStatusSchema),
      mode: 'onSubmit',
      defaultValues: {
        status: OrderStatus.PENDING,
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
  useGetOrderById: (id: number) => {
    const {
      data: orderData,
      isPending,
      refetch,
    } = useQuery<BaseResponse<Order>, Error>({
      queryKey: ['order', queryKeys.orders.byId(id)],
      queryFn: () => orderApi.getOrderById(id),
    });
    utils.useSetPendingApi(isPending);

    if (orderData?.status === ApiStatus.SUCCESS && orderData.data) {
      return { data: orderData.data, refetch };
    }
    return { data: null, refetch };
  },
};
