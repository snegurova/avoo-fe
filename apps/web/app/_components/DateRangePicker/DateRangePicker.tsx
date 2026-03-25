import React, { useState } from 'react';
import { useTranslations } from 'next-intl';

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  useMediaQuery,
} from '@mui/material';
import { DatePicker, StaticDatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

import CalendarIcon from '@/_icons/CalendarIcon';

type Props = {
  dateFrom?: string;
  dateTo?: string;
  setDateFrom: (date?: string) => void;
  setDateTo: (date?: string) => void;
  className?: string;
};

const slotProps = {
  paper: {
    sx: {
      width: '100%',
      paddingY: {
        xs: 1,
        md: 3,
        xl: 4,
      },
      paddingX: {
        xs: 1,
        md: 2,
        xl: 4,
      },
      maxWidth: {
        xs: '100%',
        lg: 700,
        xl: 720,
      },
    },
  },
};

const textSx = {
  textField: {
    InputLabelProps: {
      shrink: false,
    },
    sx: {
      '& span': {
        fontSize: 16,
      },
      '& .MuiPickersInputBase-root': {
        borderRadius: 1,
        minHeight: 44,
      },
      '& .MuiInputLabel-root': {
        position: 'absolute',
        transform: 'translate(14px, 12px) scale(1)',
        transition: 'all 0.2s ease',
        padding: '0 4px',
      },
      '& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-root.MuiFormLabel-filled': {
        transform: 'translate(14px, -6px) scale(0.75)',
      },
    },
  },
};

export default function DateRangePicker(props: Props) {
  const { dateFrom, dateTo, setDateFrom, setDateTo, className } = props;
  const isMobile = useMediaQuery('(max-width:767px)');
  const t = useTranslations('private.components.DateRangePicker.DateRangePicker');
  const tCommon = useTranslations('private.common');

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (event: React.SyntheticEvent<unknown>, reason?: string) => {
    if (reason !== 'backdropClick') {
      setOpen(false);
    }
  };

  return (
    <div className={className}>
      <div className='flex items-center gap-2'>
        {isMobile ? (
          <div className='flex w-full flex-row gap-2 justify-between'>
            <DatePicker
              label={t('from')}
              value={dateFrom ? dayjs(dateFrom) : null}
              disablePast={false}
              disabled={false}
              minDate={dateFrom ? dayjs(dateFrom) : undefined}
              onChange={(date) => setDateFrom(date?.format('YYYY-MM-DD'))}
              onAccept={() => setOpen(false)}
              slots={{
                openPickerIcon: () => <CalendarIcon className='fill-black w-6 h-6' />,
              }}
              slotProps={textSx}
            />

            <DatePicker
              label={t('to')}
              value={dateTo ? dayjs(dateTo) : null}
              disablePast={false}
              disabled={false}
              minDate={dateTo ? dayjs(dateTo) : undefined}
              onChange={(date) => setDateTo(date?.format('YYYY-MM-DD'))}
              onAccept={() => setOpen(false)}
              slots={{
                openPickerIcon: () => <CalendarIcon className='fill-black w-6 h-6' />,
              }}
              slotProps={textSx}
            />
          </div>
        ) : (
          <div className='cursor-pointer' onClick={handleClickOpen}>
            <div className='flex items-center gap-2 pe-2'>
              <IconButton>
                <CalendarIcon />
              </IconButton>
              <span className='text-sm'>{dateFrom ?? t('from')}</span>
              <span>-</span>
              <span className='text-sm'>{dateTo ?? t('to')}</span>
            </div>
          </div>
        )}
      </div>
      <Dialog open={open} onClose={handleClose} maxWidth='lg' fullWidth slotProps={slotProps}>
        <DialogTitle>{t('selectTheStartAndEndDate')}</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: 'flex',
              flexDirection: {
                xs: 'column',
                md: 'row',
              },
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
            }}
          >
            <StaticDatePicker
              value={dateFrom ? dayjs(dateFrom) : null}
              disablePast={false}
              disabled={false}
              orientation='portrait'
              onChange={(date) => setDateFrom(date?.format('YYYY-MM-DD'))}
              slots={{
                actionBar: () => null,
              }}
              localeText={{ toolbarTitle: t('selectStartDate') }}
            />

            <StaticDatePicker
              value={dateTo ? dayjs(dateTo) : null}
              disablePast={false}
              disabled={false}
              orientation='portrait'
              minDate={dateFrom ? dayjs(dateFrom) : undefined}
              onChange={(date) => setDateTo(date?.format('YYYY-MM-DD'))}
              onAccept={() => setOpen(false)}
              slots={{
                actionBar: () => null,
              }}
              localeText={{ toolbarTitle: t('selectEndDate') }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant='outlined' color='secondary' onClick={handleClose}>
            {tCommon('cancel')}
          </Button>
          <Button variant='contained' color='secondary' onClick={handleClose}>
            {tCommon('ok')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
