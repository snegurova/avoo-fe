import React, { useCallback } from 'react';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';

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

  const handleChange = useCallback(
    (event: SelectChangeEvent) => {
      onChange(event.target.value);
    },
    [onChange],
  );
  
  return (
    <FormControl size='small' variant='standard' disabled={disabled}>
      <InputLabel id={`${name}-select-label`}>{label}</InputLabel>
      <Select
        labelId={`${name}-select-label`}
        id={id ?? `${name}-select`}
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
