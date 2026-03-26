import { apiClient } from '@avoo/axios';
import {
  BaseResponse,
  GetCategoriesResponse,
  GetPrivateCategoriesResponse,
  GetPublicServicesGroupedByCategoriesParams,
  GetPublicServicesGroupedByCategoriesResponse,
} from '@avoo/axios/types/apiTypes';

const CATEGORIES_ENDPOINT = '/public/categories';
const PRIVATE_CATEGORIES_ENDPOINT = '/services/group-by-categories';
const PUBLIC_CATEGORIES_ENDPOINT = '/public/services/group-by-categories';

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
  async getPublicForUser(params: GetPublicServicesGroupedByCategoriesParams) {
    const response = await apiClient.get<
      BaseResponse<GetPublicServicesGroupedByCategoriesResponse>
    >(PUBLIC_CATEGORIES_ENDPOINT, {
      params,
    });
    return response.data;
  },
};
