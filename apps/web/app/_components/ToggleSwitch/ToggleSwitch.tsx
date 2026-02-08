import React from 'react';
import Switch from '@mui/material/Switch';

type Props = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  ariaLabel?: string;
  disabled?: boolean;
};

export default function ToggleSwitch({ checked, onChange, ariaLabel, disabled }: Props) {
  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange(event.target.checked);
    },
    [onChange],
  );

  return (
    <Switch
      checked={checked}
      onChange={handleChange}
      slotProps={{ input: { 'aria-label': ariaLabel } }}
      disabled={disabled}
      disableRipple
    />
  );
}
