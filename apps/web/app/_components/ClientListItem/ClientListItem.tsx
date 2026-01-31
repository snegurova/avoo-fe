'use client';

import React from 'react';
import Avatar, { AvatarSize } from '@/_components/Avatar/Avatar';
import { Typography } from '@mui/material';
import type { CustomerInfoResponse } from '@avoo/axios/types/apiTypes';
import { colors, typography } from '@avoo/design-tokens';
import { timeUtils } from '@avoo/shared';

type Props = {
  client: CustomerInfoResponse;
  onEdit?: (id: number) => void;
};

const ClientListItem: React.FC<Props> = ({ client, onEdit }) => {
  const clientDisplayName = client.name || 'No name';
  const phone = client.phone || 'No phone';
  const formattedLastVisit = timeUtils.formatLastVisitDate(client.lastVisit) ?? '-';
  const handleOpenDetails = () => {
    onEdit?.(client.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleOpenDetails();
    }
  };

  return (
    <div className='bg-white rounded-lg lg:rounded-none p-4 lg:py-6 lg:px-8 border border-gray-200 lg:border-l-0 lg:border-r-0'>
      <div
        className='flex items-center gap-4 w-full lg:hidden cursor-pointer'
        role='button'
        tabIndex={0}
        onClick={handleOpenDetails}
        onKeyDown={handleKeyDown}
        aria-label={`Open ${clientDisplayName} details`}
      >
        <div className='flex-shrink-0'>
          <Avatar
            name={clientDisplayName}
            src={undefined}
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
            {clientDisplayName}
          </Typography>
          <div className='text-sm text-gray-500 break-words whitespace-normal'>
            {client.email ?? 'No email'}
          </div>
          <div className='text-sm text-gray-500 mt-1 break-words whitespace-normal'>{phone}</div>

          <div className='md:hidden'>
            <div className='w-full h-px my-3' style={{ backgroundColor: colors.primary[100] }} />
            <div className='text-sm text-gray-500'>last visit {formattedLastVisit}</div>
          </div>
        </div>

        <div className='hidden md:flex text-sm text-gray-500'>last visit {formattedLastVisit}</div>
      </div>

      <div
        className='hidden lg:flex items-center gap-3 w-full min-w-0 cursor-pointer'
        role='button'
        tabIndex={0}
        onClick={handleOpenDetails}
        onKeyDown={handleKeyDown}
        aria-label={`Open ${clientDisplayName} details`}
      >
        <div className='flex items-center gap-3 w-1/4'>
          <Avatar
            name={clientDisplayName}
            src={undefined}
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
              {clientDisplayName}
            </Typography>
          </div>
        </div>

        <div className='w-1/4 text-sm text-gray-700 break-words whitespace-normal'>{phone}</div>
        <div className='w-1/4 text-sm text-gray-700 break-words whitespace-normal'>
          {client.email ?? 'No email'}
        </div>
        <div className='w-1/4 break-words whitespace-normal text-center'>{formattedLastVisit}</div>
      </div>
    </div>
  );
};

export default ClientListItem;
