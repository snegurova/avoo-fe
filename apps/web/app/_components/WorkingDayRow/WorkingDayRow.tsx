import { Checkbox, Typography } from '@mui/material';
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
import {
  BREAK_END_MINUTES,
  BREAK_START_MINUTES,
  END_MINUTE,
  ScheduleKey,
  START_MINUTE,
  WORKING_HOURS_OPTIONS,
  DAYS_NAME,
} from '@/_utils/common/schedule.common';
import AddOutlinedIcon from '@/_icons/AddOutlinedIcon';
import RemoveOutlinedIcon from '@/_icons/RemoveOutlinedIcon';
import IconButton from '@mui/material/IconButton';

type Props = {
  index: number;
  control: Control<ScheduleCreateFormData>;
  watch: UseFormWatch<ScheduleCreateFormData>;
  setValue: UseFormSetValue<ScheduleCreateFormData>;
  scheduleType?: ScheduleKey;
};

export const WorkingDayRow = (props: Props) => {
  const { index, control, watch, setValue, scheduleType } = props;

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
        { breakStartTimeMinutes: BREAK_START_MINUTES, breakEndTimeMinutes: BREAK_END_MINUTES },
      ]);
    }
  };

  return (
    <>
      <div className='flex flex-row gap-1 justify-between  mb-px items-center'>
        <div className='flex justify-end items-center'>
          <Controller
            name={`workingHours.${index}.enabled`}
            control={control}
            defaultValue={true}
            render={({ field }) => (
              <Checkbox
                value={field.value}
                checked={field.value}
                onChange={(e) => onChangeChecked(e, field, index)}
              />
            )}
          />
          <Typography sx={{ width: '100px', display: 'flex', alignItems: 'center' }}>
            {scheduleType === 'weekly' ? DAYS_NAME[dayField - 1] : `Day ${dayField}`}
          </Typography>
        </div>
        <div className='flex justify-end items-center'>
          <Controller
            name={`workingHours.${index}.startTimeMinutes`}
            control={control}
            render={({ field }) => (
              <FormTimeSelect
                name={`workingHours.${index}.startTimeMinutes`}
                value={String(field.value)}
                options={WORKING_HOURS_OPTIONS}
                onChange={(val) => field.onChange(Number(val))}
                disabled={!enabled}
              />
            )}
          />

          <Controller
            name={`workingHours.${index}.endTimeMinutes`}
            control={control}
            render={({ field }) => (
              <FormTimeSelect
                name={`workingHours.${index}.endTimeMinutes`}
                value={String(field.value)}
                options={WORKING_HOURS_OPTIONS}
                onChange={(val) => field.onChange(Number(val))}
                disabled={!enabled}
              />
            )}
          />
        </div>
      </div>
      {breaksFields.map((br, brIndex) => (
        <div key={br.id} className='flex flex-row gap-1 justify-center items-center mb-px'>
          <Typography variant='body2' color='secondary'>
            Break
          </Typography>
          <Controller
            name={`workingHours.${index}.breaks.${brIndex}.breakStartTimeMinutes`}
            control={control}
            render={({ field }) => (
              <FormTimeSelect
                name={`workingHours.${index}.breaks.${brIndex}.breakStartTimeMinutes`}
                value={String(field.value)}
                options={WORKING_HOURS_OPTIONS}
                onChange={(val) => field.onChange(Number(val))}
              />
            )}
          />
          <Controller
            name={`workingHours.${index}.breaks.${brIndex}.breakEndTimeMinutes`}
            control={control}
            render={({ field }) => (
              <FormTimeSelect
                name={`workingHours.${index}.breaks.${brIndex}.breakEndTimeMinutes`}
                value={String(field.value)}
                options={WORKING_HOURS_OPTIONS}
                onChange={(val) => field.onChange(Number(val))}
              />
            )}
          />

          <IconButton onClick={() => removeBreak(brIndex)}>
            <RemoveOutlinedIcon />
          </IconButton>
        </div>
      ))}
      {enabled && (
        <div className='flex flex-row gap-1 justify-center items-center mb-px'>
          <IconButton
            onClick={() =>
              appendBreak({
                breakStartTimeMinutes: BREAK_START_MINUTES,
                breakEndTimeMinutes: BREAK_END_MINUTES,
              })
            }
          >
            <AddOutlinedIcon />
          </IconButton>
          <Typography variant='body2' color='secondary'>
            Add break
          </Typography>
        </div>
      )}
    </>
  );
};
