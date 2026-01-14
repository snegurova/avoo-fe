import { utils } from '@avoo/hooks/utils/utils';
import { GetCategoriesResponse } from '@avoo/axios/types/apiTypes';

import { BaseResponse } from '@avoo/axios/types/apiTypes';
import { apiStatus } from '@avoo/hooks/types/apiTypes';
import { useQuery } from '@tanstack/react-query';
import { categoriesApi } from '@avoo/axios';
import { queryKeys } from './queryKeys';

export const categoriesHooks = {
  useGetCategories: () => {
    const { data: categoriesData, isPending } = useQuery<
      BaseResponse<GetCategoriesResponse>,
      Error
    >({
      queryKey: queryKeys.categories.all,
      queryFn: categoriesApi.getAll,
    });

    utils.useSetPendingApi(isPending);

    if (categoriesData?.status === apiStatus.SUCCESS && categoriesData.data) {
      return categoriesData.data;
    }

    return null;
  },
};
