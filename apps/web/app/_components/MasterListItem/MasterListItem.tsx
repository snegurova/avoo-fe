'use client';

import React from 'react';
import Avatar, { AvatarSize } from '@/_components/Avatar/Avatar';
import { Typography } from '@mui/material';
import { MasterWithRelationsEntityResponse } from '@avoo/axios/types/apiTypes';
import { colors, typography } from '@avoo/design-tokens';
import MasterLanguageList from '@/_components/MasterLanguageList/MasterLanguageList';
import ShareIcon from '@/_icons/ShareIcon';
import DeleteIcon from '@/_icons/DeleteIcon';
import EditSquareIcon from '@/_icons/EditSquareIcon';
import IconLink from '@/_components/IconLink/IconLink';
import { IconButton } from '@/_components/IconButton/IconButton';

type Props = {
  master: MasterWithRelationsEntityResponse;
  onEdit?: (master: MasterWithRelationsEntityResponse) => void;
  isSelected?: boolean;
};

export const MasterListItem = ({ master, onEdit, isSelected }: Props) => {
  const displayName = master.name || 'No name';
  const phone = master.phone || 'No phone';
  const languagesArr = master.languages || [];

  const handleOpenDetails = () => {
    onEdit?.(master);
  };

  return (
    <div
      className={`rounded-lg lg:rounded-none p-4 lg:py-6 lg:px-8 border lg:border-l-0 lg:border-r-0 transition-colors duration-300 ease-in-out ${
        isSelected ? 'bg-primary-50 border-primary-200' : 'bg-white border-gray-200'
      }`}
      data-selected={isSelected ? 'true' : 'false'}
    >
      <button
        type='button'
        className='flex items-center gap-4 w-full lg:hidden cursor-pointer text-left'
        onClick={handleOpenDetails}
        aria-label={`Open ${displayName} details`}
      >
        <div className='flex-shrink-0'>
          <Avatar
            name={displayName}
            src={master.avatarPreviewUrl ?? master.avatarUrl}
            size={AvatarSize.Large}
            bgColor={colors.primary[200]}
          />
        </div>

        <div className='flex-1'>
          <Typography
            component='div'
            className='break-words whitespace-normal'
            sx={{
              fontFamily: typography.fontFamily.sans,
              fontSize: typography.fontSize.lg,
              fontWeight: typography.fontWeight.bold,
              color: colors.gray[900],
            }}
          >
            {displayName}
          </Typography>
          <div className='text-sm text-gray-500 break-words whitespace-normal'>
            {master.email ?? 'No email'}
          </div>
          <div className='text-sm text-gray-500 mt-1 break-words whitespace-normal'>{phone}</div>

          <div className='md:hidden'>
            <div className='w-full h-px my-3' style={{ backgroundColor: colors.primary[100] }} />
            <MasterLanguageList languages={languagesArr} showLabel />
          </div>
        </div>

        <div className='hidden md:flex md:w-1/4 md:flex-col md:items-end'>
          <MasterLanguageList languages={languagesArr} showLabel />
        </div>
      </button>

      <div className='hidden lg:flex items-center gap-3 w-full min-w-0'>
        <div className='flex items-center gap-3 w-1/5'>
          <Avatar
            name={displayName}
            src={master.avatarPreviewUrl ?? master.avatarUrl}
            size={AvatarSize.Large}
            bgColor={colors.primary[200]}
          />
          <div>
            <Typography
              component='div'
              className='break-words whitespace-normal'
              sx={{
                fontFamily: typography.fontFamily.sans,
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.medium,
                color: colors.gray[700],
              }}
            >
              {displayName}
            </Typography>
          </div>
        </div>
        <div className='w-1/5 text-sm text-gray-700 break-words whitespace-normal'>{phone}</div>
        <div className='w-1/5 text-sm text-gray-700 break-words whitespace-normal'>
          {master.email ?? 'No email'}
        </div>
        <div className='w-1/5 break-words whitespace-normal'>
          <MasterLanguageList languages={languagesArr} />
        </div>
        <div className='w-12 flex items-center gap-2'>
          <IconButton
            icon={<EditSquareIcon />}
            ariaLabel='Edit master'
            onClick={handleOpenDetails}
            className='rounded-full w-10 h-10 flex items-center justify-center hover:text-primary-700 focus:text-primary-700 transition-colors'
          />
          <IconLink icon={<ShareIcon />} href='#' label='Share' />
          <IconLink icon={<DeleteIcon />} href='#' label='Delete' />
        </div>
      </div>
    </div>
  );
};

export default MasterListItem;
