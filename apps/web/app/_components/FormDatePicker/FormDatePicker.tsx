import React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import CaledarIcon from '@/_icons/CalendarIcon';
import { DATE_PICKER_FORMAT, DATE_TIME_FORMAT } from '@/_constants/dateFormats';

type Props = {
  date?: string;
  onChange: (newDate: string) => void;
};

export default function FormDatePicker(props: Props) {
  const { date, onChange } = props;

  const onValueChange = (newDate: dayjs.Dayjs | null) => {
    const convertedDate = newDate ? newDate.format(DATE_TIME_FORMAT) : '';
    onChange(convertedDate);
  };

  return (
    <DatePicker
      value={dayjs(date)}
      format={DATE_PICKER_FORMAT}
      disablePast={true}
      slots={{ openPickerIcon: () => <CaledarIcon className='fill-black w-6 h-6' /> }}
      slotProps={{
        openPickerIcon: { className: 'fill-gray-800 w-4 h-4' },
      }}
      onChange={onValueChange}
      sx={{
        '& span': {
          fontSize: 16,
        },
        '& .MuiPickersInputBase-root': {
          borderRadius: 1,
          height: 44,
        },
      }}
    />
  );
}
