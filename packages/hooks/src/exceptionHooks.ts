import { exceptionApi } from '@avoo/axios/src/modules/exception';
import { queryKeys } from './queryKeys';
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import {
  GetExceptionsQueryParams,
  GetExceptionsResponse,
  CreateExceptionRequest,
  Exception,
  BaseResponse,
  ApiStatus,
} from '@avoo/axios/types/apiTypes';
import { utils } from '@avoo/hooks/utils/utils';
import { WholeDay, TimeOffMode, TimeOffType } from '@avoo/hooks/types/timeOffType';
import { masterHooks } from './masterHooks';
import {
  formValuesToPayload,
  buildMastersLabel,
  MasterInfo,
  ExceptionFormData,
} from './utils/exceptionUtils';
import { useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import { VALUE_DATE_FORMAT } from '../../../apps/web/app/_constants/dateFormats';

export const exceptionHooks = {
  useGetExceptions: (params?: GetExceptionsQueryParams) => {
    const memoParams = useMemo(() => params ?? {}, [params]);

    const { data: exceptionsData, isPending } = useQuery<
      BaseResponse<GetExceptionsResponse>,
      Error
    >({
      queryKey: ['exceptions', queryKeys.exceptions.byParams(memoParams)],
      queryFn: () => exceptionApi.getExceptions(memoParams),
    });

    utils.useSetPendingApi(isPending);

    if (exceptionsData?.status === ApiStatus.SUCCESS && exceptionsData.data) {
      return exceptionsData.data;
    }

    return null;
  },

  useGetExceptionsInfinite: (params: GetExceptionsQueryParams = {}) => {
    const DEFAULT_LIMIT = 10;
    const { limit = DEFAULT_LIMIT } = params;
    const filterParams = { ...params, limit };

    const infiniteQuery = useInfiniteQuery<BaseResponse<GetExceptionsResponse>, Error>({
      queryKey: ['exceptions', 'list', filterParams],
      queryFn: ({ pageParam = 1 }) =>
        exceptionApi.getExceptions({ ...filterParams, page: pageParam as number }),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        const { currentPage, total } = lastPage.data?.pagination || { currentPage: 0, total: 0 };
        return currentPage * limit < total ? currentPage + 1 : undefined;
      },
    });

    utils.useSetPendingApi(infiniteQuery.isFetching);

    return infiniteQuery;
  },

  useCreateException: (onSuccess?: () => void) => {
    const queryClient = useQueryClient();
    const { mutate, isPending } = useMutation<
      BaseResponse<Exception[]>,
      Error,
      CreateExceptionRequest
    >({
      mutationFn: (data: CreateExceptionRequest) => exceptionApi.createException(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.exceptions.all });
        onSuccess?.();
      },
    });

    utils.useSetPendingApi(isPending);

    return { mutate, isPending };
  },

  useCreateExceptionForm: (onSuccess?: (args?: { mastersLabel?: string }) => void) => {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation<
      BaseResponse<Exception[]>,
      Error,
      CreateExceptionRequest
    >({
      mutationFn: (data: CreateExceptionRequest) => exceptionApi.createException(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.exceptions.all });
      },
    });

    utils.useSetPendingApi(isPending);

    const {
      control,
      handleSubmit,
      setValue,
      watch,
      getValues,
      reset,
      formState: { errors },
    } = useForm<ExceptionFormData>({
      mode: 'onSubmit',
      defaultValues: {
        type: TimeOffType.Personal,
        mode: TimeOffMode.TimeOff,
        staff: ['all'],
        wholeDay: WholeDay.Partial,
        startDate: dayjs().format(VALUE_DATE_FORMAT),
        startTime: '08:00',
        endDate: dayjs().format(VALUE_DATE_FORMAT),
        endTime: '20:00',
        note: '',
      },
    });

    const mastersResponse = masterHooks.useGetMastersProfileInfo();
    const masters: MasterInfo[] | undefined = mastersResponse?.items?.map((master) => ({
      id: master.id,
      name: master.name,
    }));

    const submit = (data: ExceptionFormData) => {
      const payload = formValuesToPayload(data, masters);
      const mastersLabel = buildMastersLabel(data.staff, masters);
      mutate(payload, {
        onSuccess: () => {
          reset();
          onSuccess?.({ mastersLabel });
        },
      });
    };

    return {
      control,
      handleSubmit: handleSubmit(submit),
      setValue,
      watch,
      errors,
      isPending,
      getValues,
      reset,
    };
  },

  useDeleteException: (onSuccess?: () => void) => {
    const queryClient = useQueryClient();
    const { mutate, isPending } = useMutation<BaseResponse<Exception>, Error, number>({
      mutationFn: (id: number) => exceptionApi.deleteException(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.exceptions.all });
        onSuccess?.();
      },
    });

    utils.useSetPendingApi(isPending);

    return { mutate, isPending };
  },
};