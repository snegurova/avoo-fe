import { utils } from '@avoo/hooks/utils/utils';
import { scheduleApi } from '@avoo/axios';

import { BaseResponse, GetSchedulesResponse } from '@avoo/axios/types/apiTypes';
import { apiStatus } from '@avoo/hooks/constants/constants';
import { useQuery } from '@tanstack/react-query';

export const scheduleHooks = {
  useGetSchedules: () => {
    const { data: schedulesData, isPending } = useQuery<
      BaseResponse<GetSchedulesResponse>,
      Error
    >({
      queryKey: ['schedules'],
      queryFn: scheduleApi.getSchedules,
    });

    utils.useSetPendingApi(isPending);

    if (schedulesData?.status === apiStatus.SUCCESS && schedulesData.data) {
      return schedulesData.data;
    }

  },
};
