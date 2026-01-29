import { utils } from '@avoo/hooks/utils/utils';
import { GetCategoriesResponse, GetPrivateCategoriesResponse } from '@avoo/axios/types/apiTypes';

import { BaseResponse } from '@avoo/axios/types/apiTypes';
import { ApiStatus } from '@avoo/hooks/types/apiTypes';
import { useQuery } from '@tanstack/react-query';
import { categoriesApi } from '@avoo/axios';
import { queryKeys } from './queryKeys';

export const categoriesHooks = {
  useGetPublicCategories: () => {
    const { data: categoriesData, isPending } = useQuery<
      BaseResponse<GetCategoriesResponse>,
      Error
    >({
      queryKey: queryKeys.categories.all,
      queryFn: categoriesApi.getPublicAll,
    });

    utils.useSetPendingApi(isPending);

    if (categoriesData?.status === ApiStatus.SUCCESS && categoriesData.data) {
      return categoriesData.data;
    }

    return null;
  },

  useGetCategories: (searchQuery: string) => {
    const { data: categoriesData, isPending } = useQuery<
      BaseResponse<GetPrivateCategoriesResponse>,
      Error
    >({
      queryKey: ['categories', searchQuery],
      queryFn: () => categoriesApi.getPrivateAll(searchQuery),
      staleTime: 30_000,
    });

    utils.useSetPendingApi(isPending);

    if (categoriesData?.status === ApiStatus.SUCCESS && categoriesData.data) {
      return categoriesData.data;
    }

    return null;
  },
};
