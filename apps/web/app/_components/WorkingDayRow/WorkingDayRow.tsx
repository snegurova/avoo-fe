import { Button, Switch, Typography } from '@mui/material';
import {
  Control,
  Controller,
  ControllerRenderProps,
  useFieldArray,
  UseFormSetValue,
  UseFormWatch,
  useWatch,
} from 'react-hook-form';
import { FormTimeSelect } from '../FormTimeSelect/FormTimeSelect';
import React from 'react';
import { ScheduleCreateFormData } from '@avoo/hooks/schemas/schedulesValidationSchemas';
import AddOutlinedIcon from '@/_icons/AddOutlinedIcon';
import IconButton from '@mui/material/IconButton';
import { scheduleHooks } from '@avoo/hooks';
import { colors } from '@avoo/design-tokens';
import CloseIcon from '@/_icons/CloseIcon';
import { tv } from 'tailwind-variants';
import {
  BREAK_END_MINUTES,
  BREAK_START_MINUTES,
  DAYS_NAME,
  END_MINUTE,
  START_MINUTE,
} from '@avoo/constants/src/calendar';

type Props = {
  index: number;
  control: Control<ScheduleCreateFormData>;
  watch: UseFormWatch<ScheduleCreateFormData>;
  setValue: UseFormSetValue<ScheduleCreateFormData>;
  scheduleType?: string;
  onRemove?: (index: number) => void;
  disabledRemove?: boolean;
};

export const WorkingDayRow = (props: Props) => {
  const { index, control, watch, setValue, scheduleType, onRemove, disabledRemove } = props;

  const enabled = useWatch({
    control,
    name: `workingHours.${index}.enabled`,
  });

  const {
    fields: breaksFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: `workingHours.${index}.breaks`,
  });

  const appendBreak = (breakData: { breakStartTimeMinutes: number; breakEndTimeMinutes: number }) =>
    append(breakData);
  const removeBreak = (i: number) => remove(i);
  const dayField = watch(`workingHours.${index}.day`);

  const onChangeChecked = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: ControllerRenderProps<ScheduleCreateFormData>,
    index: number,
  ) => {
    const checked = e.target.checked;
    field.onChange(checked);
    if (!checked) {
      setValue(`workingHours.${index}.startTimeMinutes`, 0);
      setValue(`workingHours.${index}.endTimeMinutes`, 0);
      setValue(`workingHours.${index}.breaks`, []);
    } else {
      setValue(`workingHours.${index}.startTimeMinutes`, START_MINUTE);
      setValue(`workingHours.${index}.endTimeMinutes`, END_MINUTE);
      setValue(`workingHours.${index}.breaks`, [
        {
          breakStartTimeMinutes: BREAK_START_MINUTES,
          breakEndTimeMinutes: BREAK_END_MINUTES,
        },
      ]);
    }
  };

  const cardDayVariant = tv({
    base: 'flex flex-row justify-between items-center px-4 py-2 bg-primary-50',
    variants: {
      enabled: {
        true: '',
        false: 'text-gray-500',
      },
    },
  });
  return (
    <>
      <div className='border border-gray-200 rounded-lg'>
        <div className={cardDayVariant({ enabled })}>
          <div className='flex justify-start items-center gap-2'>
            <Typography variant='h4'>
              {scheduleType === 'weekly' ? DAYS_NAME[dayField - 1] : `Day ${index + 1}`}
            </Typography>
            {scheduleType === 'custom' && (
              <Button
                variant='chip'
                size='small'
                onClick={() => onRemove?.(index)}
                disabled={disabledRemove}
              >
                Remove
              </Button>
            )}
          </div>

          <div className='flex justify-end items-center'>
            <Controller
              name={`workingHours.${index}.enabled`}
              control={control}
              defaultValue={true}
              render={({ field }) => (
                <div className='flex items-center gap-2'>
                  <Typography variant='body2'>{field.value ? 'Working day' : 'Day off'}</Typography>
                  <Switch
                    value={field.value}
                    checked={field.value}
                    onChange={(e) => onChangeChecked(e, field, index)}
                  />
                </div>
              )}
            />
          </div>
        </div>
        {enabled && (
          <div className='flex justify-between items-center px-4 py-2'>
            <Controller
              name={`workingHours.${index}.startTimeMinutes`}
              control={control}
              render={({ field }) => (
                <FormTimeSelect
                  name={`workingHours.${index}.startTimeMinutes`}
                  value={String(field.value)}
                  options={scheduleHooks.useWorkingHoursOptions()}
                  onChange={(val) => field.onChange(Number(val))}
                  disabled={!enabled}
                />
              )}
            />
            <span className='p-4'>to</span>

            <Controller
              name={`workingHours.${index}.endTimeMinutes`}
              control={control}
              render={({ field }) => (
                <FormTimeSelect
                  name={`workingHours.${index}.endTimeMinutes`}
                  value={String(field.value)}
                  options={scheduleHooks.useWorkingHoursOptions()}
                  onChange={(val) => field.onChange(Number(val))}
                  disabled={!enabled}
                />
              )}
            />
          </div>
        )}
        <div id='breaks'>
          {breaksFields.map((br, brIndex) => (
            <div key={br.id} className='flex flex-row justify-between items-center px-4 py-2'>
              <Typography variant='h4' color={colors.gray[600]} sx={{ px: 1.5 }}>
                Break
              </Typography>
              <Controller
                name={`workingHours.${index}.breaks.${brIndex}.breakStartTimeMinutes`}
                control={control}
                render={({ field }) => (
                  <FormTimeSelect
                    name={`workingHours.${index}.breaks.${brIndex}.breakStartTimeMinutes`}
                    value={String(field.value)}
                    options={scheduleHooks.useWorkingHoursOptions()}
                    onChange={(val) => field.onChange(Number(val))}
                  />
                )}
              />
              <span className='p-4'>to</span>
              <Controller
                name={`workingHours.${index}.breaks.${brIndex}.breakEndTimeMinutes`}
                control={control}
                render={({ field }) => (
                  <FormTimeSelect
                    name={`workingHours.${index}.breaks.${brIndex}.breakEndTimeMinutes`}
                    value={String(field.value)}
                    options={scheduleHooks.useWorkingHoursOptions()}
                    onChange={(val) => field.onChange(Number(val))}
                  />
                )}
              />
              <div className='px-1 pl-4'>
                <IconButton onClick={() => removeBreak(brIndex)}>
                  <CloseIcon />
                </IconButton>
              </div>
            </div>
          ))}
          {enabled && (
            <div className='flex items-center px-4 py-2'>
              <IconButton
                onClick={() =>
                  appendBreak({
                    breakStartTimeMinutes: BREAK_START_MINUTES,
                    breakEndTimeMinutes: BREAK_END_MINUTES,
                  })
                }
              >
                <AddOutlinedIcon fill={colors.primary[700]} />
              </IconButton>
              <Typography variant='h4' color={colors.primary[700]}>
                Add break
              </Typography>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
