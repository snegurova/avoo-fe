import { utils } from '@avoo/hooks/utils/utils';
import { calendarApi } from '@avoo/axios';
import { PrivateCalendarQueryParams } from '@avoo/axios/types/apiTypes';

import { BaseResponse, GetCalendarResponse } from '@avoo/axios/types/apiTypes';
import { apiStatus } from '@avoo/hooks/types/apiTypes';
import { useQuery } from '@tanstack/react-query';

export const calendarHooks = {
  useGetCalendar: (params: PrivateCalendarQueryParams) => {
    const { data: calendarData, isPending } = useQuery<BaseResponse<GetCalendarResponse>, Error>({
      queryKey: ['calendar', params],
      queryFn: () => calendarApi.getCalendar(params),
    });

    utils.useSetPendingApi(isPending);

    if (calendarData?.status === apiStatus.SUCCESS && calendarData.data) {
      return calendarData.data;
    }

    return null;
  },
};
