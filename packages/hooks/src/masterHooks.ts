import { utils } from '@avoo/hooks/utils/utils';

import { masterApi } from '@avoo/axios';
import { useQuery } from '@tanstack/react-query';

import { BaseResponse, MasterWithRelationsEntityResponse } from '@avoo/axios/types/apiTypes';
import { apiStatus } from '@avoo/hooks/types/apiTypes';
import { queryKeys } from './queryKeys';

export const masterHooks = {
  useGetMastersProfileInfo: () => {
    const { data: profileInfoData, isPending } = useQuery<
      BaseResponse<MasterWithRelationsEntityResponse>,
      Error
    >({
      queryKey: queryKeys.masters.all,
      queryFn: masterApi.getMastersInfo,
    });

    utils.useSetPendingApi(isPending);

    if (profileInfoData?.status === apiStatus.SUCCESS && profileInfoData.data) {
      return profileInfoData.data;
    }

    return null;
  },
};
