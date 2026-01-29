import { utils } from '@avoo/hooks/utils/utils';
import { scheduleApi } from '@avoo/axios';

import { BaseResponse, GetSchedulesResponse } from '@avoo/axios/types/apiTypes';
import { ApiStatus } from '@avoo/hooks/types/apiTypes';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';

export const scheduleHooks = {
  useGetSchedules: () => {
    const { data: schedulesData, isPending } = useQuery<BaseResponse<GetSchedulesResponse>, Error>({
      queryKey: queryKeys.schedules.all,
      queryFn: scheduleApi.getSchedules,
    });

    utils.useSetPendingApi(isPending);

    if (schedulesData?.status === ApiStatus.SUCCESS && schedulesData.data) {
      return schedulesData.data;
    }

    return null;
  },
};
