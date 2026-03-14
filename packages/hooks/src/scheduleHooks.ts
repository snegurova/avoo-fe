import { useMemo, useState } from 'react';
import { FieldArrayWithId, useForm } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { scheduleApi } from '@avoo/axios';
import {
  ApiStatus,
  BaseResponse,
  CreateScheduleResponse,
  GetSchedulesResponse,
  ScheduleEntity,
  SchedulesQueryParams,
  UpdateScheduleResponse,
} from '@avoo/axios/types/apiTypes';
import { END_MINUTE, ScheduleOption, START_MINUTE } from '@avoo/constants';
import { utils } from '@avoo/hooks/utils/utils';
import { timeUtils } from '@avoo/shared';

import {
  ScheduleCreateFormData,
  scheduleCreateSchema,
  ScheduleUpdateFormData,
  scheduleUpdateSchema,
} from '../schemas/schedulesValidationSchemas';
import { queryKeys } from './queryKeys';
import { useDebounce } from './useDebounce';
import { useSort } from './useSort';

const DEFAULT_LIMIT = 10;

type UseCreateScheduleFormParams = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};
type UseUpdateScheduleFormParams = {
  defaultValues: ScheduleUpdateFormData;
  startAt: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

type SortField = 'name' | 'startAt' | 'endAt';

type ScheduleQueryStateParams = {
  limit: number;
  search: string;
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
  useGetSchedulesInfinite: ({ limit = DEFAULT_LIMIT, search }: SchedulesQueryParams) => {
    const filterParams = { limit, search };
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
  useScheduleQuery() {
    const [params, setParams] = useState<ScheduleQueryStateParams>({
      limit: DEFAULT_LIMIT,
      search: '',
    });

    const setSearchQuery = (value: string) => {
      setParams((prev) => ({
        ...prev,
        search: value,
      }));
    };

    const { field, direction, sortQuery, onSortClick } = useSort<SortField>('startAt', 'asc');
    const debouncedSearch = useDebounce(params.search, 400);

    const queryParams = useMemo(
      () => ({
        limit: params.limit,
        search: debouncedSearch,
        sort: sortQuery,
      }),
      [params.limit, debouncedSearch, sortQuery],
    );

    return {
      params,
      setSearchQuery,
      queryParams,
      activeSortField: field,
      activeSortDirection: direction,
      onSortClick,
    };
  },
  useGetScheduleById: (id: number): ScheduleEntity | null => {
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

    const queryClient = useQueryClient();

    const { mutate: createSchedule, isPending } = useMutation<
      BaseResponse<CreateScheduleResponse>,
      Error,
      ScheduleCreateFormData
    >({
      mutationFn: scheduleApi.createSchedule,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: queryKeys.schedules.all,
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.calendar.all,
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.monthCalendar.all,
        });
        onSuccess?.();
      },
      onError: (error) => {
        onError?.(error);
      },
    });

    const onSubmitHandler = (data: ScheduleCreateFormData) => {
      const payload = { ...data };
      const patternType = payload.patternType;

      if (patternType === 'weekly') {
        const shift = timeUtils.getPatternShift(payload.startAt);
        const currentWorkingHours = payload.workingHours;
        const shiftedWorkingHours = Array.from({ length: 7 }).map((_, i) => {
          const shiftedIndex = (((i + shift) % 7) + 7) % 7;
          return {
            ...currentWorkingHours[shiftedIndex],
            day: i + 1,
          };
        });
        payload.workingHours = shiftedWorkingHours;
      }
      createSchedule(payload);
    };

    utils.useSetPendingApi(isPending);

    return {
      register,
      control,
      handleSubmit: handleSubmit(
        utils.submitAdapter<ScheduleCreateFormData, ScheduleCreateFormData>(onSubmitHandler),
      ),
      errors,
      watch,
      setValue,
      createSchedule,
      isPending,
    };
  },
  useUpdateScheduleForm: ({
    defaultValues,
    startAt,
    onSuccess,
    onError,
  }: UseUpdateScheduleFormParams) => {
    const queryClient = useQueryClient();

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
      context: {
        startAt,
      },
      defaultValues: {
        id: defaultValues.id,
        name: defaultValues.name ?? '',
        endAt: defaultValues.endAt ? timeUtils.toLocalDateISO(new Date(defaultValues.endAt)) : null,
        workingHours:
          defaultValues.workingHours.map((wh) => ({
            id: wh.id,
            day: wh.day,
            enabled: !(wh.startTimeMinutes === 0 && wh.endTimeMinutes === 0),
            startTimeMinutes: wh.startTimeMinutes,
            endTimeMinutes: wh.endTimeMinutes,
            breaks: wh.breaks.map((b) => ({
              id: b.id,
              breakStartTimeMinutes: b.breakStartTimeMinutes,
              breakEndTimeMinutes: b.breakEndTimeMinutes,
            })),
          })) ?? [],
      },
    });

    const { mutate: updateSchedule, isPending } = useMutation<
      BaseResponse<UpdateScheduleResponse>,
      Error,
      ScheduleUpdateFormData
    >({
      mutationFn: scheduleApi.updateSchedule,
      onSuccess: (response) => {
        if (response.status === ApiStatus.SUCCESS) {
          queryClient.invalidateQueries({
            queryKey: queryKeys.schedules.detail(defaultValues.id),
            exact: true,
          });
          queryClient.invalidateQueries({
            queryKey: queryKeys.schedules.all,
          });
          queryClient.invalidateQueries({
            queryKey: queryKeys.calendar.all,
          });
          queryClient.invalidateQueries({
            queryKey: queryKeys.monthCalendar.all,
          });
          onSuccess?.();
        }
      },
      onError: (error) => {
        onError?.(error);
      },
    });

    const handleScheduleShift = (
      fields: FieldArrayWithId<ScheduleUpdateFormData, 'workingHours'>[],
      patternShift: number,
      scheduleType: ScheduleOption,
    ) => {
      if (scheduleType.value !== 'weekly') {
        const visuallyOrderedFields = fields.map((field, index) => {
          return {
            field,
            originalIndex: index,
          };
        });

        return visuallyOrderedFields;
      }
      const visuallyOrderedFields = fields
        .map((field, index) => {
          const weekDayIndex = (((index + patternShift) % 7) + 7) % 7;
          return {
            field,
            originalIndex: index,
            weekDayIndex,
          };
        })
        .sort((a, b) => a.weekDayIndex - b.weekDayIndex);

      return visuallyOrderedFields;
    };

    utils.useSetPendingApi(isPending);

    return {
      register,
      control,
      handleScheduleShift,
      handleSubmit: handleSubmit(
        utils.submitAdapter<ScheduleUpdateFormData, ScheduleUpdateFormData>(updateSchedule),
      ),
      errors,
      watch,
      setValue,
      updateSchedule,
      isPending,
    };
  },
  useDeleteSchedule: () => {
    const queryClient = useQueryClient();

    const deleteScheduleMutation = useMutation({
      mutationFn: (id: number) => scheduleApi.deleteSchedule(id),
      onSuccess: (_, deletedId) => {
        queryClient.setQueriesData<InfiniteData<BaseResponse<GetSchedulesResponse>>>(
          {
            predicate: (query) => query.queryKey[0] === 'schedules' && query.queryKey[1] === 'list',
          },
          (oldData) => {
            if (!oldData) return oldData;

            const newPages = oldData.pages.map((page) => {
              if (page.status !== ApiStatus.SUCCESS || !page.data) {
                return page;
              }
              const newItems = page.data.items.filter((s) => s.id !== deletedId);

              return {
                ...page,
                data: {
                  ...page.data,
                  items: newItems,
                  pagination: {
                    ...page.data.pagination,
                    total: Math.max(page.data.pagination.total - 1, 0),
                  },
                },
              };
            });

            return { ...oldData, pages: newPages };
          },
        );
        queryClient.invalidateQueries({
          queryKey: queryKeys.schedules.all,
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.calendar.all,
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.monthCalendar.all,
        });
      },
    });

    utils.useSetPendingApi(deleteScheduleMutation.isPending);

    return {
      deleteScheduleMutation,
      deleteScheduleMutationAsync: deleteScheduleMutation.mutateAsync,
    };
  },
  useScheduleControls() {
    const [selectedSchedule, setSelectedSchedule] = useState<ScheduleEntity | null>(null);

    return {
      selectedSchedule,
      setSelectedSchedule,
    };
  },
};
