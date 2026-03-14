import React, { useMemo, useState } from 'react';

import {
  Autocomplete,
  AutocompleteChangeDetails,
  AutocompleteChangeReason,
  AutocompleteProps,
  Checkbox,
  TextField,
  Typography,
} from '@mui/material';

type Option = {
  label: string;
  value: string;
};

type AppAutocompleteProps<T> = AutocompleteProps<T, true, false, false> & {
  renderMode?: 'texted';
  emptyDefaultLabel?: string;
};

export default function SearchAutocomplete<T extends Option>(props: AppAutocompleteProps<T>) {
  const { renderMode, options = [], onChange, renderInput, value = [], ...rest } = props;

  const [inputValueState, setInputValueState] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const mergedOptions = useMemo(() => {
    const filteredOptions = options.filter((o) =>
      o.label.toLowerCase().includes(inputValueState.toLowerCase()),
    );
    const selectedItems = (value as T[]) || [];
    const uniqueOptions = [
      ...selectedItems.filter((s) => !filteredOptions.some((o) => o.value === s.value)),
      ...filteredOptions,
    ];
    return uniqueOptions;
  }, [options, value, inputValueState]);

  const handleChange = (
    event: React.SyntheticEvent,
    newValue: T[],
    reason: AutocompleteChangeReason,
    details?: AutocompleteChangeDetails<T>,
  ) => {
    onChange?.(event, newValue, reason, details);

    if (reason === 'selectOption' || reason === 'removeOption') {
      setInputValueState('');
      if (rest.onInputChange) {
        rest.onInputChange(event, '', 'clear');
      }
    }
  };

  return (
    <Autocomplete
      {...rest}
      multiple
      value={value}
      options={mergedOptions}
      inputValue={inputValueState}
      onInputChange={(event, newValue, reason) => {
        if (reason === 'input' || reason === 'clear') {
          setInputValueState(newValue);
          rest.onInputChange?.(event, newValue, reason);
          return;
        }
      }}
      onFocus={(e) => {
        setIsFocused(true);
        rest.onFocus?.(e);
      }}
      onBlur={(e) => {
        setIsFocused(false);
        rest.onBlur?.(e);
      }}
      onChange={handleChange}
      filterOptions={(x) => x}
      sx={{
        '& .MuiAutocomplete-inputRoot': {
          alignItems: 'center',
          paddingTop: '4px',
          paddingBottom: '4px',
        },
        ...rest.sx,
      }}
      renderOption={(props, option) => {
        const checked = (value as T[]).some((v) => v.value === option.value);

        return (
          <li {...props} key={option.value}>
            <div id={`option-${option.value}`} style={{ display: 'flex', alignItems: 'center' }}>
              <Checkbox checked={checked} sx={{ mr: 1 }} />
              {option.label}
            </div>
          </li>
        );
      }}
      isOptionEqualToValue={(option, val) => option.value === val.value}
      renderTags={() => null}
      renderInput={(params) => {
        let displayText = '';

        const selected = value as T[];

        if (!isFocused) {
          if (selected.length > 0 && renderMode === 'texted') {
            displayText = `${selected.length} selected`;
          } else if (selected.length === 0) {
            displayText = 'Apply to all';
          }
          params.inputProps.placeholder = '';
        }

        if (renderMode === 'texted' && selected.length > 0) {
          displayText = `${selected.length} selected`;
        }
        if (displayText) {
          params.InputProps.startAdornment = (
            <>
              <Typography
                sx={{
                  ml: 1,
                  mr: 1,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '65%',
                  color: 'text.primary',
                }}
              >
                {displayText}
              </Typography>
              {params.InputProps.startAdornment}
            </>
          );
        }

        return renderInput ? renderInput(params) : <TextField {...params} />;
      }}
    />
  );
}
