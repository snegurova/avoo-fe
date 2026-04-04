'use client';
import { Avatar as MuiAvatar, AvatarProps as MuiAvatarProps } from '@mui/material';
import { tv } from 'tailwind-variants';

import { colors } from '@avoo/design-tokens';
import { getAvatarColor } from '@avoo/shared';

import { utilsHooks } from '@/_utils/utilsHooks';

export enum AvatarSize {
  Small = 16,
  Medium = 32,
  Large = 40,
}

const sizeConfig = {
  [AvatarSize.Small]: {
    width: 16,
    height: 16,
    fontSize: 10,
  },
  [AvatarSize.Medium]: {
    width: 32,
    height: 32,
    fontSize: 20,
  },
  [AvatarSize.Large]: {
    width: 40,
    height: 40,
    fontSize: 20,
  },
};

type Props = {
  name?: string | null;
  src?: string | null;
  size?: AvatarSize | number;
  addName?: boolean;
  bgColor?: string;
  textColor?: string;
} & Omit<MuiAvatarProps, 'src' | 'sx'>;

export default function Avatar(props: Props) {
  const {
    name,
    src,
    addName,
    size = AvatarSize.Large,
    textColor = colors.black,
    bgColor = colors.primary[200],
    ...rest
  } = props;

  const config =
    typeof size === 'number'
      ? { width: size, height: size, fontSize: Math.max(10, Math.floor(size / 2)) }
      : sizeConfig[size];

  const avatar = tv({
    base: 'rounded-full mx-auto flex items-center justify-center text-xl font-medium',
    variants: {
      size: {
        [AvatarSize.Small]: 'text-xs',
        [AvatarSize.Medium]: 'text-sm',
        [AvatarSize.Large]: 'text-base',
      },
      addName: {
        true: 'mb-1',
      },
    },
  });

  return (
    <div className='text-center'>
      <div className={avatar({ size, addName })}>
        <MuiAvatar
          src={src ?? undefined}
          alt={name || ''}
          sx={{
            width: config.width,
            height: config.height,
            bgcolor: !src ? getAvatarColor(name) : bgColor,
            fontSize: config.fontSize,
            fontWeight: 500,
            fontFamily: 'Roboto',
            lineHeight: '100%',
            color: textColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
          {...rest}
        >
          {!src && utilsHooks.getInitials(name || 'A')}
        </MuiAvatar>
      </div>
      {addName && name && (
        <p className='leading-none text-xs font-semibold text-black truncate'>{name}</p>
      )}
    </div>
  );
}
