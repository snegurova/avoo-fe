import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import {
  QueryClient,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { masterApi } from '@avoo/axios';
import type { ShortMasterInfo } from '@avoo/axios/types/apiTypes';
import {
  ApiStatus,
  BaseResponse,
  CreateMasterRequest,
  ErrorResponse,
  GetMastersQueryParams,
  GetMastersResponse,
  MasterWithRelationsEntityResponse,
  UpdateMasterRequest,
} from '@avoo/axios/types/apiTypes';
import { utils } from '@avoo/hooks/utils/utils';
import { Option } from '@avoo/shared';

import { CreateMasterFormData, createMasterSchema } from '../schemas/validationSchemas';
import { queryKeys } from './queryKeys';
import { useDebounce } from './useDebounce';

type UseCreateMasterFormParams = {
  onSuccess?: () => void;
  onError?: (errorType: CreateMasterErrorType, error: ErrorResponse) => void;
};

export enum CreateMasterErrorType {
  DuplicateEmail = 'duplicate-email',
  Unknown = 'unknown',
}

const isDuplicateEmailCreateMasterError = (error: ErrorResponse) => {
  const isDuplicateEmailCode = error.errorCode === 5;
  const hasEmailError = error.errors?.some((item) => item.field === 'email');
  const normalizedErrorMessage = error.errorMessage.toLowerCase();
  const isDuplicateEmailMessage = normalizedErrorMessage.includes('email already in use');

  return isDuplicateEmailCode || hasEmailError || isDuplicateEmailMessage;
};

const getCreateMasterErrorType = (error: ErrorResponse): CreateMasterErrorType => {
  if (isDuplicateEmailCreateMasterError(error)) {
    return CreateMasterErrorType.DuplicateEmail;
  }

  return CreateMasterErrorType.Unknown;
};

type UseUpdateMasterFormParams = {
  master: MasterWithRelationsEntityResponse;
  onSuccess?: () => void;
};

const normalizeStringValue = (value: string | null | undefined) => {
  if (value == null) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const normalizeLanguagesValue = (
  value: MasterWithRelationsEntityResponse['languages'] | CreateMasterFormData['languages'],
) => (Array.isArray(value) ? value : []);

const areLanguagesEqual = (
  current: MasterWithRelationsEntityResponse['languages'] | CreateMasterFormData['languages'],
  initial: MasterWithRelationsEntityResponse['languages'] | CreateMasterFormData['languages'],
) => {
  const currentValue = normalizeLanguagesValue(current);
  const initialValue = normalizeLanguagesValue(initial);
  return (
    currentValue.length === initialValue.length &&
    currentValue.every((language, index) => language === initialValue[index])
  );
};

const buildUpdateMasterPayload = (
  data: CreateMasterFormData,
  master: MasterWithRelationsEntityResponse,
): UpdateMasterRequest => {
  const payload: UpdateMasterRequest = {
    email: data.email,
    name: data.name,
  };

  const nextHeadline = normalizeStringValue(data.headline);
  const initialHeadline = normalizeStringValue(master.headline);
  if (nextHeadline !== initialHeadline) {
    payload.headline = nextHeadline;
  }

  const nextBio = normalizeStringValue(data.bio);
  const initialBio = normalizeStringValue(master.bio);
  if (nextBio !== initialBio) {
    payload.bio = nextBio;
  }

  const nextPhone = normalizeStringValue(data.phone);
  const initialPhone = normalizeStringValue(master.phone);
  if (nextPhone !== initialPhone) {
    payload.phone = nextPhone;
  }

  const nextAvatarUrl = normalizeStringValue(data.avatarUrl);
  const initialAvatarUrl = normalizeStringValue(master.avatarUrl);
  if (nextAvatarUrl !== initialAvatarUrl) {
    payload.avatarUrl = nextAvatarUrl;
  }

  const nextAvatarPreviewUrl = normalizeStringValue(data.avatarPreviewUrl);
  const initialAvatarPreviewUrl = normalizeStringValue(master.avatarPreviewUrl);
  if (nextAvatarPreviewUrl !== initialAvatarPreviewUrl) {
    payload.avatarPreviewUrl = nextAvatarPreviewUrl;
  }

  if (!areLanguagesEqual(data.languages, master.languages)) {
    payload.languages = normalizeLanguagesValue(data.languages);
  }

  return payload;
};

export const masterHooks = {
  invalidateOnSuccess: (queryClient: QueryClient, callback?: () => void) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.exceptions.all });
    queryClient.invalidateQueries({ queryKey: queryKeys.calendar.all });
    queryClient.invalidateQueries({ queryKey: queryKeys.monthCalendar.all });
    queryClient.invalidateQueries({ queryKey: queryKeys.masters.all });
    queryClient.invalidateQueries({ queryKey: queryKeys.services.all });
    queryClient.invalidateQueries({ queryKey: queryKeys.schedules.all });
    callback?.();
  },

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
      queryKey: [...queryKeys.masters.all, params],
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
      queryKey: [...queryKeys.masters.all, 'infinite', params],
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
  useMasterQuery(firstServiceId?: number) {
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearch = useDebounce(searchTerm);
    const masterQuery = masterHooks.useGetMastersInfinite({
      search: debouncedSearch,
      serviceId: firstServiceId,
    });

    const masters = masterQuery.data?.pages.flatMap((page) => page.data?.items ?? []) ?? [];
    return {
      masters,
      searchTerm,
      setSearchTerm,
      ...masterQuery,
    };
  },
  useMasterQueryWithOptions() {
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [optionsPool, setOptionsPool] = useState<Option[]>([]);

    const masterQuery = masterHooks.useMasterQuery();

    const mastersOptions = useMemo(() => {
      return (masterQuery.masters || []).map((m) => ({
        label: m.name ?? `Master #${m.id}`,
        value: m.id.toString(),
      }));
    }, [masterQuery.masters]);

    useEffect(() => {
      setOptionsPool((prevPool) => {
        const newOptions = mastersOptions.filter(
          (newOpt) => !prevPool.some((p) => p.value === newOpt.value),
        );
        if (newOptions.length === 0) return prevPool;

        return [...prevPool, ...newOptions];
      });
    }, [mastersOptions]);

    return {
      mastersOptions,
      optionsPool,
      isInputFocused,
      setIsInputFocused,
      ...masterQuery,
    };
  },
  useCreateMasterForm: ({ onSuccess, onError }: UseCreateMasterFormParams = {}) => {
    const {
      control,
      handleSubmit,
      setValue,
      setError,
      clearErrors,
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
      ErrorResponse,
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
      onError: (error) => {
        onError?.(getCreateMasterErrorType(error), error);
      },
    });

    utils.useSetPendingApi(isPending);

    return {
      control,
      handleSubmit: handleSubmit(
        utils.submitAdapter<CreateMasterRequest, CreateMasterFormData>(createMasterMutation),
      ),
      setValue,
      setError,
      clearErrors,
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
      CreateMasterFormData
    >({
      mutationFn: (data: CreateMasterFormData) =>
        masterApi.updateMaster(master.id, buildUpdateMasterPayload(data, master)),
      meta: {
        successMessage: 'Master updated successfully',
      },
      onSuccess: () => {
        masterHooks.invalidateOnSuccess(queryClient, onSuccess);
      },
    });

    utils.useSetPendingApi(isPending);

    return {
      control,
      handleSubmit: handleSubmit(
        utils.submitAdapter<CreateMasterFormData, CreateMasterFormData>(updateMasterMutation),
      ),
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
        masterHooks.invalidateOnSuccess(queryClient, onSuccess);
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
  useGetPublicMastersInfinite: (params: GetMastersQueryParams = {}) => {
    const query = useInfiniteQuery<BaseResponse<GetMastersResponse>, Error>({
      queryKey: [...queryKeys.masters.all, 'public', params],
      queryFn: ({ pageParam = 1 }) =>
        masterApi.getPublicMasters({ ...params, page: pageParam as number }),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        const { currentPage, total } = lastPage.data?.pagination || { currentPage: 0, total: 0 };
        return currentPage * (params.limit || 10) < total ? currentPage + 1 : undefined;
      },
    });

    return query;
  },
};
