import { utils } from '@avoo/hooks/utils/utils';
import { GetServiceResponse, PrivateServiceQueryParams } from '@avoo/axios/types/apiTypes';

import { BaseResponse } from '@avoo/axios/types/apiTypes';
import { apiStatus } from '@avoo/hooks/types/apiTypes';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { queryKeys } from './queryKeys';
import { servicesApi } from '@avoo/axios/src/modules/services';

export const servicesHooks = {
  useGetServices: ({
    page,
    limit,
    categoryId,
    minPrice,
    maxPrice,
    search,
    isActive,
  }: PrivateServiceQueryParams) => {
    const memoParams = useMemo<PrivateServiceQueryParams>(
      () => ({
        page,
        limit,
        categoryId,
        minPrice,
        maxPrice,
        search,
        isActive,
      }),
      [page, limit, categoryId, minPrice, maxPrice, search, isActive],
    );

    const { data: servicesData, isPending } = useQuery<BaseResponse<GetServiceResponse>, Error>({
      queryKey: ['services', queryKeys.services.byParams(memoParams)],
      queryFn: () => servicesApi.getServices(memoParams),
    });

    utils.useSetPendingApi(isPending);

    if (servicesData?.status === apiStatus.SUCCESS && servicesData.data) {
      return servicesData.data;
    }

    return null;
  },
};
