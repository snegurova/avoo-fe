import { Control, useFieldArray, UseFormSetValue, useWatch } from 'react-hook-form';

import { BREAK_END_MINUTES, BREAK_START_MINUTES, END_MINUTE, START_MINUTE } from '@avoo/constants';
import { ScheduleCreateFormData } from '@avoo/hooks/schemas/schedulesValidationSchemas';

import { WorkingDayRow } from '@/_components/WorkingDayRow/WorkingDayRow';

type Props = {
  index: number;
  control: Control<ScheduleCreateFormData>;
  setValue: UseFormSetValue<ScheduleCreateFormData>;
  scheduleType?: string;
  onRemoveDay?: (index: number) => void;
  disabledRemove?: boolean;
};

export const CreateWorkingDayRow = (props: Props) => {
  const { index, control, setValue, scheduleType, onRemoveDay, disabledRemove } = props;
  const dayData = useWatch({
    control,
    name: `workingHours.${index}`,
  });

  const {
    fields: breaks,
    append,
    remove,
    update,
  } = useFieldArray({
    control,
    name: `workingHours.${index}.breaks`,
  });

  if (!dayData) return null;

  const handleEnabledChange = (enabled: boolean) => {
    setValue(`workingHours.${index}.enabled`, enabled);
    if (!enabled) {
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
  const patternShift = useWatch({
    control,
    name: 'patternShift',
  });

  return (
    <WorkingDayRow
      index={index}
      patternShift={patternShift}
      scheduleType={scheduleType}
      disabledRemove={disabledRemove}
      enabled={!!dayData.enabled}
      startTimeMinutes={dayData.startTimeMinutes}
      endTimeMinutes={dayData.endTimeMinutes}
      breaks={breaks}
      onEnabledChange={handleEnabledChange}
      onTimeChange={(field, val) =>
        setValue(
          `workingHours.${index}.${field === 'start' ? 'startTimeMinutes' : 'endTimeMinutes'}`,
          val,
        )
      }
      onAddBreak={(br) => append(br)}
      onRemoveBreak={(idx) => remove(idx)}
      onBreakTimeChange={(brIndex, field, val) => {
        const currentBreak = breaks[brIndex];
        update(brIndex, {
          ...currentBreak,
          [field === 'start' ? 'breakStartTimeMinutes' : 'breakEndTimeMinutes']: val,
        });
      }}
      onRemoveDay={onRemoveDay}
    />
  );
};
