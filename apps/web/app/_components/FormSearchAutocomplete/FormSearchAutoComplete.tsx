import React from 'react';

import { TextField } from '@mui/material';

import { Option } from '@avoo/shared';

import SearchAutocomplete from '@/_components/AutoComplete/SearchAutocomplete';

type Props = {
  label: string;
  placeholder?: string;
  error?: string | boolean;
  value?: (number | undefined)[];
  onChange: (value: number[]) => void;
  options: Option[];
  optionsPool: Option[];
  onSearchChange: (searchTerm: string) => void;
  loading?: boolean;
};

export function FormSearchAutocomplete(props: Props) {
  const {
    label,
    placeholder = 'Search...',
    error,
    value = [],
    onChange,
    options,
    optionsPool,
    onSearchChange,
    loading,
  } = props;
  return (
    <SearchAutocomplete
      multiple
      disableCloseOnSelect
      renderMode='texted'
      loading={loading}
      options={options}
      value={optionsPool.filter((o) => value.includes(Number(o.value)))}
      onChange={(_, newValue) => {
        onChange(newValue.map((v) => Number(v.value)));
      }}
      getOptionLabel={(o) => o.label}
      filterOptions={(x) => x}
      isOptionEqualToValue={(o, v) => o.value === v.value}
      onInputChange={(_, input) => {
        onSearchChange(input);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          error={!!error}
          helperText={typeof error === 'string' ? error : undefined}
        />
      )}
    />
  );
}
