import { combinationApi } from '@avoo/axios';
import { utils } from '@avoo/hooks/utils/utils';
import {
  BaseResponse,
  GetCombinationsQueryParams,
  GetCombinationsResponse,
  ApiStatus,
} from '@avoo/axios/types/apiTypes';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';
import { useMemo } from 'react';

export const combinationHooks = {
  useGetCombinations: (params: GetCombinationsQueryParams) => {
    const memoParams = useMemo<GetCombinationsQueryParams>(
      () => ({
        serviceIds: params.serviceIds,
        masterIds: params.masterIds,
        isActive: params.isActive,
      }),
      [params],
    );

    const { data: combinationsData, isPending } = useQuery<
      BaseResponse<GetCombinationsResponse>,
      Error
    >({
      queryKey: ['combinations', queryKeys.combinations.byParams(memoParams)],
      queryFn: () => combinationApi.getCombinations(memoParams),
      enabled: params.serviceIds.length > 1,
    });

    utils.useSetPendingApi(isPending);

    if (combinationsData?.status === ApiStatus.SUCCESS && combinationsData.data) {
      return combinationsData.data;
    }

    return null;
  },
};
