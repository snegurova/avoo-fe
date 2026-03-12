import React from 'react';

import { Box, Slide } from '@mui/material';
import MuiModal from '@mui/material/Modal';
import { tv } from 'tailwind-variants';

import { IconButton, IconButtonRounded, IconButtonSize } from '@/_components/IconButton/IconButton';
import CloseIcon from '@/_icons/CloseIcon';

type Props = {
  open: boolean;
  handleClose: () => void;
  children: React.ReactNode;
  contentStyle?: React.CSSProperties;
};

const wrapperStyles = tv({
  base: 'w-full md:w-116.5 fixed top-0 right-0 z-30 border-l border-gray-100 bg-white h-full translate-x-0 py-12 px-5 lg:px-12 lg:py-16',
  variants: {
    open: {
      true: 'translate-x-0',
      false: 'translate-x-full',
    },
  },
});

const style = {
  position: 'fixed',
  top: 0,
  left: { xs: 0, md: 'auto' },
  right: 0,
  transform: 'none',
  width: { xs: '100vw', md: 465 },
  height: '100vh',
  minHeight: '100vh',
  maxHeight: '100vh',
  bgcolor: 'background.paper',
  border: '1px solid',
  borderColor: 'grey.200',
  borderRadius: 0,
  pt: '60px',
  pb: '44px',
  px: { xs: '20px', md: '48px' },
  overflow: 'auto',
  boxSizing: 'border-box',
  transition: 'background-color 200ms ease-in-out, border-color 300ms ease-in-out',
};

export default function AsideModal(props: Props) {
  const { open, handleClose, children } = props;
  const mergedStyle = { ...style, ...props.contentStyle };

  return (
    <MuiModal
      open={open}
      onClose={handleClose}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
      slotProps={{ backdrop: { sx: { backgroundColor: 'transparent' } } }}
      closeAfterTransition
    >
      <Slide direction='left' in={open} timeout={300} mountOnEnter unmountOnExit>
        <Box sx={mergedStyle} className='hide-scrollbar'>
          <Box sx={{ width: '100%' }}>
            <div className={wrapperStyles({ open })}>
              <IconButton
                icon={<CloseIcon />}
                onClick={handleClose}
                rounded={IconButtonRounded.Full}
                size={IconButtonSize.Large}
                border
                className='absolute top-2 right-4 md:right-5 lg:right-6 lg:top-6 z-11'
              />
              {children}
            </div>
          </Box>
        </Box>
      </Slide>
    </MuiModal>
  );
}
