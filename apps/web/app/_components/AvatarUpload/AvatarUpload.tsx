'use client';

import React from 'react';

import { Avatar, ButtonBase, IconButton } from '@mui/material';

import { AVATAR_DOWNLOAD_FORMATS } from '@/_constants/files';
import EditIcon from '@/_icons/EditIcon';
import PersonIcon from '@/_icons/PersonIcon';
import { utilsHooks } from '@/_utils/utilsHooks';

import AvatarLoader from '../AvatarLoader/AvatarLoader';

export enum AvatarSize {
  SMALL = 64,
  MEDIUM = 80,
  LARGE = 96,
  PROFILE = 104,
  XLARGE = 150,
}

type Props = {
  imageUri: string | null;
  onImageSelected: (file: File) => void;
  isLoading: boolean;
  size?: AvatarSize;
  iconSize?: number;
  framed?: boolean;
  showEditIcon?: boolean;
  editIcon?: React.ReactNode;
  placeholderIcon?: React.ReactNode;
};

export const AvatarUpload = (props: Props) => {
  const {
    imageUri,
    onImageSelected,
    isLoading,
    size = AvatarSize.LARGE,
    iconSize = 125,
    framed = false,
    showEditIcon = false,
    editIcon = <EditIcon />,
    placeholderIcon,
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
    <div
      className={`relative inline-block rounded-full ${
        framed ? 'bg-white p-[6px] shadow-[0_6px_20px_rgba(15,23,42,0.10)]' : ''
      }`}
    >
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
            {placeholderIcon ?? <PersonIcon width={iconSize} height={iconSize} />}
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
            {editIcon}
          </IconButton>
        </div>
      )}
    </div>
  );
};

export default AvatarUpload;
