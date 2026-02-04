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
  async getCalendarByDates(params: PrivateCalendarByDatesQueryParams) {
    const res = await apiClient.get<BaseResponse<GetCalendarByDatesResponse>>(
      `${GET_CALENDAR_ENDPOINT}/by-dates`,
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
