import { InputAdornment, SxProps, TextField } from '@mui/material';

import { colors } from '@avoo/design-tokens';

import SearchIcon from '@/_icons/SearchIcon';

type Props = {
  setSearchQuery: (value: string) => void;
  placeholder?: string;
  style?: SxProps;
  fullWidth?: boolean;
};

export default function SearchTextInput(props: Props) {
  const { setSearchQuery, placeholder = 'Search', style, fullWidth = false } = props;

  const defaultStyles = {
    width: {
      md: '306px',
      lg: '306px',
    },
    marginRight: {
      md: '32px',
      lg: '48px',
    },
    '& .MuiOutlinedInput-root': {
      borderRadius: '18px',
      paddingLeft: 0,
      height: '44px',
      minHeight: '44px',
    },
  };

  const mergedStyles = { ...defaultStyles, ...style };

  return (
    <TextField
      size='small'
      placeholder={placeholder}
      onChange={(e) => setSearchQuery(e.target.value)}
      sx={mergedStyles}
      fullWidth={fullWidth}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position='start'>
              <SearchIcon
                style={{
                  marginLeft: '12px',
                  marginRight: '10px',
                  fill: colors.gray[500],
                }}
              />
            </InputAdornment>
          ),
        },
      }}
    />
  );
}
