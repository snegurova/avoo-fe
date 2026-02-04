import {
  BaseResponse,
  Order,
  PrivateOrderQueryParams,
  UpdateOrderStatusRequest,
  CreatePrivateOrdersRequest,
  UpdateOrderRequest,
} from '@avoo/axios/types/apiTypes';
import { apiClient } from '@avoo/axios/src/apiClient';

const ORDER_ENDPOINT = '/orders';

export const orderApi = {
  async getOrders(params: PrivateOrderQueryParams) {
    const res = await apiClient.get<BaseResponse<Order[]>>(ORDER_ENDPOINT, { params });
    return res.data;
  },
  async updateOrder(id: number, data: UpdateOrderRequest) {
    const res = await apiClient.patch<BaseResponse<Order>>(`${ORDER_ENDPOINT}/${id}`, data);
    return res.data;
  },
  async updateOrderStatus(id: number, data: UpdateOrderStatusRequest) {
    const res = await apiClient.patch<BaseResponse<Order>>(`${ORDER_ENDPOINT}/${id}/status`, data);
    return res.data;
  },
  async createOrder(data: CreatePrivateOrdersRequest) {
    const res = await apiClient.post<BaseResponse<Order[]>>(ORDER_ENDPOINT, data);
    return res.data;
  },
  async getOrderById(id: number) {
    const res = await apiClient.get<BaseResponse<Order>>(`${ORDER_ENDPOINT}/${id}`);
    return res.data;
  },
};
