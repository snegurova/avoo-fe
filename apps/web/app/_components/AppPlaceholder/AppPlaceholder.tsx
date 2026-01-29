import React from 'react';

type Props = {
  title: string;
  icon: React.ReactNode;
  description: React.ReactNode;
};

export default function AppPlaceholder({ title, icon, description }: Props) {
  return (
    <div className='flex justify-center items-center flex-col grow h-full gap-8'>
      <div className='rounded-full w-30 h-30 lg:w-37.5 lg:h-37.5 bg-primary-50 flex items-center justify-center'>
        {icon}
      </div>
      <div className='max-w-62 md:max-w-90 flex flex-col gap-3 items-center'>
        <h3 className='text-xl md:text-2xl font-medium text-center'>{title}</h3>
        <div className='text-center text-gray-500 text-xs'>{description}</div>
      </div>
    </div>
  );
}
