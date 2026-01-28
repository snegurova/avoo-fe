import React from 'react';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import ScheduleIcon from '@/_icons/ScheduleIcon';
import { TIME_FORMAT, DATE_TIME_FORMAT } from '@/_constants/dateFormats';

type Props = {
  date: string;
  onChange: (newDate: string) => void;
};

export default function FormTimePicker(props: Props) {
  const { date, onChange } = props;

  const onValueChange = (newDate: dayjs.Dayjs | null) => {
    const convertedDate = newDate ? newDate.format(DATE_TIME_FORMAT) : '';

    onChange(convertedDate);
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
      value={dayjs(date)}
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
