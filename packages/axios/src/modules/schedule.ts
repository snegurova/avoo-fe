import {
  BaseResponse,
  GetSchedulesResponse,
  ScheduleCreateResponse,
  ScheduleEntity,
  ScheduleUpdateResponse,
} from '@avoo/axios/types/apiTypes';
import { apiClient } from '@avoo/axios/src/apiClient';
import { ScheduleCreateFormData, ScheduleUpdateFormData } from '@avoo/hooks/schemas/schedulesValidationSchemas';

const GET_SCHEDULES_ENDPOINT = '/schedules';

export const scheduleApi = {
  async getSchedules() {
    const response =
      await apiClient.get<BaseResponse<GetSchedulesResponse>>(GET_SCHEDULES_ENDPOINT);
    return response.data;
  },
  async getScheduleById(id: number) {
    const response = await apiClient.get<BaseResponse<ScheduleEntity>>(
      GET_SCHEDULES_ENDPOINT + '/' + id.toString(),
    );
    return response.data;
  },
  async updateSchedule(data: ScheduleUpdateFormData) {
    const response = await apiClient.put<BaseResponse<ScheduleUpdateResponse>>(
      GET_SCHEDULES_ENDPOINT + '/' + data.id.toString(),
      data,
    );
    return response.data;
  },
  async createSchedule(data: ScheduleCreateFormData) {
    const response = await apiClient.post<BaseResponse<ScheduleCreateResponse>>(
      GET_SCHEDULES_ENDPOINT,
      data,
    );
    return response.data;
  },
};
