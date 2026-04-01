import React, { useMemo } from 'react';

import { Checkbox, FormHelperText, ListItemText } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { Option } from '@avoo/shared';

import SearchIcon from '@/_icons/SearchIcon';

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
    placeholder,
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
        {label && (
          <InputLabel id={`multiple-${name}-label`} required={required}>
            {label}
          </InputLabel>
        )}
        <Select
          labelId={`multiple-${name}-label`}
          id={id ?? `multiple-${name}`}
          multiple
          displayEmpty
          value={selected}
          onChange={handleChange}
          input={<OutlinedInput label={label} error={Boolean(error)} />}
          renderValue={() => {
            if (!selected.length) {
              return (
                <span className='inline-flex items-center gap-2 text-gray-500'>
                  <SearchIcon className='w-5 h-5 text-gray-500' />
                  <span>{placeholder ?? ''}</span>
                </span>
              );
            }
            return selectLabelsValue;
          }}
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
