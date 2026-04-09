import React from 'react';

import { colors } from '@avoo/design-tokens';

import { IconButton, IconButtonVariant } from '@/_components/IconButton/IconButton';
import EditSquareIcon from '@/_icons/EditSquareIcon';

import Avatar, { AvatarSize } from '../Avatar/Avatar';

interface Props {
  imageUrl: string;
  title: string;
  date: string;
  master: string;
  masterAvatarUrl?: string | null;
  description?: string;
  onEdit?: () => void;
}

export const ProfileCertificateCard = ({
  imageUrl,
  title,
  date,
  master,
  masterAvatarUrl,
  description,
  onEdit,
}: Props) => {
  return (
    <article
      className={`
        flex flex-col
        bg-primary-50 border border-gray-200 rounded-lg
        p-2 pb-4 gap-6
        w-[335px] h-[350px]
        md:w-[295px] md:h-auto
        md:gap-4
        md:p-2
        md:pb-4
        transition-all
      `}
    >
      <div className='w-full h-[180px] md:h-[160px] overflow-hidden'>
        <img src={imageUrl} alt={title} className='object-cover w-full h-full' />
      </div>

      <div className='flex flex-col gap-3 md:gap-2 flex-1'>
        <div className='flex items-start justify-between gap-2'>
          <div className='min-w-0 flex-1 flex flex-col gap-3 md:gap-2'>
            <h4 className='text-sm font-semibold truncate'>{title}</h4>
            <div className='flex items-center gap-2 text-xs text-gray-700'>
              <span>{date}</span>
              <div className='flex items-center gap-1 min-w-0 flex-1'>
                <Avatar
                  name={master}
                  src={masterAvatarUrl}
                  size={AvatarSize.Small}
                  bgColor={colors.primary[200]}
                />
                <span className='truncate'>{master}</span>
              </div>
            </div>
          </div>

          {onEdit ? (
            <IconButton
              icon={<EditSquareIcon fill='currentColor' />}
              variant={IconButtonVariant.Secondary}
              onClick={onEdit}
              ariaLabel={`Edit ${title}`}
              className='flex items-center justify-center p-2.5 cursor-pointer'
            />
          ) : null}
        </div>

        <p className='text-xs text-gray-600 mt-1 line-clamp-3 leading-[1.2] md:hidden'>
          {description}
        </p>
      </div>
    </article>
  );
};

export default ProfileCertificateCard;
