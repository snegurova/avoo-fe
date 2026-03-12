import { apiClient } from '@avoo/axios';
import {
  BaseResponse,
  CreateScheduleResponse,
  GetSchedulesResponse,
  ScheduleEntity,
  UpdateScheduleResponse,
} from '@avoo/axios/types/apiTypes';
import { QuerySchedules } from '@avoo/axios/types/apiTypes';
import {
  ScheduleCreateFormData,
  ScheduleUpdateFormData,
} from '@avoo/hooks/schemas/schedulesValidationSchemas';

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
    const response = await apiClient.put<BaseResponse<UpdateScheduleResponse>>(
      SCHEDULES_ENDPOINT + '/' + data.id.toString(),
      data,
    );
    return response.data;
  },
  async createSchedule(data: ScheduleCreateFormData) {
    const response = await apiClient.post<BaseResponse<CreateScheduleResponse>>(
      SCHEDULES_ENDPOINT,
      data,
    );
    return response.data;
  },
  async deleteSchedule(id: number) {
    const response = await apiClient.delete<BaseResponse<ScheduleEntity>>(
      `${SCHEDULES_ENDPOINT}/${id.toString()}`,
    );
    return response.data;
  },
};
