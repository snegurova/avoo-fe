import {
  BaseResponse,
  Order,
  PrivateOrderQueryParams,
  UpdateOrderStatusRequest,
  CreatePrivateOrdersRequest,
} from '@avoo/axios/types/apiTypes';
import { apiClient } from '@avoo/axios/src/apiClient';

const MASTER_ENDPOINT = '/orders';

export const orderApi = {
  async getOrders(params: PrivateOrderQueryParams) {
    const res = await apiClient.get<BaseResponse<Order[]>>(MASTER_ENDPOINT, { params });
    return res.data;
  },
  async updateOrderStatus(id: number, data: UpdateOrderStatusRequest) {
    const res = await apiClient.patch<BaseResponse<Order>>(`${MASTER_ENDPOINT}/${id}/status`, data);
    return res.data;
  },
  async createOrder(data: CreatePrivateOrdersRequest) {
    const res = await apiClient.post<BaseResponse<Order[]>>(MASTER_ENDPOINT, data);
    return res.data;
  },
};
