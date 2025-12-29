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
      [AvatarSize.Small]: 'w-4 h-4',
      [AvatarSize.Medium]: 'w-8 h-8',
      [AvatarSize.Large]: 'w-8 h-8 md:w-10 md:h-10',
    },
    addName: {
      true: 'mb-1 md:mb-2',
    },
    idx: {
      0: 'bg-primary-200',
      1: 'bg-blue-200',
      2: 'bg-orange-200',
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
      {addName && name && (
        <p className='leading-[1.1] md:leading-none text-xs md:text-sm font-semibold text-black'>
          {name}
        </p>
      )}
    </div>
  );
};
