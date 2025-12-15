import React from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { SelectChangeEvent } from '@mui/material';

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
};

export const FormTimeSelect = (props: Props) => {
  const { id, name, label, value, options, disabled = false, error, onChange } = props;

  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value as string);
  };
  const sx = {
    '& label + .MuiInputBase-root': {
      marginTop: '4px',
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
