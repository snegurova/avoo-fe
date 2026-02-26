import React, { useState, useCallback } from 'react';
import { Modal } from '../Modal/Modal';
import { Button, IconButton } from '@mui/material';
// import TimeOffAddModal from '../TimeOffAddModal/TimeOffAddModal';
import ArrowBackIcon from '@/_icons/ArrowBackIcon';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const TimeOffModal = ({ isOpen, onClose }: Props) => {
  const [isTimeOffModalShown, setIsTimeOffModalShown] = useState(false);

  const timeOffList: Array<unknown> = [];

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleOpenAdd = useCallback(() => {
    setIsTimeOffModalShown(true);
    onClose();
  }, [onClose]);

  const handleCloseAdd = useCallback(() => {
    setIsTimeOffModalShown(false);
  }, []);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className='space-y-6 relative min-h-[80vh]'>
          <IconButton
            onClick={handleClose}
            sx={{ position: 'absolute', top: -25, left: -25, zIndex: 10 }}
            aria-label='back'
          >
            <ArrowBackIcon />
          </IconButton>

          <div className='flex items-center justify-center'>
            <h3 className='text-lg font-semibold'>Time off list (Current Exceptions)</h3>
          </div>

          <div>
            {timeOffList.length === 0 ? (
              <div className='py-8 text-center text-sm text-muted'>No Time off submitted</div>
            ) : (
              <ul className='space-y-2'>
                {timeOffList.map((t, idx) => (
                  <li key={idx} className='p-3 border rounded'>
                    Time off item
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className='flex justify-end'>
            <Button
              color='secondary'
              variant='outlined'
              sx={{ minWidth: 150 }}
              onClick={handleOpenAdd}
            >
              Add Time off
            </Button>
          </div>
        </div>
      </Modal>

      {/* <TimeOffAddModal isOpen={isTimeOffModalShown} onClose={handleCloseAdd} /> */}
    </>
  );
};

export default TimeOffModal;
