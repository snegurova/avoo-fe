import React from 'react';
import { useTranslations } from 'next-intl';

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
  sticky?: boolean;
};

export default function ModalActions(props: Readonly<Props>) {
  const t = useTranslations('private.components.ModalActions.ModalActions');
  const {
    onCancel,
    onSubmit,
    cancelText = t('close'),
    submitText = t('save'),
    loading = false,
    submitType = 'submit',
    className = '',
    submitDisabled = true,
    gap = 8,
    sticky = true,
  } = props;

  const baseClassName = sticky
    ? `sticky bottom-0 z-20 mt-auto flex shrink-0 justify-end bg-white pt-4 gap-${gap}`
    : `flex justify-center gap-${gap}`;

  return (
    <div className={`${baseClassName} ${className}`.trim()}>
      <Button onClick={onCancel} color='secondary' variant='outlined'>
        {cancelText}
      </Button>

      <Button
        type={submitType}
        onClick={submitType === 'button' ? onSubmit : undefined}
        color='secondary'
        variant='contained'
        disabled={loading || submitDisabled}
      >
        {loading ? t('saving') : submitText}
      </Button>
    </div>
  );
}
