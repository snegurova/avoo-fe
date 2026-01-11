'use client';

import React from 'react';
import { Avatar, ButtonBase } from '@mui/material';
import { utilsHooks } from '@/_utils/utilsHooks';
import { AVATAR_DOWNLOAD_FORMATS } from '@/_constants/files';
import AvatarLoader from '../AvatarLoader/AvatarLoader';

export enum AvatarSize {
  SMALL = 64,
  MEDIUM = 80,
  LARGE = 96,
}

type Props = {
  imageUri: string | null;
  onImageSelected: (file: File) => void;
  isLoading: boolean;
  size?: AvatarSize;
};

export const AvatarUpload = (props: Props) => {
  const { imageUri, onImageSelected, isLoading, size = AvatarSize.LARGE } = props;

  const handleChoosePhoto = (event: React.ChangeEvent<HTMLInputElement>) => {
    utilsHooks.handleFileChange(event, onImageSelected);
  };

  return (
    <ButtonBase
      component='label'
      tabIndex={-1}
      aria-label='Avatar image'
      className='relative rounded-full [clip-path:circle(50%)] focus-visible:ring-2 focus-visible:ring-primary-500'
      disabled={isLoading}
    >
      <Avatar
        alt='Upload new avatar'
        sx={{ width: size, height: size }}
        src={imageUri ?? undefined}
      />
      {isLoading && <AvatarLoader size={size} />}
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
