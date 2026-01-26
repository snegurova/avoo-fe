import React from 'react';
import { timeUtils } from '@avoo/shared';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import ScheduleIcon from '@/_icons/ScheduleIcon';
import { TIME_FORMAT } from '@/_constants/dateFormats';

type Props = {
  date: string;
  startTimeMinutes: number;
  onChange: (newTimeMinutes: number) => void;
};

export default function FormTimePicker(props: Props) {
  const { date, startTimeMinutes, onChange } = props;

  const onValueChange = (newTime: dayjs.Dayjs | null) => {
    const hours = newTime ? newTime.hour() : 9;
    const minutes = newTime ? newTime.minute() : 0;

    const newTimeMinutes = hours * 60 + minutes;

    onChange(newTimeMinutes);
  };

  return (
    <TimePicker
      sx={{
        '& span': {
          fontSize: 16,
        },
        '& .MuiPickersInputBase-root': {
          borderRadius: 1,
          height: 44,
        },
      }}
      value={dayjs(
        timeUtils.formatToFullDate(date || '', timeUtils.getTimeFromMinutes(startTimeMinutes || 0)),
      )}
      views={['hours', 'minutes']}
      minutesStep={15}
      timeSteps={{ minutes: 15 }}
      format={TIME_FORMAT}
      ampm={false}
      disablePast={true}
      disableIgnoringDatePartForTimeValidation={true}
      closeOnSelect={true}
      slots={{ openPickerIcon: () => <ScheduleIcon className='fill-black w-6 h-6' /> }}
      onChange={onValueChange}
    />
  );
}
