import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { utils } from '@avoo/hooks/utils/utils';
import { scheduleApi } from '@avoo/axios';
import {
  BaseResponse,
  GetSchedulesResponse,
  ScheduleCreateResponse,
  ScheduleEntity,
  SchedulesQueryParams,
  ScheduleUpdateResponse,
} from '@avoo/axios/types/apiTypes';
import { ApiStatus } from '@avoo/hooks/types/apiTypes';
import { timeUtils } from '@avoo/shared';
import { END_MINUTE, START_MINUTE } from '@avoo/constants/src/calendar';
import {
  scheduleUpdateSchema,
  ScheduleUpdateFormData,
  ScheduleCreateFormData,
  scheduleCreateSchema,
} from '../schemas/schedulesValidationSchemas';

const DEFAULT_LIMIT = 10;

type UseCreateScheduleFormParams = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};
type UseUpdateScheduleFormParams = {
  onSuccess?: () => void;
  defaultValues?: ScheduleUpdateFormData;
};

export const scheduleHooks = {
  useWorkingHoursOptions: () =>
    Array.from({ length: 48 }, (_, i) => ({
      label:
        i % 2 === 0
          ? `${Math.floor(i / 2)
              .toString()
              .padStart(2, '0')}:00`
          : `${Math.floor(i / 2)
              .toString()
              .padStart(2, '0')}:30`,
      value: String(i * 30),
    })),
  useGetSchedulesInfinite: ({ limit = DEFAULT_LIMIT, masterIds }: SchedulesQueryParams) => {
    const filterParams = { limit, masterIds };
    const query = useInfiniteQuery<BaseResponse<GetSchedulesResponse>, Error>({
      queryKey: ['schedules', 'list', filterParams],
      queryFn: ({ pageParam = 1 }) =>
        scheduleApi.getSchedules({ ...filterParams, page: pageParam as number }),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        const { currentPage, total } = lastPage.data?.pagination || { currentPage: 0, total: 0 };
        return currentPage * limit < total ? currentPage + 1 : undefined;
      },
    });

    const isPending = query.isFetching;

    utils.useSetPendingApi(isPending);

    return query;
  },
  useGetScheduleById: (id: number): ScheduleEntity => {
    const { data: scheduleData, isPending } = useQuery<BaseResponse<ScheduleEntity>, Error>({
      queryKey: ['schedule', id],
      queryFn: () => scheduleApi.getScheduleById(id),
    });

    utils.useSetPendingApi(isPending);

    if (scheduleData?.status === ApiStatus.SUCCESS && scheduleData.data) {
      return scheduleData.data;
    }

    return null;
  },
  useCreateScheduleForm: ({ onSuccess, onError }: UseCreateScheduleFormParams = {}) => {
    const {
      register,
      control,
      handleSubmit,
      setValue,
      watch,
      formState: { errors },
    } = useForm<ScheduleCreateFormData>({
      resolver: yupResolver(scheduleCreateSchema),
      mode: 'onSubmit',
      defaultValues: {
        name: 'Working schedule',
        pattern: 7,
        patternType: 'weekly',
        masterIds: [],
        startAt: timeUtils.getNextMonday(new Date()),
        endAt: null,
        workingHours: Array.from({ length: 7 }).map((_, i) => ({
          enabled: i < 5,
          day: i + 1,
          startTimeMinutes: START_MINUTE,
          endTimeMinutes: END_MINUTE,
          breaks: [],
        })),
      },
    });

    const { mutate: createSchedule, isPending } = useMutation<
      BaseResponse<ScheduleCreateResponse>,
      Error,
      ScheduleCreateFormData
    >({
      mutationFn: scheduleApi.createSchedule,
      onSuccess: (response) => {
        if (response.status === ApiStatus.SUCCESS) {
          onSuccess?.();
        }
      },
      onError: (error) => {
        onError?.(error);
      },
    });

    utils.useSetPendingApi(isPending);

    return {
      register,
      control,
      handleSubmit: handleSubmit(utils.submitAdapter<ScheduleCreateFormData>(createSchedule)),
      errors,
      watch,
      setValue,
      createSchedule,
      isPending,
    };
  },
  useUpdateScheduleForm: ({ onSuccess }: UseUpdateScheduleFormParams = {}) => {
    const {
      register,
      control,
      handleSubmit,
      watch,
      setValue,
      formState: { errors },
    } = useForm<ScheduleUpdateFormData>({
      resolver: yupResolver(scheduleUpdateSchema),
      mode: 'onSubmit',
    });

    const { mutate: updateSchedule, isPending } = useMutation<
      BaseResponse<ScheduleUpdateResponse>,
      Error,
      ScheduleUpdateFormData
    >({
      mutationFn: scheduleApi.updateSchedule,
      onSuccess: (response) => {
        if (response.status === ApiStatus.SUCCESS) {
          onSuccess?.();
        }
      },
    });

    utils.useSetPendingApi(isPending);

    return {
      register,
      control,
      handleSubmit,
      errors,
      watch,
      setValue,
      updateSchedule,
      isPending,
    };
  },
};
