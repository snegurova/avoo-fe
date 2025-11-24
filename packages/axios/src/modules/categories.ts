import { Category, BaseResponse } from '@avoo/axios/types/apiTypes';
import { apiClient } from '@avoo/axios/src/apiClient';

const CATEGORIES_ENDPOINT = '/public/categories';

export const categoriesApi = {
  async getAll() {
    const response = await apiClient.get<BaseResponse<Category[]>>(CATEGORIES_ENDPOINT);
    return response.data.data ?? null;
  },
};
