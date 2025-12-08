import { BaseResponse, GetCalendarResponse } from '@avoo/axios/types/apiTypes';
import { apiClient } from '@avoo/axios/src/apiClient';
import { PrivateCalendarQueryParams } from '@avoo/axios/types/apiTypes';

const GET_CALENDAR_ENDPOINT = '/calendar';

export const calendarApi = {
  async getCalendar(params: PrivateCalendarQueryParams) {
    const res = await apiClient.get<BaseResponse<GetCalendarResponse>>(GET_CALENDAR_ENDPOINT, {
      params,
    });
    return res.data;
  },
};
