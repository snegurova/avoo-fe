import { utils } from '@avoo/hooks/utils/utils';
import { calendarApi } from '@avoo/axios';

import { BaseResponse, GetCalendarResponse } from '@avoo/axios/types/apiTypes';
import { apiStatus } from '@avoo/hooks/types/apiTypes';
import { useQuery } from '@tanstack/react-query';

export const calendarHooks = {
  useGetCalendar: () => {
    const { data: calendarData, isPending } = useQuery<BaseResponse<GetCalendarResponse>, Error>({
      queryKey: ['calendar'],
      queryFn: calendarApi.getCalendar,
    });

    utils.useSetPendingApi(isPending);

    if (calendarData?.status === apiStatus.SUCCESS && calendarData.data) {
      return calendarData.data;
    }

    return null;
  },
};
