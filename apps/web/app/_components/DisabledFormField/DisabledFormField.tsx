import { InputAdornment, TextField } from '@mui/material';

import { colors } from '@avoo/design-tokens';

import LockIcon from '@/_icons/LockIcon';

type Props = {
  value: string;
  label?: string;
  fullWidth?: boolean;
  required?: boolean;
};
export default function DisabledFormField(props: Props) {
  const { value, label, required = false, fullWidth = false } = props;
  return (
    <TextField
      label={label}
      disabled
      required={required}
      value={value}
      fullWidth={fullWidth}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position='end'>
              <LockIcon
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: 10,
                  transform: 'translateY(-50%)',
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
