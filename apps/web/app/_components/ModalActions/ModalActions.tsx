import React from 'react';
import { Button } from '@mui/material';

type Props = {
  onCancel: () => void;
  onSubmit?: () => void;
  cancelText?: string;
  submitText?: string;
  loading?: boolean;
  submitType?: 'submit' | 'button';
  className?: string;
  submitDisabled?: boolean;
  gap?: number;
  minWidth?: number | 'auto';
};

export default function ModalActions(props: Readonly<Props>) {
  const {
    onCancel,
    onSubmit,
    cancelText = 'Cancel',
    submitText = 'Save',
    loading = false,
    submitType = 'submit',
    className = '',
    submitDisabled = true,
    minWidth,
    gap = 8,
  } = props;

  let baseMinWidth: number | 'auto' | undefined;
  if (minWidth === 'auto') {
    baseMinWidth = 'auto';
  } else {
    baseMinWidth = minWidth ?? undefined;
  }

  return (
    <div className={`flex justify-center gap-${gap} ${className}`}>
      <Button
        onClick={onCancel}
        color='secondary'
        variant='outlined'
        sx={{ minWidth: baseMinWidth ?? { xs: 130, md: 170 } }}
      >
        {cancelText}
      </Button>

      <Button
        type={submitType}
        onClick={submitType === 'button' ? onSubmit : undefined}
        color='secondary'
        variant='contained'
        sx={{
          minWidth: baseMinWidth ?? { xs: 130, md: 170 },
          '&.Mui-disabled': {
            bgcolor: 'grey.500',
            color: 'white',
            '&:hover': { bgcolor: 'grey.500' },
          },
        }}
        disabled={loading || submitDisabled}
      >
        {loading ? 'Saving...' : submitText}
      </Button>
    </div>
  );
}
