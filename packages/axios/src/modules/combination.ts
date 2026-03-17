import { apiClient } from '@avoo/axios';
import {
  BaseResponse,
  Combination,
  CreateCombinationRequest,
  GetCombinationsQueryParams,
  GetCombinationsResponse,
  UpdateCombinationRequest,
  UpdateCombinationResponse,
} from '@avoo/axios/types/apiTypes';

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
  async deleteCombination(id: number) {
    const res = await apiClient.delete<BaseResponse<Record<string, never>>>(
      `${COMBINATION_ENDPOINT}/${id.toString()}`,
    );
    return res.data;
  },
  async updateCombination(id: number, data: UpdateCombinationRequest) {
    const res = await apiClient.put<BaseResponse<UpdateCombinationResponse>>(
      `${COMBINATION_ENDPOINT}/${id.toString()}`,
      data,
    );
    return res.data;
  },
  async createCombination(data: CreateCombinationRequest) {
    const res = await apiClient.post<BaseResponse<Combination>>(COMBINATION_ENDPOINT, data);
    return res.data;
  },
};
