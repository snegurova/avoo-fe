import React from 'react';

import LanguageSwitcher from '@/_components/LanguageSwitcher/LanguageSwitcher';

type Props = {
  children?: React.ReactNode;
};

export default function PublicHeader(props: Props) {
  const { children } = props;

  return (
    <header className='border-b border-gray-200 2xl:border-b-0'>
      <div className='container mx-auto'>
        <div className='2xl:border-b border-gray-200 py-2 flex items-center justify-between gap-4 px-5 lg:px-6'>
          <div className=''>{children}</div>
          <LanguageSwitcher type='public' />
        </div>
      </div>
    </header>
  );
}
