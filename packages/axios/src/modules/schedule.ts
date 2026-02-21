import {
  BaseResponse,
  GetSchedulesResponse,
  ScheduleCreateResponse,
  ScheduleEntity,
  ScheduleUpdateResponse,
} from '@avoo/axios/types/apiTypes';
import { apiClient } from '@avoo/axios/src/apiClient';
import {
  ScheduleCreateFormData,
  ScheduleUpdateFormData,
} from '@avoo/hooks/schemas/schedulesValidationSchemas';
import { QuerySchedules } from '@avoo/axios/types/apiTypes';

const SCHEDULES_ENDPOINT = '/schedules';

export const scheduleApi = {
  async getSchedules(params: QuerySchedules) {
    const response = await apiClient.get<BaseResponse<GetSchedulesResponse>>(SCHEDULES_ENDPOINT, {
      params,
    });
    return response.data;
  },
  async getScheduleById(id: number) {
    const response = await apiClient.get<BaseResponse<ScheduleEntity>>(
      SCHEDULES_ENDPOINT + '/' + id.toString(),
    );
    return response.data;
  },
  async updateSchedule(data: ScheduleUpdateFormData) {
    const response = await apiClient.put<BaseResponse<ScheduleUpdateResponse>>(
      SCHEDULES_ENDPOINT + '/' + data.id.toString(),
      data,
    );
    return response.data;
  },
  async createSchedule(data: ScheduleCreateFormData) {
    const response = await apiClient.post<BaseResponse<ScheduleCreateResponse>>(
      SCHEDULES_ENDPOINT,
      data,
    );
    return response.data;
  },
  async deleteSchedule(id: number) {
    const response = await apiClient.delete<BaseResponse<Record<string, never>>>(
      `${SCHEDULES_ENDPOINT}/${id.toString()}`,
    );
    return response.data;
  },
};
