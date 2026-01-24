import { customerApi } from '@avoo/axios';
import { utils } from '@avoo/hooks/utils/utils';
import {
  GetCustomersQueryParams,
  GetCustomersResponse,
  BaseResponse,
} from '@avoo/axios/types/apiTypes';
import { apiStatus } from '@avoo/hooks/types/apiTypes';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { queryKeys } from './queryKeys';

export const customerHooks = {
  useGetCustomers: (params: GetCustomersQueryParams) => {
    const memoParams = useMemo<GetCustomersQueryParams>(
      () => ({
        ...params,
      }),
      [params],
    );
    const { data: customersData, isPending } = useQuery<BaseResponse<GetCustomersResponse>, Error>({
      queryKey: ['customers', queryKeys.customers.byParams(memoParams)],
      queryFn: () => customerApi.getCustomers(memoParams),
    });

    utils.useSetPendingApi(isPending);

    if (customersData?.status === apiStatus.SUCCESS && customersData.data) {
      return customersData.data;
    }

    return { pagination: null, items: [] };
  },
};
