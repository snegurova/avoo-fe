import React from 'react';
import { useTranslations } from 'next-intl';

import { Button, IconButton, Switch, Typography } from '@mui/material';
import { tv } from 'tailwind-variants';

import { BREAK_END_MINUTES, BREAK_START_MINUTES } from '@avoo/constants';
import { colors } from '@avoo/design-tokens';
import { scheduleHooks } from '@avoo/hooks';
import { timeUtils } from '@avoo/shared';

import { FormTimeSelect } from '@/_components/FormTimeSelect/FormTimeSelect';
import AddOutlinedIcon from '@/_icons/AddOutlinedIcon';
import CloseIcon from '@/_icons/CloseIcon';
import SearchActivity from '@/_icons/SearchActivity';

type Props = {
  index: number;
  patternShift: number;
  enabled: boolean;
  startTimeMinutes: number;
  endTimeMinutes: number;
  breaks: {
    id?: string | number | null;
    breakStartTimeMinutes: number;
    breakEndTimeMinutes: number;
  }[];
  scheduleType?: string;
  disabledRemove?: boolean;
  onEnabledChange: (enabled: boolean) => void;
  onTimeChange: (field: 'start' | 'end', minutes: number) => void;
  onAddBreak: (breakData: { breakStartTimeMinutes: number; breakEndTimeMinutes: number }) => void;
  onRemoveBreak: (index: number) => void;
  onBreakTimeChange: (breakIndex: number, field: 'start' | 'end', minutes: number) => void;
  onRemoveDay?: (index: number) => void;
};

export const WorkingDayRow = (props: Props) => {
  const tCommon = useTranslations('private.components.WorkingDayRow.WorkingDayRow');
  const t = useTranslations('private.calendar.calendar');
  const {
    index,
    patternShift,
    enabled,
    startTimeMinutes,
    endTimeMinutes,
    breaks,
    scheduleType,
    disabledRemove,
    onEnabledChange,
    onTimeChange,
    onAddBreak,
    onRemoveBreak,
    onBreakTimeChange,
    onRemoveDay,
  } = props;

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    onEnabledChange(isChecked);
  };

  const cardDayVariant = tv({
    base: 'flex flex-row justify-between items-center px-4 py-2 bg-primary-50 rounded-t-lg',
    variants: {
      enabled: {
        true: '',
        false: 'text-gray-500',
      },
    },
  });
  const options = scheduleHooks.useWorkingHoursOptions();

  const shiftedIndex = (((index + patternShift) % 7) + 7) % 7;

  return (
    <div className='border border-gray-200 rounded-lg'>
      <div className={cardDayVariant({ enabled })}>
        <div className='flex justify-start items-center gap-2'>
          <Typography variant='h4'>
            {scheduleType === 'weekly'
              ? t(timeUtils.getWeekDay(shiftedIndex) as Parameters<typeof t>[0])
              : `${tCommon('day')} ${index + 1}`}
          </Typography>
          {scheduleType === 'custom' && (
            <Button
              variant='chip'
              size='small'
              onClick={() => onRemoveDay?.(index)}
              disabled={disabledRemove}
            >
              {tCommon('remove')}
            </Button>
          )}
        </div>

        <div className='flex justify-end items-center gap-2'>
          <Typography variant='body2'>
            {enabled ? tCommon('workingDay') : tCommon('dayOff')}
          </Typography>
          <Switch checked={enabled} onChange={handleSwitchChange} />
        </div>
      </div>

      {enabled && (
        <div className='grid grid-cols-[1fr_auto_1fr] items-center px-4 py-2 gap-2'>
          <FormTimeSelect
            name={`startTime-${index}`}
            value={String(startTimeMinutes)}
            options={options}
            onChange={(val) => onTimeChange('start', Number(val))}
          />
          <span className='px-2 text-center'>{tCommon('to')}</span>
          <FormTimeSelect
            name={`endTime-${index}`}
            value={String(endTimeMinutes)}
            options={options}
            onChange={(val) => onTimeChange('end', Number(val))}
          />
        </div>
      )}

      <div id='breaks'>
        {breaks.map((br, brIndex) => (
          <div
            key={br.id || brIndex}
            className='grid grid-cols-[1fr_auto_1fr] items-center px-4 py-2 gap-2'
          >
            <div className='flex items-center gap-2'>
              <SearchActivity className='w-10 h-10 fill-primary-800' />
              <FormTimeSelect
                name={`breakStart-${index}-${brIndex}`}
                value={String(br.breakStartTimeMinutes)}
                options={options}
                onChange={(val) => onBreakTimeChange(brIndex, 'start', Number(val))}
              />
            </div>
            <span className='px-2 text-center'>{tCommon('to')}</span>
            <div className='flex items-center gap-2'>
              <FormTimeSelect
                name={`breakEnd-${index}-${brIndex}`}
                value={String(br.breakEndTimeMinutes)}
                options={options}
                onChange={(val) => onBreakTimeChange(brIndex, 'end', Number(val))}
              />

              <IconButton onClick={() => onRemoveBreak(brIndex)}>
                <CloseIcon />
              </IconButton>
            </div>
          </div>
        ))}
        {enabled && (
          <div className='flex items-center p-2'>
            <IconButton
              onClick={() =>
                onAddBreak({
                  breakStartTimeMinutes: BREAK_START_MINUTES,
                  breakEndTimeMinutes: BREAK_END_MINUTES,
                })
              }
            >
              <AddOutlinedIcon fill={colors.primary[700]} />
            </IconButton>
            <Typography variant='h4' color={colors.primary[700]}>
              {tCommon('addBreak')}
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
};
