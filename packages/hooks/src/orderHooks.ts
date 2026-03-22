import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { orderApi } from '@avoo/axios';
import {
  ApiStatus,
  BaseResponse,
  Combination,
  CreatePrivateOrdersRequest,
  CreatePublicOrdersRequest,
  Order,
  PrivateOrderQueryParams,
  Service,
  UpdateOrderRequest,
  UpdateOrderStatusRequest,
} from '@avoo/axios/types/apiTypes';
import { OrderType } from '@avoo/hooks/types/orderType';
import { utils } from '@avoo/hooks/utils/utils';
import { timeUtils } from '@avoo/shared';

import {
  CreatePrivateOrdersData,
  createPrivateOrdersSchema,
  CreatePublicOrdersData,
  createPublicOrdersSchema,
  UpdateOrderData,
  updateOrderSchema,
  UpdateOrderStatusData,
  updateOrderStatusSchema,
} from '../schemas/validationSchemas';
import { OrderStatus } from '../types/orderStatus';
import { queryKeys } from './queryKeys';

function convertOrdersDataDatesToUTC<T extends { ordersData?: { date: string }[] }>(data: T): T {
  if (Array.isArray(data.ordersData)) {
    return {
      ...data,
      ordersData: data.ordersData.map((item) => ({
        ...item,
        date: timeUtils.convertLocalToUTC(item.date),
      })),
    };
  }
  return data;
}

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
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: queryKeys.calendar.all }),
          queryClient.invalidateQueries({ queryKey: queryKeys.monthCalendar.all }),
          queryClient.invalidateQueries({ queryKey: queryKeys.orders.all }),
          queryClient.invalidateQueries({ queryKey: queryKeys.customers.all }),
        ]);

        onSuccess?.();
      },
    });

    utils.useSetPendingApi(isPending);

    return {
      control,
      handleSubmit: handleSubmit((formData) => {
        const dataWithUTC = convertOrdersDataDatesToUTC(formData);
        utils.submitAdapter<CreatePrivateOrdersRequest, CreatePrivateOrdersData>(mutate)(
          dataWithUTC,
        );
      }),
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
      handleSubmit: handleSubmit((formData) => {
        const dataWithUTC = convertOrdersDataDatesToUTC(formData);
        utils.submitAdapter<CreatePublicOrdersRequest, CreatePublicOrdersData>(mutate)(dataWithUTC);
      }),
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
      handleSubmit: handleSubmit(
        utils.submitAdapter<UpdateOrderStatusRequest, UpdateOrderStatusData>(mutate),
      ),
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

  useGetCustomerOrderHistory: (customerId?: number | null, limit = 10) => {
    type CustomerHistoryData = Order[] | { items: Order[] };

    const hasItemsArray = (value: unknown): value is { items: Order[] } =>
      typeof value === 'object' && value !== null && 'items' in value && Array.isArray(value.items);

    const params = useMemo<PrivateOrderQueryParams>(
      () => ({
        page: 1,
        limit,
        customerId: customerId ?? undefined,
      }),
      [customerId, limit],
    );

    const { data: ordersData, isPending } = useQuery<BaseResponse<CustomerHistoryData>, Error>({
      queryKey: ['orders', 'customer-history', queryKeys.orders.byParams(params)],
      queryFn: () => orderApi.getOrders(params),
      enabled: !!customerId,
    });

    utils.useSetPendingApi(isPending);

    if (ordersData?.status === ApiStatus.SUCCESS) {
      if (Array.isArray(ordersData.data)) {
        return ordersData.data;
      }

      if (hasItemsArray(ordersData.data)) {
        return ordersData.data.items;
      }
    }

    return [];
  },

  useCustomerOrdersHistory: (customerId?: number | null) => {
    const orders = orderHooks.useGetCustomerOrderHistory(customerId, 50);

    return useMemo(() => {
      const now = Date.now();
      const upcomingStatuses = new Set([OrderStatus.PENDING, OrderStatus.CONFIRMED]);
      const sorted = [...orders].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      );

      return {
        nextAppointments: sorted.filter((o) => {
          const t = new Date(o.date).getTime();
          return Number.isFinite(t) && t >= now && upcomingStatuses.has(o.status);
        }),
        historyItems: sorted
          .filter((o) => {
            const t = new Date(o.date).getTime();
            return Number.isFinite(t) && t < now && o.status === OrderStatus.COMPLETED;
          })
          .reverse(),
      };
    }, [orders]);
  },
};
