'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';

import { Avatar, ButtonBase, IconButton } from '@mui/material';

import { FILE_UPLOAD_TYPE_ENUM } from '@avoo/axios/types/apiEnums';
import { FileEntity } from '@avoo/axios/types/apiTypes';
import { filesHooks } from '@avoo/hooks';

import { AVATAR_DOWNLOAD_FORMATS } from '@/_constants/files';
import { useToast } from '@/_hooks/useToast';
import CheckCircle from '@/_icons/CheckCircle';
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
  isLoading: boolean;
  imageUri?: string | null;
  onAvatarSave?: (avatar: FileEntity) => void;
  size?: AvatarSize;
  iconSize?: number;
  framed?: boolean;
  confirmSave?: boolean;
  showEditIcon?: boolean;
  editIcon?: React.ReactNode;
  placeholderIcon?: React.ReactNode;
};

export const AvatarUpload = (props: Props) => {
  const t = useTranslations('private.components.AvatarUpload.AvatarUpload');
  const {
    imageUri,
    isLoading,
    size = AvatarSize.LARGE,
    iconSize = 125,
    framed = false,
    showEditIcon = false,
    confirmSave = false,
    editIcon = <EditIcon />,
    placeholderIcon,
    onAvatarSave,
  } = props;

  const toast = useToast();

  const [newAvatar, setNewAvatar] = useState<FileEntity | null>(null);

  const { uploadFile, isPending } = filesHooks.useUploadFile({
    onSuccess: (data) => {
      setNewAvatar(data);
      if (!confirmSave) {
        onAvatarSave?.(data);
      }
      toast.success('Avatar uploaded! Click Save to apply changes.');
    },
    onError: (error) => {
      toast.error('Failed to upload avatar: ' + error.message);
    },
  });

  const handleAvatarUpload = (file: File) => {
    uploadFile({
      file,
      type: FILE_UPLOAD_TYPE_ENUM.AVATAR,
    });
  };

  const handleSaveAvatarClick = () => {
    if (newAvatar) {
      onAvatarSave?.(newAvatar);
      toast.success('Avatar saved!');
      setNewAvatar(null);
      return;
    }
    toast.error('No new avatar to save');
  };

  const handleChoosePhoto = (event: React.ChangeEvent<HTMLInputElement>) => {
    utilsHooks.handleFileChange(event, handleAvatarUpload);
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

  const displayUri = newAvatar?.url || imageUri;
  const isBusy = isLoading || isPending;

  return (
    <div
      className={`relative inline-block rounded-full ${
        framed ? 'bg-white p-[6px] shadow-[0_6px_20px_rgba(15,23,42,0.10)]' : ''
      }`}
    >
      <ButtonBase
        component='label'
        tabIndex={-1}
        aria-label={t('avatarImage')}
        className='rounded-full overflow-hidden focus-visible:ring-2 focus-visible:ring-primary-500 block'
        sx={{ borderRadius: '50%', overflow: 'hidden' }}
        disabled={isBusy}
      >
        {displayUri ? (
          <Avatar alt='Upload new avatar' sx={{ width: size, height: size }} src={displayUri} />
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
        {isBusy && <AvatarLoader size={size} />}
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
          {newAvatar && confirmSave ? (
            <IconButton
              className='avatar-edit'
              aria-label={t('saveAvatar')}
              size='small'
              onClick={handleSaveAvatarClick}
              disabled={isBusy}
            >
              <CheckCircle />
            </IconButton>
          ) : (
            <IconButton
              className='avatar-edit'
              aria-label={t('editAvatar')}
              size='small'
              onClick={handleEditClick}
              onKeyDown={handleEditKey}
              disabled={isBusy}
            >
              {editIcon}
            </IconButton>
          )}
        </div>
      )}
    </div>
  );
};

export default AvatarUpload;
