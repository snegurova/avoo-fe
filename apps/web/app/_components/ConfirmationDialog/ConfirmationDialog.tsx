import CloseIcon from '@/_icons/CloseIcon';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  IconButton,
} from '@mui/material';

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  content: string;
  cancelText: string;
  confirmText: string;
  onCancel: () => void;
  onConfirm: () => void;
  loading: boolean;
};

export default function ConfirmationDialog(props: Props) {
  const { open, onClose, title, content, cancelText, confirmText, onCancel, onConfirm, loading } =
    props;

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby='draggable-dialog-title'>
      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          top: 4,
          right: 4,
          zIndex: 10,
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogTitle style={{ cursor: 'move' }}>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          autoFocus
          variant='outlined'
          color='secondary'
          onClick={onCancel}
          disabled={loading}
          loading={loading}
        >
          {cancelText}
        </Button>
        <Button
          variant='contained'
          color='secondary'
          onClick={onConfirm}
          disabled={loading}
          loading={loading}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
