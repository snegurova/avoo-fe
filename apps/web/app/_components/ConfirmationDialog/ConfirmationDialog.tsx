import React from 'react';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from '@mui/material';

import CloseIcon from '@/_icons/CloseIcon';

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  content: string | React.ReactNode;
  cancelText: string;
  confirmText: string;
  onCancel: () => void;
  onConfirm: () => void;
  loading: boolean;
};

const slotProps = {
  paper: {
    sx: {
      paddingY: {
        xs: 1,
        md: 3,
        xl: 4,
      },
      paddingX: {
        xs: 1,
        md: 2,
        xl: 4,
      },
    },
  },
};

export default function ConfirmationDialog(props: Props) {
  const { open, onClose, title, content, cancelText, confirmText, onCancel, onConfirm, loading } =
    props;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby='draggable-dialog-title'
      fullWidth
      maxWidth='xs'
      slotProps={slotProps}
    >
      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          top: { xs: 8, md: 20 },
          right: { xs: 8, md: 20 },
          zIndex: 10,
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogTitle style={{ cursor: 'move' }}>{title}</DialogTitle>
      <DialogContent>
        {typeof content === 'string' ? <DialogContentText>{content}</DialogContentText> : content}
      </DialogContent>
      <DialogActions
        sx={{
          p: {
            xs: 2,
            md: 1,
          },
          flexDirection: {
            xs: 'column-reverse',
            md: 'row',
          },
          justifyContent: 'center',
          alignItems: 'center',
          '& > :not(style) ~ :not(style)': {
            ml: 0,
          },
          '& > button': {
            width: { xs: '100%', md: 'auto' },
            m: '0 !important',
          },
          gap: 2,
        }}
      >
        <Button variant='outlined' color='secondary' onClick={onCancel} disabled={loading}>
          {cancelText}
        </Button>
        <Button
          autoFocus
          variant='contained'
          color='secondary'
          onClick={onConfirm}
          disabled={loading}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
