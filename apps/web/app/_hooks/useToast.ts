import { useContext } from 'react';
import { SnackbarContext } from '../_providers/SnackbarContextProvider';
import { AnchorOrigin } from '@avoo/hooks/types/snackbar';

export const useToast = () => {
  const context = useContext(SnackbarContext);

  if (!context) {
    throw new Error('useToast must be used within a SnackbarProvider');
  }

  const { show, close } = context;

  return {
    success: (msg: string, anchorOrigin?: AnchorOrigin) =>
      show(msg, { severity: 'success', anchorOrigin }),
    error: (msg: string, anchorOrigin?: AnchorOrigin) =>
      show(msg, { severity: 'error', anchorOrigin }),
    info: (msg: string, anchorOrigin?: AnchorOrigin) =>
      show(msg, { severity: 'info', anchorOrigin }),
    loading: (msg: string, anchorOrigin?: AnchorOrigin) =>
      show(msg, { severity: 'info', loading: true, anchorOrigin }),
    close,
  };
};
