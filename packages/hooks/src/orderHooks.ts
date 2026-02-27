import { orderApi } from '@avoo/axios';
import { utils } from '@avoo/hooks/utils/utils';
import {
  CreatePrivateOrdersRequest,
  UpdateOrderStatusRequest,
  PrivateOrderQueryParams,
  UpdateOrderRequest,
  Order,
  BaseResponse,
  Service,
  Combination,
  ApiStatus,
  CreateCustomerRequest,
  FindCustomerRequest,
} from '@avoo/axios/types/apiTypes';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { queryKeys } from './queryKeys';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  createPrivateOrdersSchema,
  updateOrderStatusSchema,
  updateOrderSchema,
  CreatePrivateOrdersData,
  UpdateOrderStatusData,
  UpdateOrderData,
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



function mapCustomer(
  data: CreatePrivateOrdersData['customerData']
): CreateCustomerRequest | FindCustomerRequest {
  if (!data) {
    throw new Error('Customer data is required');
  }

  if (data.id) {
    return { id: data.id };
  }

  if (!data.phone) {
    throw new Error('Phone is required for new customer');
  }

  return {
    id: data.id ?? undefined,
    name: data.name,
    phone: data.phone,
    email: data.email,
    notes: data.notes,
    isNotificationEnable: true,
  };
}
export const orderHooks = {
  useGetOrders: (params: PrivateOrderQueryParams) => {
    const { data: ordersData, isPending } = useQuery<BaseResponse<Order[]>, Error>({
      queryKey: ['orders', queryKeys.orders.byParams(params)],
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

    const { mutate: createOrder, isPending } = useMutation<
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
      handleSubmit: handleSubmit((formData) => {
        const payload: CreatePrivateOrdersRequest = {
          ordersData: formData.ordersData.map(o => ({
            ...o,
            masterId: o.masterId,
            date: o.date,
            type: o.type!,
          })),
          customerData: mapCustomer(formData.customerData),
        };

        createOrder(payload);
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
