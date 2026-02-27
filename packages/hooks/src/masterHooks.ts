import { useState, useEffect, useMemo } from 'react';
import { utils } from '@avoo/hooks/utils/utils';
import type { ShortMasterInfo } from '@avoo/axios/types/apiTypes';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { createMasterSchema, CreateMasterFormData } from '../schemas/validationSchemas';

import { masterApi } from '@avoo/axios';
import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  BaseResponse,
  MasterWithRelationsEntityResponse,
  CreateMasterRequest,
  GetMastersResponse,
  GetMastersQueryParams,
  ApiStatus,
} from '@avoo/axios/types/apiTypes';
import { queryKeys } from './queryKeys';

type UseCreateMasterFormParams = {
  onSuccess?: () => void;
};

type UseUpdateMasterFormParams = {
  master: MasterWithRelationsEntityResponse;
  onSuccess?: () => void;
};

export const masterHooks = {
  useStableMasters(mastersFromResponse: ShortMasterInfo[]): ShortMasterInfo[] {
    const [stableMasters, setStableMasters] = useState<ShortMasterInfo[]>([]);
    useEffect(() => {
      if (mastersFromResponse.length === 0) return;
      setStableMasters((prev) => {
        const byId = new Map(prev.map((m) => [m.id, m]));
        mastersFromResponse.forEach((m) => byId.set(m.id, m));
        return Array.from(byId.values());
      });
    }, [mastersFromResponse]);
    return stableMasters;
  },
  useGetMastersProfileInfo: (params: GetMastersQueryParams = {}) => {
    const { data: profileInfoData, isPending } = useQuery<BaseResponse<GetMastersResponse>, Error>({
      queryKey: [queryKeys.masters.all, queryKeys.masters.byParams(params)],
      queryFn: () => masterApi.getMastersInfo(params),
    });

    utils.useSetPendingApi(isPending);

    if (profileInfoData?.status === ApiStatus.SUCCESS && profileInfoData.data) {
      return profileInfoData.data;
    }

    return null;
  },
  useGetMastersInfinite: (params: GetMastersQueryParams = {}) => {
    const query = useInfiniteQuery<BaseResponse<GetMastersResponse>, Error>({
      queryKey: [queryKeys.masters.infinite, queryKeys.masters.byParams(params)],
      queryFn: ({ pageParam = 1 }) =>
        masterApi.getMastersInfo({ ...params, page: pageParam as number }),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        const { currentPage, total } = lastPage.data?.pagination || { currentPage: 0, total: 0 };
        return currentPage * (params.limit ?? 10) < total ? currentPage + 1 : undefined;
      },
    });

    const isPending = query.isFetching;

    utils.useSetPendingApi(isPending);

    return query;
  },
  useCreateMasterForm: ({ onSuccess }: UseCreateMasterFormParams = {}) => {
    const {
      control,
      handleSubmit,
      setValue,
      watch,
      formState: { errors },
    } = useForm<CreateMasterFormData>({
      resolver: yupResolver(createMasterSchema),
      mode: 'onSubmit',
      defaultValues: {
        email: '',
        name: '',
        bio: '',
        headline: '',
        avatarUrl: '',
        avatarPreviewUrl: '',
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
      meta: {
        successMessage: 'Master created successfully',
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.masters.all });
        onSuccess?.();
      },
    });

    utils.useSetPendingApi(isPending);

    return {
      control,
      handleSubmit: handleSubmit((formData) => {
        const payload: CreateMasterRequest = {
          name: formData.name,
          email: formData.email,
          bio: formData.bio ?? undefined,
          headline: formData.headline ?? undefined,
          avatarUrl: formData.avatarUrl ?? undefined,
          phone: formData.phone ?? undefined,
          languages: formData.languages ?? [],
        };
        createMasterMutation(payload);
      }),
      setValue,
      watch,
      errors,
      isPending,
    };
  },
  useUpdateMasterForm: ({ master, onSuccess }: UseUpdateMasterFormParams) => {
    const {
      control,
      handleSubmit,
      setValue,
      watch,
      formState: { errors, isDirty },
      reset,
    } = useForm<CreateMasterFormData>({
      resolver: yupResolver(createMasterSchema),
      mode: 'onSubmit',
      defaultValues: {
        email: master.email || '',
        name: master.name || '',
        bio: master.bio || '',
        headline: master.headline || '',
        avatarUrl: master.avatarUrl || '',
        avatarPreviewUrl: master.avatarPreviewUrl || '',
        phone: master.phone || '',
        languages: master.languages || [],
      },
    });

    const queryClient = useQueryClient();

    const { mutate: updateMasterMutation, isPending } = useMutation<
      BaseResponse<MasterWithRelationsEntityResponse>,
      Error,
      CreateMasterRequest
    >({
      mutationFn: (data: CreateMasterRequest) => masterApi.updateMaster(master.id, data),
      meta: {
        successMessage: 'Master updated successfully',
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.masters.all });
        onSuccess?.();
      },
    });

    utils.useSetPendingApi(isPending);

    return {
      control,
      handleSubmit: handleSubmit((formData) => {
        const payload: CreateMasterRequest = {
          name: formData.name,
          email: formData.email,
          bio: formData.bio ?? undefined,
          headline: formData.headline ?? undefined,
          avatarUrl: formData.avatarUrl ?? undefined,
          phone: formData.phone ?? undefined,
          languages: formData.languages ?? [],
        };
        updateMasterMutation(payload);
      }),
      setValue,
      watch,
      errors,
      isPending,
      reset,
      isDirty,
    };
  },
  useDeleteMaster: ({ onSuccess }: { onSuccess?: () => void } = {}) => {
    const queryClient = useQueryClient();

    const { mutate: deleteMasterMutation, isPending } = useMutation<
      BaseResponse<MasterWithRelationsEntityResponse>,
      Error,
      number
    >({
      mutationFn: masterApi.deleteMaster,
      meta: {
        successMessage: 'Master deleted successfully',
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.masters.all });
        onSuccess?.();
      },
    });

    utils.useSetPendingApi(isPending);

    return {
      deleteMaster: deleteMasterMutation,
      isPending,
    };
  },
  useFilterMasters: (masters: MasterWithRelationsEntityResponse[] | null, searchQuery: string) => {
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
