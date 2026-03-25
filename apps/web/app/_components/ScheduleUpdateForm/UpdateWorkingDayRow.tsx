import { Control, useFieldArray, UseFormSetValue, useWatch } from 'react-hook-form';

import { BREAK_END_MINUTES, BREAK_START_MINUTES, END_MINUTE, START_MINUTE } from '@avoo/constants';
import { ScheduleUpdateFormData } from '@avoo/hooks/schemas/schedulesValidationSchemas';

import { WorkingDayRow } from '@/_components/WorkingDayRow/WorkingDayRow';

type Props = {
  index: number;
  patternShift: number;
  control: Control<ScheduleUpdateFormData>;
  setValue: UseFormSetValue<ScheduleUpdateFormData>;
  scheduleType?: string;
};

export const UpdateWorkingDayRow = (props: Props) => {
  const { index, control, setValue, scheduleType, patternShift } = props;
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
    keyName: 'rhfId',
  });

  if (!dayData) return null;

  const handleEnabledChange = (enabled: boolean) => {
    setValue(`workingHours.${index}.enabled`, enabled, { shouldDirty: true });
    if (!enabled) {
      setValue(`workingHours.${index}.startTimeMinutes`, 0, { shouldDirty: true });
      setValue(`workingHours.${index}.endTimeMinutes`, 0, { shouldDirty: true });
      setValue(`workingHours.${index}.breaks`, [], { shouldDirty: true });
    } else {
      setValue(`workingHours.${index}.startTimeMinutes`, START_MINUTE, { shouldDirty: true });
      setValue(`workingHours.${index}.endTimeMinutes`, END_MINUTE, { shouldDirty: true });
      setValue(
        `workingHours.${index}.breaks`,
        [
          {
            id: null,
            breakStartTimeMinutes: BREAK_START_MINUTES,
            breakEndTimeMinutes: BREAK_END_MINUTES,
          },
        ],
        { shouldDirty: true },
      );
    }
  };

  return (
    <WorkingDayRow
      index={index}
      patternShift={patternShift}
      scheduleType={scheduleType}
      disabledRemove={true}
      enabled={!!dayData.enabled}
      startTimeMinutes={dayData.startTimeMinutes}
      endTimeMinutes={dayData.endTimeMinutes}
      breaks={breaks}
      onEnabledChange={handleEnabledChange}
      onTimeChange={(field, val) =>
        setValue(
          `workingHours.${index}.${field === 'start' ? 'startTimeMinutes' : 'endTimeMinutes'}`,
          val,
          { shouldDirty: true },
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
    />
  );
};
