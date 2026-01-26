'use client';

import React from 'react';
import { Avatar, ButtonBase } from '@mui/material';
import { utilsHooks } from '@/_utils/utilsHooks';
import { AVATAR_DOWNLOAD_FORMATS } from '@/_constants/files';
import AvatarLoader from '../AvatarLoader/AvatarLoader';
import EditIcon from '@/_icons/EditIcon';

export enum AvatarSize {
  SMALL = 64,
  MEDIUM = 80,
  LARGE = 96,
  XLARGE = 150,
}

type Props = {
  imageUri: string | null;
  onImageSelected: (file: File) => void;
  isLoading: boolean;
  size?: AvatarSize;
  showEditIcon?: boolean;
};

export const AvatarUpload = (props: Props) => {
  const {
    imageUri,
    onImageSelected,
    isLoading,
    size = AvatarSize.LARGE,
    showEditIcon = false,
  } = props;

  const handleChoosePhoto = (event: React.ChangeEvent<HTMLInputElement>) => {
    utilsHooks.handleFileChange(event, onImageSelected);
  };

  return (
    <ButtonBase
      component='label'
      tabIndex={-1}
      aria-label='Avatar image'
      className='relative rounded-full overflow-visible focus-visible:ring-2 focus-visible:ring-primary-500'
      disabled={isLoading}
    >
      {imageUri ? (
        <Avatar alt='Upload new avatar' sx={{ width: size, height: size }} src={imageUri} />
      ) : (
        <Avatar
          alt='Upload new avatar'
          sx={{ width: size, height: size }}
          style={{ backgroundColor: 'var(--color-primary-50)' }}
        >
          <svg
            width={Math.min(88, Math.floor(size * 0.6))}
            height={Math.min(88, Math.floor(size * 0.6))}
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            aria-hidden
          >
            <circle
              cx='12'
              cy='7.5'
              r='3.5'
              stroke='var(--color-primary-200)'
              strokeWidth='2'
              fill='none'
            />
            <path
              d='M3.5 20c0-4.5 5-7 8.5-7s8.5 2.5 8.5 7'
              stroke='var(--color-primary-200)'
              strokeWidth='2'
              fill='none'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </Avatar>
      )}
      {isLoading && <AvatarLoader size={size} />}
      {showEditIcon && (
        <div className='absolute -bottom-1 -right-1 bg-white rounded-full border border-gray-200 shadow-sm w-11 h-11 p-3 flex items-center justify-center text-gray-300'>
          <EditIcon width={20} height={20} />
        </div>
      )}
      <input
        type='file'
        accept={AVATAR_DOWNLOAD_FORMATS}
        className='sr-only'
        onChange={handleChoosePhoto}
      />
    </ButtonBase>
  );
};

export default AvatarUpload;
