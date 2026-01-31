import { useContext } from 'react';
import { SnackbarContext } from '../_providers/SnackbarContextProvider';

export const useToast = () => {
  const context = useContext(SnackbarContext);

  if (!context) {
    throw new Error('useToast must be used within a SnackbarProvider');
  }

  const { show, close } = context;

  return {
    success: (msg: string) => show(msg, { severity: 'success' }),
    error: (msg: string) => show(msg, { severity: 'error' }),
    info: (msg: string) => show(msg, { severity: 'info' }),
    loading: (msg: string) => show(msg, { severity: 'info', loading: true }),
    close,
  };
};
