'use client';
import { tv } from 'tailwind-variants';

export enum AvatarSize {
  Small = 16,
  Medium = 32,
  Large = 40,
}

type Props = {
  name?: string | null;
  size?: AvatarSize;
  imageUrl?: string;
  idx?: number;
  addName?: boolean;
};

const avatar = tv({
  base: 'rounded-full mx-auto flex items-center justify-center text-xl font-medium',
  variants: {
    size: {
      [AvatarSize.Small]: 'w-10 h-10',
      [AvatarSize.Medium]: 'w-20 h-20',
      [AvatarSize.Large]: 'w-32 h-32',
    },
    addName: {
      true: 'mb-2',
    },
    idx: {
      0: 'bg-avatar',
      1: 'bg-avatar1',
      2: 'bg-avatar2',
    },
  },
});

export const CalendarAvatar = (props: Props) => {
  const { name, size = AvatarSize.Medium, idx, addName } = props;

  return (
    <div className='text-center'>
      <div className={avatar({ size, addName, idx: (idx ? idx % 3 : 0) as 0 | 1 | 2 })}>
        {name && <span>{name.charAt(0).toUpperCase()}</span>}
      </div>
      {addName && name && <p className='leading-none text-sm font-semibold text-time'>{name}</p>}
    </div>
  );
};
