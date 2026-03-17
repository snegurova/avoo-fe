import { useState } from 'react';
import { Platform } from 'react-native';

import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

import { BREAK_END_MINUTES, BREAK_START_MINUTES, END_MINUTE, START_MINUTE } from '@avoo/constants';
import { timeUtils } from '@avoo/shared';

export enum TimeField {
  StartTime = 'startTimeMinutes',
  EndTime = 'endTimeMinutes',
  BreakStart = 'breakStartTimeMinutes',
  BreakEnd = 'breakEndTimeMinutes',
}

export type ActiveTimeField = {
  dayIndex: number;
  breakIndex: number | null;
  field: TimeField;
} | null;

type WorkingDay = {
  day: number;
  enabled?: boolean;
  startTimeMinutes: number;
  endTimeMinutes: number;
  breaks: { breakStartTimeMinutes: number; breakEndTimeMinutes: number }[];
};

export const useWorkingHoursEditor = (
  workingHours: WorkingDay[] | undefined,
  update: (index: number, value: WorkingDay) => void,
) => {
  const [activeTimeField, setActiveTimeField] = useState<ActiveTimeField>(null);
  const [pendingTime, setPendingTime] = useState<Date | null>(null);

  const handleToggleDay = (index: number, enabled: boolean) => {
    const day = workingHours?.[index];
    if (!day) return;
    update(index, {
      ...day,
      enabled,
      startTimeMinutes: enabled ? day.startTimeMinutes || START_MINUTE : 0,
      endTimeMinutes: enabled ? day.endTimeMinutes || END_MINUTE : 0,
      breaks: enabled ? (day.breaks ?? []) : [],
    });
  };

  const shiftTime = (
    index: number,
    field: TimeField.StartTime | TimeField.EndTime,
    direction: -1 | 1,
  ) => {
    const day = workingHours?.[index];
    if (!day) return;
    const next = Math.min(Math.max((day[field] ?? START_MINUTE) + direction * 15, 0), 24 * 60);
    update(index, { ...day, [field]: next });
  };

  const addBreak = (dayIndex: number) => {
    const day = workingHours?.[dayIndex];
    if (!day) return;
    update(dayIndex, {
      ...day,
      breaks: [
        ...(day.breaks ?? []),
        { breakStartTimeMinutes: BREAK_START_MINUTES, breakEndTimeMinutes: BREAK_END_MINUTES },
      ],
    });
  };

  const removeBreak = (dayIndex: number, breakIndex: number) => {
    const day = workingHours?.[dayIndex];
    if (!day) return;
    update(dayIndex, { ...day, breaks: day.breaks.filter((_, i) => i !== breakIndex) });
  };

  const shiftBreakTime = (
    dayIndex: number,
    breakIndex: number,
    field: TimeField.BreakStart | TimeField.BreakEnd,
    direction: -1 | 1,
  ) => {
    const day = workingHours?.[dayIndex];
    if (!day) return;
    const brk = day.breaks[breakIndex];
    if (!brk) return;
    const next = Math.min(Math.max(brk[field] + direction * 15, 0), 24 * 60);
    const updatedBreaks = [...day.breaks];
    updatedBreaks[breakIndex] = { ...brk, [field]: next };
    update(dayIndex, { ...day, breaks: updatedBreaks });
  };

  const applyTime = (
    dayIndex: number,
    field: TimeField,
    breakIndex: number | null,
    mins: number,
  ) => {
    const day = workingHours?.[dayIndex];
    if (!day) return;
    if (breakIndex !== null) {
      const updatedBreaks = [...day.breaks];
      updatedBreaks[breakIndex] = { ...updatedBreaks[breakIndex], [field]: mins };
      update(dayIndex, { ...day, breaks: updatedBreaks });
    } else {
      update(dayIndex, { ...day, [field]: mins });
    }
  };

  const openTimePicker = (dayIndex: number, field: TimeField, breakIndex: number | null = null) => {
    const day = workingHours?.[dayIndex];
    if (!day) return;
    const minutes =
      breakIndex !== null
        ? (day.breaks[breakIndex]?.[field as 'breakStartTimeMinutes' | 'breakEndTimeMinutes'] ??
          BREAK_START_MINUTES)
        : (day[field as 'startTimeMinutes' | 'endTimeMinutes'] ?? START_MINUTE);

    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: timeUtils.minutesToDate(minutes),
        mode: 'time',
        is24Hour: true,
        minuteInterval: 15,
        onChange: (_, picked) => {
          if (!picked) return;
          applyTime(dayIndex, field, breakIndex, timeUtils.getMinutesFromDate(picked));
        },
      });
    } else {
      setPendingTime(timeUtils.minutesToDate(minutes));
      setActiveTimeField({ dayIndex, field, breakIndex });
    }
  };

  const confirmTime = () => {
    if (!activeTimeField || !pendingTime) return;
    applyTime(
      activeTimeField.dayIndex,
      activeTimeField.field,
      activeTimeField.breakIndex,
      timeUtils.getMinutesFromDate(pendingTime),
    );
    setActiveTimeField(null);
    setPendingTime(null);
  };

  return {
    activeTimeField,
    pendingTime,
    setPendingTime,
    setActiveTimeField,
    handleToggleDay,
    shiftTime,
    addBreak,
    removeBreak,
    shiftBreakTime,
    openTimePicker,
    confirmTime,
  };
};
