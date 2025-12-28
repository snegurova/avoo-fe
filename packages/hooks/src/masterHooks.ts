import { useMemo } from 'react';
import { utils } from '@avoo/hooks/utils/utils';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { createMasterSchema, CreateMasterFormData } from '../schemas/validationSchemas';

import { masterApi } from '@avoo/axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  BaseResponse,
  MasterWithRelationsEntityResponse,
  CreateMasterRequest,
} from '@avoo/axios/types/apiTypes';
import { apiStatus } from '@avoo/hooks/types/apiTypes';
import { queryKeys } from './queryKeys';

type UseCreateMasterFormParams = {
  onSuccess?: () => void;
};

export const masterHooks = {
  useGetMastersProfileInfo: () => {
    const { data: profileInfoData, isPending } = useQuery<
      BaseResponse<MasterWithRelationsEntityResponse[]>,
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
  useCreateMasterForm: ({ onSuccess }: UseCreateMasterFormParams = {}) => {
    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<CreateMasterFormData>({
      resolver: yupResolver(createMasterSchema),
      mode: 'onSubmit',
      defaultValues: {
        email: '',
        name: '',
        bio: '',
        phone: '',
        languages: [],
      },
    });

    const queryClient = useQueryClient();

    const { mutate: createMasterMutation, isPending } = useMutation<
      BaseResponse<MasterWithRelationsEntityResponse>,
      Error,
      CreateMasterRequest
    >({
      mutationFn: masterApi.createMaster,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.masters.all });
        onSuccess?.();
      },
    });

    utils.useSetPendingApi(isPending);

    return {
      control,
      handleSubmit: handleSubmit(utils.submitAdapter<CreateMasterRequest>(createMasterMutation)),
      errors,
      isPending,
    };
  },
  useFilterMasters: (
    masters: MasterWithRelationsEntityResponse[] | null,
    searchQuery: string,
  ) => {
    return useMemo(() => {
      if (!masters) return [];
      if (!searchQuery.trim()) return masters;

      const query = searchQuery.toLowerCase();
      return masters.filter(
        (master) =>
          master.name?.toLowerCase().includes(query) ||
          master.email?.toLowerCase().includes(query) ||
          master.phone?.toLowerCase().includes(query),
      );
    }, [masters, searchQuery]);
  },
};
