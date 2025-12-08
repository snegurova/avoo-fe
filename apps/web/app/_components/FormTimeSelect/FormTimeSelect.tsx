import React from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { SelectChangeEvent } from 'node_modules/@mui/material';
import { UseFormRegisterReturn } from 'react-hook-form';

export type Option = { label: string; value: string };

export type Props = {
  id?: string;
  name: string;
  label?: string;
  options: Option[];
  value?: string;
  disabled?: boolean;
  error?: string | boolean;
  onChange: (value: string) => void;
  registerProps?: UseFormRegisterReturn;
};

export const FormTimeSelect = (props: Props) => {
  const {
    id,
    name,
    label,
    value,
    options,
    disabled = false,
    error,
    onChange,
    registerProps,
  } = props;

  const handleChange = (event: SelectChangeEvent) => {
    registerProps?.onChange(event);
    onChange(event.target.value as string);
  };
  const sx = {
    '& label + .MuiInputBase-root': {
      marginTop: '8px',
    },
    '& .MuiInputBase-root::before': {
      borderBottom: 'none',
    },
    '& .MuiInputBase-root:hover:not(.Mui-disabled)::before': {
      borderBottom: 'none',
    },
    '& .MuiInputBase-root.Mui-focused::before': {
      borderBottom: 'none',
    },
  };
  return (
    <FormControl size='small' variant='standard' sx={sx} disabled={disabled}>
      <InputLabel id={`${name}-select-label`}>{label}</InputLabel>
      <Select
        labelId={`${name}-select-label`}
        id={id ? id : `${name}-select`}
        value={value}
        label={label}
        onChange={handleChange}
        {...registerProps}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {error && <p className='text-sm text-red-600'>{error}</p>}
    </FormControl>
  );
};
