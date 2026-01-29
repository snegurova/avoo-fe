'use client';

import { createContext, useState, ReactNode } from 'react';
import { Snackbar, Alert, AlertColor, CircularProgress } from '@mui/material';
import { AnchorHorizontal, AnchorOrigin, AnchorVertical } from '@avoo/hooks/types/snackbar';


export type SnackbarContextType = {
  show: (
    message: string,
    options?: {
      severity?: AlertColor;
      loading?: boolean;
      anchorOrigin?: AnchorOrigin;
    },
  ) => void;
  close: () => void;
};

export const SnackbarContext = createContext<SnackbarContextType | null>(null);

export const SnackbarProvider = ({
  children,
  defaultAnchor,
}: {
  children: ReactNode;
  defaultAnchor?: AnchorOrigin;
}) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<AlertColor>('info');
  const [isLoading, setIsLoading] = useState(false);
  const [anchorOrigin, setAnchorOrigin] = useState<AnchorOrigin>(
    defaultAnchor ?? { vertical: AnchorVertical.Top, horizontal: AnchorHorizontal.Right },
  );

  const show = (
    msg: string,
    options: {
      severity?: AlertColor;
      loading?: boolean;
      anchorOrigin?: AnchorOrigin;
    } = {},
  ) => {
    setMessage(msg);
    setSeverity(options.severity || 'info');
    setIsLoading(options.loading || false);
    if (options.anchorOrigin) setAnchorOrigin(options.anchorOrigin);
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
    setAnchorOrigin(
      defaultAnchor ?? { vertical: AnchorVertical.Top, horizontal: AnchorHorizontal.Right },
    );
  };

  return (
    <SnackbarContext.Provider value={{ show, close }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={isLoading ? null : 4000}
        onClose={isLoading ? undefined : close}
        anchorOrigin={anchorOrigin}
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
