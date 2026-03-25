import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { Autocomplete, CircularProgress, InputAdornment, TextField } from '@mui/material';

import { colors } from '@avoo/design-tokens';
import { masterHooks } from '@avoo/hooks';

import SearchIcon from '@/_icons/SearchIcon';

type Props = {
  selectedId?: number;
  setSelectedId: (masterId?: number) => void;
  withSearchIcon?: boolean;
  fullWidth?: boolean;
};

export const SingleMasterSelect = (props: Props) => {
  const { selectedId, setSelectedId, withSearchIcon = true, fullWidth = false } = props;
  const t = useTranslations('private.components.SingleMasterSelect.SingleMasterSelect');
  const [inputValue, setInputValue] = useState('');
  const masters = masterHooks.useGetMastersProfileInfo({ search: inputValue })?.items;

  return (
    <Autocomplete
      fullWidth={fullWidth}
      options={masters || []}
      getOptionLabel={(option) => option.name}
      value={masters?.find((m) => m.id === selectedId) ?? null}
      onChange={(_, newValue) => setSelectedId(newValue?.id)}
      inputValue={inputValue}
      onInputChange={(_, newInput) => setInputValue(newInput)}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      loading={masters?.length === 0}
      clearOnEscape
      renderInput={(renderParams) => {
        const { InputProps, ...rest } = renderParams;

        return (
          <TextField
            {...rest}
            sx={{
              borderColor: colors.black,
            }}
            placeholder={t('allMasters')}
            size='small'
            slotProps={{
              inputLabel: {
                shrink: true,
              },
              input: {
                ...InputProps,
                startAdornment: withSearchIcon ? (
                  <InputAdornment position='start'>
                    <SearchIcon
                      style={{
                        marginLeft: '12px',
                        marginRight: '10px',
                        fill: colors.gray[500],
                      }}
                    />
                  </InputAdornment>
                ) : undefined,

                endAdornment: (
                  <>
                    {masters?.length === 0 && <CircularProgress color='inherit' size={20} />}
                    {InputProps?.endAdornment}
                  </>
                ),
              },
            }}
          />
        );
      }}
    />
  );
};
