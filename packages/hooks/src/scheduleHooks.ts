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
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  scheduleUpdateSchema,
  ScheduleUpdateFormData,
  ScheduleCreateFormData,
  scheduleCreateSchema,
} from '../schemas/schedulesValidationSchemas';
import { convertToMidnightDate, getNextMonday } from '../../../apps/web/app/_utils/date.utils';

type UseCreateScheduleFormParams = {
  onSuccess?: () => void;
  onError?: () => void;
};
type UseUpdateScheduleFormParams = {
  onSuccess?: () => void;
  defaultValues?: ScheduleUpdateFormData;
};

export const scheduleHooks = {
  useGetSchedules: () => {
    const { data: schedulesData, isPending } = useQuery<BaseResponse<GetSchedulesResponse>, Error>({
      queryKey: ['schedules'],
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
        startAt: convertToMidnightDate(getNextMonday(new Date())).toISOString(),
        endAt: null,
        workingHours: Array.from({ length: 7 }).map((_, i) => ({
          enabled: i < 5,
          day: i + 1,
          startTimeMinutes: 9 * 60,
          endTimeMinutes: 18 * 60,
          breaks: [
            {
              breakStartTimeMinutes: i < 5 ? 13 * 60 : 0,
              breakEndTimeMinutes: i < 5 ? 14 * 60 : 0,
            },
          ],
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
