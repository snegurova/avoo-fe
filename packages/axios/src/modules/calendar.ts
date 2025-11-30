import { BaseResponse, GetCalendarResponse } from '@avoo/axios/types/apiTypes';
import { apiClient } from '@avoo/axios/src/apiClient';

const GET_CALENDAR_ENDPOINT = '/calendar';

export const calendarApi = {
  async getCalendar() {
    const res = await apiClient.get<BaseResponse<GetCalendarResponse>>(GET_CALENDAR_ENDPOINT);
    return res.data;
  },
};
