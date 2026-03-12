import { apiClient } from '@avoo/axios';
import {
  BaseResponse,
  GetCategoriesResponse,
  GetPrivateCategoriesResponse,
} from '@avoo/axios/types/apiTypes';

const CATEGORIES_ENDPOINT = '/public/categories';
const PRIVATE_CATEGORIES_ENDPOINT = '/services/group-by-categories';

export const categoriesApi = {
  async getPublicAll() {
    const response = await apiClient.get<BaseResponse<GetCategoriesResponse>>(CATEGORIES_ENDPOINT);
    return response.data;
  },

  async getPrivateAll(search: string) {
    const response = await apiClient.get<BaseResponse<GetPrivateCategoriesResponse>>(
      PRIVATE_CATEGORIES_ENDPOINT,
      {
        params: {
          search,
        },
      },
    );
    return response.data;
  },
};
