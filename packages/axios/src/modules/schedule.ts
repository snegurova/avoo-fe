import { BaseResponse, GetSchedulesResponse } from '@avoo/axios/types/apiTypes';
import { apiClient } from '@avoo/axios/src/apiClient';

const GET_SCHEDULES_ENDPOINT = '/schedules';

export const scheduleApi = {
  async getSchedules() {
    const response =
      await apiClient.get<BaseResponse<GetSchedulesResponse>>(
        GET_SCHEDULES_ENDPOINT,
      );
    return response.data;
  },
};
