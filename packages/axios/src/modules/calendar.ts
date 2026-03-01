import {
  BaseResponse,
  GetCalendarResponse,
  GetPublicCalendarResponse,
  GetCalendarByDatesResponse,
  GetPublicCalendarByDatesResponse,
  PrivateCalendarQueryParams,
  PrivateCalendarByDatesQueryParams,
  PublicCalendarQueryParams,
  PublicCalendarByDatesQueryParams,
} from '@avoo/axios/types/apiTypes';
import { apiClient } from '@avoo/axios/src/apiClient';

const GET_CALENDAR_ENDPOINT = '/calendar';
const GET_PUBLIC_CALENDAR_ENDPOINT = '/public/calendar';

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
  async getPublicCalendar(params: PublicCalendarQueryParams) {
    const res = await apiClient.get<BaseResponse<GetPublicCalendarResponse>>(
      GET_PUBLIC_CALENDAR_ENDPOINT,
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
  async getPublicCalendarByDates(params: PublicCalendarByDatesQueryParams) {
    const res = await apiClient.get<BaseResponse<GetPublicCalendarByDatesResponse>>(
      `${GET_PUBLIC_CALENDAR_ENDPOINT}/by-dates`,
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
