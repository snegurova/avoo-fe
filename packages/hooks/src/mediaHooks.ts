import { utils } from '@avoo/hooks/utils/utils';

export const mediaHooks = {
  useUploadMedia: () => {
    utils.useSetPendingApi(isPending);

    return null;
  },
};
