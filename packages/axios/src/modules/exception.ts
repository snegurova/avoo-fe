import {
  BaseResponse,
  GetExceptionsResponse,
  CreateExceptionRequest,
  CreateExceptionResponse,
  GetExceptionsQueryParams,
  Exception,
} from '@avoo/axios/types/apiTypes';
import { apiClient } from '@avoo/axios/src/apiClient';

const EXCEPTIONS_ENDPOINT = '/calendar-exceptions';

export const exceptionApi = {
  async getExceptions(params?: GetExceptionsQueryParams) {
    const res = await apiClient.get<BaseResponse<GetExceptionsResponse>>(EXCEPTIONS_ENDPOINT, {
      params,
    });
    return res.data;
  },

  async createException(data: CreateExceptionRequest) {
    const res = await apiClient.post<BaseResponse<CreateExceptionResponse>>(
      EXCEPTIONS_ENDPOINT,
      data,
    );
    return res.data;
  },

  async deleteException(id: number) {
    const res = await apiClient.delete<BaseResponse<Exception>>(`${EXCEPTIONS_ENDPOINT}/${id}`);
    return res.data;
  },

  async updateException(id: number, data: CreateExceptionRequest) {
    const res = await apiClient.put<BaseResponse<Exception>>(`${EXCEPTIONS_ENDPOINT}/${id}`, data);
    return res.data;
  },
};
