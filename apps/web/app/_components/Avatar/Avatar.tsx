'use client';

export enum AvatarSize {
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
}

type Props = {
  name: string;
  size?: AvatarSize;
};

export const Avatar = (props : Props) => {
  const { name, size = AvatarSize.Medium } = props;
  const sizeClasses = {
    [AvatarSize.Small]: 'w-12 h-12',
    [AvatarSize.Medium]: 'w-20 h-20',
    [AvatarSize.Large]: 'w-32 h-32',
  };

  return (
    <div className='text-center'>
      <div className={`bg-gray-200 rounded-full ${sizeClasses[size]} mx-auto mb-2`} />
      {name && <p className='text-sm font-semibold text-slate-900'>{name}</p>}
    </div>
  );
};
