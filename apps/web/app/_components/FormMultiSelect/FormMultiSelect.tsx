import React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Checkbox, ListItemText } from '@mui/material';

export type Option = { label: string; value: string };

export type Props = {
  id?: string;
  name: string;
  label?: string;
  options: Option[];
  selected: string[];
  placeholder?: string;
  disabled?: boolean;
  error?: string | boolean;
  selectAll?: boolean;
  size?: 'small' | 'medium';
  selectAllLabel?: string;
  onChange: (values: string[]) => void;
};

export const FormMultiSelect = (props: Props) => {
  const { id, name, label, options, size = 'small', selected, onChange } = props;
  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    onChange(typeof value === 'string' ? value.split(',') : value);
  };
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;

  return (
    <div>
      <FormControl size={size} fullWidth sx={{ mt: 2 }}>
        <InputLabel id={`multiple-${name}-label`}>{label}</InputLabel>
        <Select
          labelId={`multiple-${name}-label`}
          id={id ? id : `multiple-${name}`}
          multiple
          value={selected}
          onChange={handleChange}
          input={<OutlinedInput label={label} />}
          renderValue={(selected) =>
            options
              .filter((o) => selected.includes(o.value))
              .map((o) => o.label)
              .join(', ')
          }
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
              },
            },
          }}
        >
          {options.map((option) => (
            <MenuItem key={option.label} value={option.value}>
              <Checkbox checked={selected.includes(option.value)} />
              <ListItemText primary={option.label} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};
