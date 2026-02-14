import { combinationApi } from '@avoo/axios';
import { utils } from '@avoo/hooks/utils/utils';
import { BaseResponse, GetCombinationsQueryParams, Combination } from '@avoo/axios/types/apiTypes';
import { ApiStatus } from '@avoo/hooks/types/apiTypes';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';
import { useMemo } from 'react';

export const combinationHooks = {
  useGetCombinations: (params: GetCombinationsQueryParams) => {
    const memoParams = useMemo<GetCombinationsQueryParams>(
      () => ({
        serviceIds: params.serviceIds,
      }),
      [params],
    );

    const { data: combinationsData, isPending } = useQuery<BaseResponse<Combination[]>, Error>({
      queryKey: ['combinations', queryKeys.combinations.byParams(memoParams)],
      queryFn: () => combinationApi.getCombinations(params),
    });

    utils.useSetPendingApi(isPending);

    if (combinationsData?.status === ApiStatus.SUCCESS && combinationsData.data) {
      return combinationsData.data;
    }

    return null;
  },
};
