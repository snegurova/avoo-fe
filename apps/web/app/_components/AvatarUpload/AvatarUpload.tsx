'use client';

import React from 'react';
import { Avatar, ButtonBase, IconButton } from '@mui/material';
import PersonIcon from '@/_icons/PersonIcon';
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
  iconSize?: number;
  showEditIcon?: boolean;
};

export const AvatarUpload = (props: Props) => {
  const {
    imageUri,
    onImageSelected,
    isLoading,
    size = AvatarSize.LARGE,
    iconSize = 125,
    showEditIcon = false,
  } = props;

  const handleChoosePhoto = (event: React.ChangeEvent<HTMLInputElement>) => {
    utilsHooks.handleFileChange(event, onImageSelected);
  };

  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const handleEditClick = () => {
    if (isLoading) return;
    inputRef.current?.click();
  };

  const handleEditKey = (evt: React.KeyboardEvent) => {
    if (evt.key === 'Enter' || evt.key === ' ') {
      evt.preventDefault();
      handleEditClick();
    }
  };

  return (
    <div className='relative inline-block'>
      <ButtonBase
        component='label'
        tabIndex={-1}
        aria-label='Avatar image'
        className='rounded-full overflow-hidden focus-visible:ring-2 focus-visible:ring-primary-500 block'
        sx={{ borderRadius: '50%', overflow: 'hidden' }}
        disabled={isLoading}
      >
        {imageUri ? (
          <Avatar alt='Upload new avatar' sx={{ width: size, height: size }} src={imageUri} />
        ) : (
          <Avatar
            alt='Upload new avatar'
            sx={{
              width: size,
              height: size,
              bgcolor: 'var(--color-primary-50)',
              color: 'var(--color-primary-200)',
            }}
          >
            <PersonIcon width={iconSize} height={iconSize} />
          </Avatar>
        )}
        {isLoading && <AvatarLoader size={size} />}
        <input
          ref={inputRef}
          type='file'
          accept={AVATAR_DOWNLOAD_FORMATS}
          className='sr-only'
          onChange={handleChoosePhoto}
        />
      </ButtonBase>

      {showEditIcon && (
        <div className='absolute -bottom-1 -right-1'>
          <IconButton
            className='avatar-edit'
            aria-label='Edit avatar'
            size='small'
            onClick={handleEditClick}
            onKeyDown={handleEditKey}
            disabled={isLoading}
          >
            <EditIcon />
          </IconButton>
        </div>
      )}
    </div>
  );
};

export default AvatarUpload;
