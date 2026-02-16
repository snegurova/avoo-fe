import { exceptionApi } from '@avoo/axios/src/modules/exception';
import { queryKeys } from './queryKeys';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import {
  GetExceptionsQueryParams,
  GetExceptionsResponse,
  CreateExceptionRequest,
  Exception,
  BaseResponse,
} from '@avoo/axios/types/apiTypes';
import { ApiStatus } from '@avoo/hooks/types/apiTypes';
import { utils } from '@avoo/hooks/utils/utils';
import { WholeDay, TimeOffMode } from '@avoo/hooks/types/timeOffType';
import { masterHooks } from './masterHooks';
import { formValuesToPayload, buildMastersLabel, MasterInfo } from './utils/exceptionUtils';
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
    type FormValues = {
      type: string;
      mode: TimeOffMode;
      staff: string[];
      wholeDay: WholeDay;
      startDate: string;
      startTime: string;
      endDate: string;
      endTime: string;
      note: string;
    };

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
    } = useForm<FormValues>({
      mode: 'onSubmit',
      defaultValues: {
        type: 'personal',
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

    const masters = masterHooks.useGetMastersProfileInfo()?.items as MasterInfo[] | undefined;

    const submit = (data: FormValues) => {
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
      handleSubmit: handleSubmit(utils.submitAdapter<FormValues>(submit)),
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
