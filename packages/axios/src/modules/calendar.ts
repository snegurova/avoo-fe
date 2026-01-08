import {
  BaseResponse,
  GetCalendarResponse,
  GetCalendarByDatesResponse,
  PrivateCalendarQueryParams,
  PrivateCalendarByDatesQueryParams,
} from '@avoo/axios/types/apiTypes';
import { apiClient } from '@avoo/axios/src/apiClient';

const GET_CALENDAR_ENDPOINT = '/calendar';

export const calendarApi = {
  async getCalendar(params: PrivateCalendarQueryParams) {
    const res = await apiClient.get<BaseResponse<GetCalendarResponse>>(GET_CALENDAR_ENDPOINT, {
      params,
    });
    return res.data;
  },
  async getCalendarByDates(params: PrivateCalendarByDatesQueryParams) {
    const res = await apiClient.get<BaseResponse<GetCalendarByDatesResponse>>(
      `${GET_CALENDAR_ENDPOINT}/by-dates`,
      {
        params,
      },
    );
    return res.data;
  },
};
