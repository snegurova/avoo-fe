import {
  BaseResponse,
  GetCombinationsQueryParams,
  GetCombinationsResponse,
} from '@avoo/axios/types/apiTypes';
import { apiClient } from '@avoo/axios/src/apiClient';

const COMBINATION_ENDPOINT = '/combinations';
const PUBLIC_COMBINATION_ENDPOINT = '/public/combinations';

export const combinationApi = {
  async getCombinations(params: GetCombinationsQueryParams) {
    const res = await apiClient.get<BaseResponse<GetCombinationsResponse>>(COMBINATION_ENDPOINT, {
      params,
      paramsSerializer: (params) => {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach((val) => {
              searchParams.append(key, String(val));
            });
          } else if (value !== undefined) {
            searchParams.append(key, String(value));
          }
        });
        return searchParams.toString();
      },
    });
    return res.data;
  },
  async getPublicCombinations(params: GetCombinationsQueryParams) {
    const res = await apiClient.get<BaseResponse<GetCombinationsResponse>>(
      PUBLIC_COMBINATION_ENDPOINT,
      {
        params,
        paramsSerializer: (params) => {
          const searchParams = new URLSearchParams();
          Object.entries(params).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              value.forEach((val) => {
                searchParams.append(key, String(val));
              });
            } else if (value !== undefined) {
              searchParams.append(key, String(value));
            }
          });
          return searchParams.toString();
        },
      },
    );
    return res.data;
  },
};
