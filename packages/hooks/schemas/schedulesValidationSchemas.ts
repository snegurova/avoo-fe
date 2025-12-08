import * as yup from 'yup';

export const scheduleUpdateSchema = yup.object({
  id: yup.number().required(),
  name: yup.string().required('Name is required').trim(),

  endAt: yup
    .string()
    .required('endAt is required')
    .matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/, 'endAt must be a valid ISO datetime'),

  workingHours: yup
    .array()
    .of(
      yup.object({
        startTimeMinutes: yup.number().required().min(0).max(1440),

        endTimeMinutes: yup
          .number()
          .required()
          .min(0)
          .max(1440)
          .moreThan(yup.ref('startTimeMinutes'), 'endTimeMinutes must be > startTimeMinutes'),

        id: yup.number().required(),

        breaks: yup
          .array()
          .of(
            yup.object({
              breakStartTimeMinutes: yup.number().required().min(0).max(1440),

              breakEndTimeMinutes: yup
                .number()
                .required()
                .min(0)
                .max(1440)
                .moreThan(
                  yup.ref('breakStartTimeMinutes'),
                  'breakEndTime must be > breakStartTime',
                ),

              id: yup.mixed().required(),
            }),
          )
          .required(),
      }),
    )
    .required(),
});

export type ScheduleUpdateFormData = yup.InferType<typeof scheduleUpdateSchema>;

export const scheduleCreateSchema = yup.object({
  name: yup.string().required('Name is required').trim(),
  pattern: yup.number().required(),

  startAt: yup
    .string()
    .required('startAt is required')
    .matches(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
      'startAt must be a valid ISO datetime',
    ),

  endAt: yup
    .string()
    .required('endAt is required')
    .matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/, 'endAt must be a valid ISO datetime'),

  workingHours: yup
    .array()
    .of(
      yup.object({
        startTimeMinutes: yup.number().required().min(0).max(1440),

        endTimeMinutes: yup
          .number()
          .required()
          .min(0)
          .max(1440)
          .moreThan(yup.ref('startTimeMinutes'), 'endTimeMinutes must be > startTimeMinutes'),

        breaks: yup
          .array()
          .of(
            yup.object({
              breakStartTimeMinutes: yup.number().required().min(0).max(1440),

              breakEndTimeMinutes: yup
                .number()
                .required()
                .min(0)
                .max(1440)
                .moreThan(
                  yup.ref('breakStartTimeMinutes'),
                  'breakEndTime must be > breakStartTime',
                ),
            }),
          )
          .required(),
      }),
    )
    .required(),

  mastersIds: yup.array().of(yup.number()).required(),
});

export type ScheduleCreateFormData = yup.InferType<typeof scheduleCreateSchema>;
