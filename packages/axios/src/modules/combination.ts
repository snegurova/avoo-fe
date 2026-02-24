import { BaseResponse, GetCombinationsQueryParams, Combination } from '@avoo/axios/types/apiTypes';
import { apiClient } from '@avoo/axios/src/apiClient';

const COMBINATION_ENDPOINT = '/combinations';

export const combinationApi = {
  async getCombinations(params: GetCombinationsQueryParams) {
    const res = await apiClient.get<BaseResponse<Combination[]>>(COMBINATION_ENDPOINT, {
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
};
