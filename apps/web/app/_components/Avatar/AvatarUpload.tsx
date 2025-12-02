'use client';

import React from 'react';
import { useRef } from 'react';
import Image from 'next/image';
import { CircularProgress } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { tv } from 'tailwind-variants';
import { utilsHooks } from '@/_utils/utilsHooks';

export enum AvatarSize {
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
}

const avatarContainer = tv({
  base: 'relative bg-gray-200 rounded-full mx-auto overflow-hidden',
  variants: {
    size: {
      [AvatarSize.Small]: 'w-12 h-12',
      [AvatarSize.Medium]: 'w-20 h-20',
      [AvatarSize.Large]: 'w-32 h-32',
    },
    isLoading: {
      true: 'cursor-not-allowed',
      false: 'cursor-pointer',
    },
  },
  defaultVariants: {
    size: AvatarSize.Medium,
    isLoading: false,
  },
});

const loadingContainer = tv({
  base: 'w-full h-full flex items-center justify-center bg-gray-200',
});

const placeholderContainer = tv({
  base: 'w-full h-full flex items-center justify-center bg-gray-200 text-gray-400',
});

const icon = tv({
  variants: {
    size: {
      [AvatarSize.Small]: 'w-6 h-6',
      [AvatarSize.Medium]: 'w-10 h-10',
      [AvatarSize.Large]: 'w-16 h-16',
    },
  },
  defaultVariants: {
    size: AvatarSize.Medium,
  },
});

const iconSizes = {
  [AvatarSize.Small]: 24,
  [AvatarSize.Medium]: 40,
  [AvatarSize.Large]: 64,
};

const progressSizes = {
  [AvatarSize.Small]: 20,
  [AvatarSize.Medium]: 30,
  [AvatarSize.Large]: 40,
};

type Props = {
  size?: AvatarSize;
  imageUri: string | null;
  onImageSelected: (file: File) => void;
  isLoading: boolean;
};

export const AvatarUpload = (props: Props) => {
  const { size = AvatarSize.Medium, imageUri, onImageSelected, isLoading } = props;

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (!isLoading) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    utilsHooks.handleFileChange(event, onImageSelected, fileInputRef);
  };
  
  return (
    <div
      className={avatarContainer({ size, isLoading })}
      onClick={handleClick}
    >
      {isLoading ? (
        <div className={loadingContainer()}>
          <CircularProgress size={progressSizes[size]} />
        </div>
      ) : imageUri ? (
          <Image
            src={imageUri}
            alt='Avatar'
            fill
            className='object-cover'
            priority
            unoptimized
          />
      ) : (
        <div className={placeholderContainer()}>
          <PersonIcon
            className={icon({ size })}
            sx={{ fontSize: iconSizes[size] }}
          />
        </div>
      )}
      <input
        ref={fileInputRef}
        type='file'
        accept='image/jpeg,image/jpg,image/png,image/webp'
        className='hidden'
        onChange={handleFileChange}
        disabled={isLoading}
      />
    </div>
  );
};

