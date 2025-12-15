import { utils } from '@avoo/hooks/utils/utils';
import { scheduleApi } from '@avoo/axios';

import {
  BaseResponse,
  GetSchedulesResponse,
  ScheduleCreateResponse,
  ScheduleEntity,
  ScheduleUpdateResponse,
} from '@avoo/axios/types/apiTypes';
import { apiStatus } from '@avoo/hooks/types/apiTypes';
import { queryKeys } from './queryKeys';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  scheduleUpdateSchema,
  ScheduleUpdateFormData,
  ScheduleCreateFormData,
  scheduleCreateSchema,
} from '../schemas/schedulesValidationSchemas';

type UseCreateScheduleFormParams = {
  onSuccess?: () => void;
  onError?: () => void;
};
type UseUpdateScheduleFormParams = {
  onSuccess?: () => void;
  defaultValues?: ScheduleUpdateFormData;
};

export const getNextMonday = (date: Date): Date => {
  const result = new Date(date);
  const day = result.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
  const daysToAdd = (8 - day) % 7 || 7;
  result.setDate(result.getDate() + daysToAdd);
  return result;
};

export const toLocalDateISO = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 0-based
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export const TYPE_OF_SCHEDULE = {
  weekly: { name: 'Weekly', pattern: 7, workingDaysCount: 5 },
  '2x2': { name: '2 on / 2 off', pattern: 4, workingDaysCount: 2 },
  '3x2': { name: '3 on / 2 off', pattern: 5, workingDaysCount: 3 },
  '2x1': { name: '2 on / 1 off', pattern: 3, workingDaysCount: 2 },
  custom: { name: 'Custom', pattern: 1, workingDaysCount: 1 },
};

export type ScheduleKey = keyof typeof TYPE_OF_SCHEDULE;

export const DAYS_NAME = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export const START_MINUTE = 9 * 60;
export const END_MINUTE = 18 * 60;
export const BREAK_START_MINUTES = 13 * 60;
export const BREAK_END_MINUTES = 14 * 60;

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

  useScheduleOptions: () =>
    (Object.keys(TYPE_OF_SCHEDULE) as ScheduleKey[]).map((key) => ({
      label: TYPE_OF_SCHEDULE[key].name,
      value: key,
    })),

  useGetSchedules: () => {
    const { data: schedulesData, isPending } = useQuery<BaseResponse<GetSchedulesResponse>, Error>({
      queryKey: queryKeys.schedules.all,
      queryFn: scheduleApi.getSchedules,
    });

    utils.useSetPendingApi(isPending);

    if (schedulesData?.status === apiStatus.SUCCESS && schedulesData.data) {
      return schedulesData.data;
    }

    return null;
  },
  useGetScheduleById: (id: number): ScheduleEntity => {
    const { data: scheduleData, isPending } = useQuery<BaseResponse<ScheduleEntity>, Error>({
      queryKey: ['schedule', id],
      queryFn: () => scheduleApi.getScheduleById(id),
    });

    utils.useSetPendingApi(isPending);

    if (scheduleData?.status === apiStatus.SUCCESS && scheduleData.data) {
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
        name: 'Default working schedule',
        pattern: 7,
        patternType: 'weekly',
        mastersIds: [],
        startAt: toLocalDateISO(getNextMonday(new Date())),
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
        if (response.status === apiStatus.SUCCESS) {
          onSuccess?.();
        }
      },
      onError: () => {
        onError?.();
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
        if (response.status === apiStatus.SUCCESS) {
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
