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

type UseCreateScheduleFormParams = {
  onSuccess?: () => void;
};
type UseUpdateScheduleFormParams = {
  onSuccess?: () => void;
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
  useGetScheduleById: (id: number) => {
    const { data: scheduleData, isPending } = useQuery<BaseResponse<ScheduleEntity>, Error>({
      queryKey: ['schedule', id],
      queryFn: () => scheduleApi.getScheduleById(id),
      enabled: !!id,
    });

    utils.useSetPendingApi(isPending);

    if (scheduleData?.status === apiStatus.SUCCESS && scheduleData.data) {
      return scheduleData.data;
    }

    return null;
  },
  useCreateScheduleForm: ({ onSuccess }: UseCreateScheduleFormParams = {}) => {
    const {
      register,
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<ScheduleCreateFormData>({
      resolver: yupResolver(scheduleCreateSchema),
      mode: 'onSubmit',
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
    });

    utils.useSetPendingApi(isPending);

    return {
      register,
      control,
      handleSubmit: handleSubmit(utils.submitAdapter<ScheduleCreateFormData>(createSchedule)),
      errors,
      createSchedule,
      isPending,
    };
  },
  useUpdateScheduleForm: ({ onSuccess }: UseUpdateScheduleFormParams = {}) => {
    const {
      register,
      control,
      handleSubmit,
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
      updateSchedule,
      isPending,
    };
  },
};
