'use client';

import React from 'react';
import Avatar, { AvatarSize } from '@/_components/Avatar/Avatar';
import { MasterWithRelationsEntityResponse } from '@avoo/axios/types/apiTypes';
import { colors, typography, radius } from '@avoo/design-tokens';
import MasterLanguageList from '@/_components/MasterLanguageList/MasterLanguageList';
import ShareIcon from '@/_icons/ShareIcon';
import EditIcon from '@/_icons/EditIcon';
import DeleteIcon from '@/_icons/DeleteIcon';
import {
  IconButton,
  IconButtonSize,
  IconButtonRounded,
  IconButtonVariant,
} from '@/_components/IconButton/IconButton';

type Props = {
  master: MasterWithRelationsEntityResponse;
};

export const MasterListItem = ({ master }: Props) => {
  const displayName = master.name || 'No name';
  const phone = master.phone || 'No phone';

  return (
    <div
      className='bg-white rounded-lg p-3'
      style={{ border: `1px solid ${colors.gray[200]}`, borderRadius: radius.md }}
    >
      <div className='flex items-center gap-3 w-full'>
        <div className='flex items-center gap-3 w-2/5'>
          <Avatar
            name={displayName}
            src={master.avatarPreviewUrl ?? master.avatarUrl}
            size={AvatarSize.Medium}
            bgColor={colors.primary[500]}
          />
          <div>
            <div
              style={{
                fontFamily: typography.fontFamily.sans,
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.medium,
                color: colors.gray[700],
              }}
            >
              {displayName}
            </div>
            <div className='text-xs text-gray-400'>Master</div>
          </div>
        </div>

        <div className='w-1/5 text-sm text-gray-700'>{phone}</div>

        <div className='w-1/5 text-sm text-blue-600'>{master.email ?? 'No email'}</div>

        <div className='w-1/5'>
          <MasterLanguageList languages={master.languages || []} />
        </div>

        <div className='w-12 flex justify-end items-center gap-2'>
          <IconButton
            icon={<EditIcon />}
            ariaLabel='Edit'
            size={IconButtonSize.Small}
            rounded={IconButtonRounded.Md}
            variant={IconButtonVariant.Default}
          />
          <IconButton
            icon={<ShareIcon />}
            ariaLabel='Share'
            size={IconButtonSize.Small}
            rounded={IconButtonRounded.Md}
            variant={IconButtonVariant.Default}
          />
          <IconButton
            icon={<DeleteIcon />}
            ariaLabel='Delete'
            size={IconButtonSize.Small}
            rounded={IconButtonRounded.Md}
            variant={IconButtonVariant.Default}
          />
        </div>
      </div>
    </div>
  );
};

export default MasterListItem;
