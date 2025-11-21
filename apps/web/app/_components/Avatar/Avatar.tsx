'use client';

type Props = {
  name: string;
  size?: 'small' | 'medium' | 'large';
};

export const Avatar = (props : Props) => {
  const { name, size = 'medium' } = props;
  const sizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-20 h-20',
    large: 'w-32 h-32',
  };

  return (
    <div className='text-center'>
      <div className={`bg-gray-200 rounded-full ${sizeClasses[size]} mx-auto mb-2`} />
      {name && <p className='text-sm font-semibold text-slate-900'>{name}</p>}
    </div>
  );
};
