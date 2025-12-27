import React, { ReactNode } from 'react';
import MuiModal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import CloseIcon from '@/_icons/CloseIcon';
import { IconButton } from '@mui/material';
export type Props = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};
const style = {
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
export const Modal = (props: Props) => {
  const { isOpen, onClose, children } = props;
  return (
    <MuiModal
      open={isOpen}
      onClose={onClose}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box sx={style} className='hide-scrollbar'>
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
        <Box>{children}</Box>
      </Box>
    </MuiModal>
  );
};
