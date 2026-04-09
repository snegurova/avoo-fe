import React from 'react';

export type AddPhotosTriggerProps = {
  onClick: () => void;
  children: React.ReactNode;
};

export const AddPhotosTrigger = ({ onClick, children }: AddPhotosTriggerProps) => {
  return (
    <button type='button' onClick={onClick} className='text-primary-300'>
      {children}
    </button>
  );
};
