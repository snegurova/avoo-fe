import React, { useMemo } from 'react';

import { Checkbox, FormHelperText, ListItemText } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { Option } from '@avoo/shared';

export type Props = {
  id?: string;
  name: string;
  label?: string;
  className?: string;
  options: Option[];
  selected: string[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string | boolean;
  selectAll?: boolean;
  size?: 'small' | 'medium';
  selectAllLabel?: string;
  onChange?: (values: string[]) => void;
};

export const FormMultiSelect = (props: Props) => {
  const {
    id,
    name,
    label,
    options,
    size = 'small',
    selected,
    required = false,
    error,
    onChange,
    disabled,
    className,
  } = props;
  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    onChange?.(typeof value === 'string' ? value.split(',') : value);
  };

  const selectLabelsValue = useMemo(() => {
    return options
      .filter((option) => selected.includes(option.value))
      .map((option) => option.label)
      .join(', ');
  }, [options, selected]);

  return (
    <div className={className}>
      <FormControl size={size} fullWidth disabled={disabled} error={Boolean(error)}>
        <InputLabel id={`multiple-${name}-label`} required={required}>
          {label}
        </InputLabel>
        <Select
          labelId={`multiple-${name}-label`}
          id={id ?? `multiple-${name}`}
          multiple
          value={selected}
          onChange={handleChange}
          input={<OutlinedInput label={label} error={Boolean(error)} />}
          renderValue={() => selectLabelsValue}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Checkbox checked={selected.includes(option.value)} />
              <ListItemText primary={option.label} />
            </MenuItem>
          ))}
        </Select>
        {error && <FormHelperText>{error}</FormHelperText>}
      </FormControl>
    </div>
  );
};
