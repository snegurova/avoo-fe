'use client';

import { createContext, useState, ReactNode } from 'react';
import { Snackbar, Alert, AlertColor, CircularProgress } from '@mui/material';

export type SnackbarContextType = {
  show: (message: string, options?: { severity?: AlertColor; loading?: boolean }) => void;
  close: () => void;
};

export const SnackbarContext = createContext<SnackbarContextType | null>(null);

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<AlertColor>('info');
  const [isLoading, setIsLoading] = useState(false);

  const show = (msg: string, options: { severity?: AlertColor; loading?: boolean } = {}) => {
    setMessage(msg);
    setSeverity(options.severity || 'info');
    setIsLoading(options.loading || false);
    setOpen(true);
  };

  const close = () => setOpen(false);

  return (
    <SnackbarContext.Provider value={{ show, close }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={isLoading ? null : 4000}
        onClose={isLoading ? undefined : close}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={isLoading ? undefined : close}
          severity={severity}
          icon={isLoading ? <CircularProgress size={20} color='inherit' /> : undefined}
          sx={{ width: '100%' }}
        >
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};
