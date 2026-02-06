import React, { ReactNode } from 'react';
import MuiModal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import CloseIcon from '@/_icons/CloseIcon';
import { IconButton } from '@mui/material';

export enum ModalVariant {
  CENTER = 'center',
  PANEL = 'panel',
}

export type Props = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  variant?: ModalVariant;
  contentStyle?: React.CSSProperties;
};

const centerStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 2,
  p: 4,
  maxHeight: '90vh',
  overflowY: 'auto',
};

const panelStyle = {
  position: 'fixed',
  top: 0,
  left: { xs: 0, md: 'auto' },
  right: 0,
  transform: 'none',
  width: { xs: '100vw', md: 465 },
  maxHeight: '100vh',
  bgcolor: 'background.paper',
  border: '1px solid',
  borderColor: 'grey.200',
  borderRadius: 0,
  pt: '60px',
  pb: '44px',
  px: { xs: '20px', md: '48px' },
  overflow: 'auto',
  transition: 'background-color 200ms ease-in-out, border-color 300ms ease-in-out',
};

export const Modal = (props: Props) => {
  const { isOpen, onClose, children, variant = ModalVariant.CENTER } = props;
  const style = variant === ModalVariant.PANEL ? panelStyle : centerStyle;
  const mergedStyle = { ...style, ...props.contentStyle };
  const slotProps =
    variant === ModalVariant.PANEL
      ? { backdrop: { sx: { backgroundColor: 'transparent' } } }
      : undefined;

  return (
    <MuiModal
      open={isOpen}
      onClose={onClose}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
      slotProps={slotProps}
    >
      <Box sx={mergedStyle} className='hide-scrollbar'>
        {variant === ModalVariant.CENTER && (
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
        )}

        <Box sx={{ width: '100%' }}>{children}</Box>
      </Box>
    </MuiModal>
  );
};
