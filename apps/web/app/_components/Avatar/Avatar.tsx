'use client';
import { Avatar as MuiAvatar, AvatarProps as MuiAvatarProps } from '@mui/material';
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
  name: string;
  src?: string | null;
  size?: AvatarSize;
  bgColor?: string;
  textColor?: string;
} & Omit<MuiAvatarProps, 'src' | 'sx'>;

export default function Avatar(props: Props) {
  const {
    name,
    src,
    size = AvatarSize.Large,
    bgColor = '#9E9E9E',
    textColor = '#000000',
    ...rest
  } = props;

  const config = sizeConfig[size];

  return (
    <MuiAvatar
      src={src ?? undefined}
      alt={name}
      sx={{
        width: config.width,
        height: config.height,
        bgcolor: !src ? bgColor : undefined,
        fontSize: config.fontSize,
        fontWeight: 500,
        fontFamily: 'Roboto',
        lineHeight: '100%',
        color: textColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      {...rest}
    >
      {!src && utilsHooks.getInitials(name)}
    </MuiAvatar>
  );
}
