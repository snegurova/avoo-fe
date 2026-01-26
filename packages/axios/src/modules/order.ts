import {
  BaseResponse,
  Order,
  PrivateOrderQueryParams,
  UpdateOrderStatusRequest,
  CreatePrivateOrdersRequest,
} from '@avoo/axios/types/apiTypes';
import { apiClient } from '@avoo/axios/src/apiClient';

const ORDER_ENDPOINT = '/orders';

export const orderApi = {
  async getOrders(params: PrivateOrderQueryParams) {
    const res = await apiClient.get<BaseResponse<Order[]>>(ORDER_ENDPOINT, { params });
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
};
