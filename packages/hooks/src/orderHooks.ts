import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { orderApi } from '@avoo/axios';
import {
  ApiStatus,
  BaseResponse,
  Combination,
  CreatePrivateOrdersRequest,
  CreatePublicOrdersRequest,
  GetOrdersResponse,
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

function normalizeOrdersData(data: unknown): Order[] {
  if (Array.isArray(data)) {
    return data;
  }

  if (
    typeof data === 'object' &&
    data !== null &&
    'items' in data &&
    Array.isArray((data as { items?: unknown }).items)
  ) {
    return (data as { items: Order[] }).items;
  }

  return [];
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

const DEFAULT_LIMIT = 10;

export const orderHooks = {
  useGetOrdersInfinite: ({ limit = DEFAULT_LIMIT }: PrivateOrderQueryParams) => {
    const filterParams = { limit };
    const query = useInfiniteQuery<BaseResponse<GetOrdersResponse>, Error>({
      queryKey: ['orders', 'list', filterParams],
      queryFn: ({ pageParam = 1 }) =>
        orderApi.getOrders({ ...filterParams, page: pageParam as number }),
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
  useOrderQuery() {
    const [params, setParams] = useState<PrivateOrderQueryParams>({
      limit: DEFAULT_LIMIT,
    });

    const setOrderStatus = () => {
      setParams((prev) => ({
        ...prev,
      }));
    };

    const queryParams = useMemo(
      () => ({
        limit: params.limit,
        status: params.status,
      }),
      [params.limit, params.status],
    );

    return {
      params,
      setOrderStatus,
      queryParams,
    };
  },
  useCreateOrder: ({ order, onSuccess }: UseCreateOrderFormParams) => {
    const [selectedServices, setSelectedServices] = useState<(Service | null)[]>([null]);
    const [selectedCombinations, setSelectedCombinations] = useState<Combination[]>([]);
    const {
      control,
      handleSubmit,
      getValues,
      setValue,
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
      setValue,
    };
  },
  useCreatePublicOrder: ({ onSuccess, userId }: { onSuccess?: () => void; userId: number }) => {
    const [selectedServices, setSelectedServices] = useState<(Service | null)[]>([null]);
    const [selectedCombinations, setSelectedCombinations] = useState<Combination[]>([]);
    const {
      control,
      handleSubmit,
      getValues,
      setValue,
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
        utils.submitAdapter<CreatePublicOrdersRequest, CreatePublicOrdersData>(mutate)(dataWithUTC);
      }),
      getValues,
      errors,
      isPending,
      selectedServices,
      setSelectedServices,
      selectedCombinations,
      setSelectedCombinations,
      setValue,
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
    const params = useMemo<PrivateOrderQueryParams>(
      () => ({
        page: 1,
        limit,
        customerId: customerId ?? undefined,
      }),
      [customerId, limit],
    );

    const { data: ordersData, isPending } = useQuery<BaseResponse<unknown>, Error>({
      queryKey: ['orders', 'customer-history', queryKeys.orders.byParams(params)],
      queryFn: () => orderApi.getOrders(params),
      enabled: !!customerId,
    });

    utils.useSetPendingApi(isPending);

    if (ordersData?.status === ApiStatus.SUCCESS) {
      return normalizeOrdersData(ordersData.data);
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
  useUpcomingAppointmentsByMaster: (limit = 100) => {
    const pendingOrders = orderHooks.useGetOrders({
      page: 1,
      limit,
      status: OrderStatus.PENDING,
    });
    const confirmedOrders = orderHooks.useGetOrders({
      page: 1,
      limit,
      status: OrderStatus.CONFIRMED,
    });

    return useMemo(() => {
      const now = Date.now();
      const byId = new Map<number, Order>();

      [...(pendingOrders ?? []), ...(confirmedOrders ?? [])].forEach((order) => {
        byId.set(order.id, order);
      });

      const upcoming = Array.from(byId.values())
        .filter((order) => {
          const timestamp = new Date(order.date).getTime();
          return Number.isFinite(timestamp) && timestamp >= now;
        })
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      const byMaster = new Map<number, Order>();

      upcoming.forEach((order) => {
        if (!byMaster.has(order.master.id)) {
          byMaster.set(order.master.id, order);
        }
      });

      return Array.from(byMaster.values()).sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      );
    }, [confirmedOrders, pendingOrders]);
  },
};
