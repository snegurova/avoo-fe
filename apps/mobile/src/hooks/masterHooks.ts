import { useMemo } from 'react';

import type { GetMastersQueryParams } from '@avoo/axios/types/apiTypes';
import { masterHooks } from '@avoo/hooks';

export const masterMobileHooks = {
  useGetMastersFlattened: (params: GetMastersQueryParams = {}) => {
    const query = masterHooks.useGetMastersInfinite(params);
    const masters = useMemo(
      () => query.data?.pages.flatMap((p) => p.data?.items ?? []) ?? [],
      [query.data],
    );
    return { masters, query };
  },
};
