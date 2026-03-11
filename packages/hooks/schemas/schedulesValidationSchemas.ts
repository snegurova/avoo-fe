import * as yup from 'yup';

import { timeUtils } from '@avoo/shared/src';

export const scheduleUpdateSchema = yup.object({
  id: yup.number().required(),
  name: yup.string().required('Name is required').trim(),

  endAt: yup
    .string()
    .nullable()
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'endAt must be a valid ISO date')
    .test('end-after-now', 'End date must be after start date', function (value) {
      if (!value) return true;
      const start = timeUtils.toLocalDateISO(new Date());

      return value > start;
    })
    .test('end-after-start', 'End date must be after start date', function (value) {
      if (!value) return true;
      const startAt = this.options.context?.startAt;
      if (!startAt) return true;
      const formattedStartAt = timeUtils.toLocalDateISO(new Date(startAt));
      return value > formattedStartAt;
    }),

  workingHours: yup
    .array()
    .of(
      yup.object({
        id: yup.number().nullable(),
        enabled: yup.boolean(),
        day: yup.number().required(),
        startTimeMinutes: yup.number().required().min(0).max(1440),
        endTimeMinutes: yup
          .number()
          .required()
          .min(0)
          .max(1440)
          .test('end-after-start', 'endTimeMinutes must be > startTimeMinutes', function (value) {
            const start = this.parent.startTimeMinutes;
            if (start === 0 && value === 0) return true;
            return value > start;
          }),

        breaks: yup
          .array()
          .of(
            yup.object({
              id: yup.number().nullable(),
              breakStartTimeMinutes: yup.number().required().min(0).max(1440),
              breakEndTimeMinutes: yup
                .number()
                .required()
                .min(0)
                .max(1440)
                .moreThan(
                  yup.ref('breakStartTimeMinutes'),
                  'breakEndTimeMinutes must be > breakStartTimeMinutes',
                ),
            }),
          )
          .required(),
      }),
    )
    .required(),
  mastersIds: yup.array().of(yup.number()),
});

export const scheduleCreateSchema = yup.object({
  name: yup.string().required('Name is required').trim(),
  pattern: yup.number().required().max(40),
  patternType: yup.string().oneOf(['weekly', '2x2', '3x2', '2x1', 'custom']),
  patternShift: yup.number().required().max(6),

  startAt: yup
    .string()
    .required('startAt is required')
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'startAt must be a valid ISO date')
    .test('start-before-end', 'Start date must be before end date', function (value) {
      const endAt = this.parent.endAt;
      if (!value || !endAt) return true;
      return value < endAt;
    }),
  endAt: yup
    .string()
    .nullable()
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'endAt must be a valid ISO date')
    .test('end-after-start', 'End date must be after start date', function (value) {
      const start = this.parent.startAt;
      if (!value || !start) return true;
      return value > start;
    }),

  workingHours: yup
    .array()
    .of(
      yup.object({
        enabled: yup.boolean(),
        day: yup.number().required(),
        startTimeMinutes: yup.number().required().min(0).max(1440),

        endTimeMinutes: yup
          .number()
          .required()
          .min(0)
          .max(1440)
          .test('end-after-start', 'endTimeMinutes must be > startTimeMinutes', function (value) {
            const start = this.parent.startTimeMinutes;
            if (start === 0 && value === 0) return true;
            return value > start;
          }),
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

  masterIds: yup.array().of(yup.number()),
});

export type ScheduleUpdateFormData = yup.InferType<typeof scheduleUpdateSchema>;
export type ScheduleCreateFormData = yup.InferType<typeof scheduleCreateSchema>;
