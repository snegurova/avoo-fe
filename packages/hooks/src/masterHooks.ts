import { utils } from '@avoo/hooks/utils/utils';

import { masterApi } from '@avoo/axios';
import { useQuery } from '@tanstack/react-query';

import { BaseResponse, MasterWithRelationsEntityResponse } from '@avoo/axios/types/apiTypes';
import { apiStatus } from '@avoo/hooks/constants/constants';

export const masterHooks = {
  useGetMastersProfileInfo: () => {
    const { data: profileInfoData, isPending } = useQuery<
      BaseResponse<MasterWithRelationsEntityResponse>,
      Error
    >({
      queryKey: ['mastersInfo'],
      queryFn: masterApi.getMastersInfo,
    });

    utils.useSetPendingApi(isPending);

    if (profileInfoData?.status === apiStatus.SUCCESS && profileInfoData.data) {
      return profileInfoData.data;
    }
  },
};
