import React from 'react';

import PublicFooter from '@/_components/PublicFooter/PublicFooter';
import PublicHeader from '@/_components/PublicHeader/PublicHeader';

type Props = {
  children?: React.ReactNode;
  headerChildren?: React.ReactNode;
  classes?: string;
};

export default function PublicWrapper(props: Props) {
  const { children, headerChildren, classes } = props;

  return (
    <div className='min-h-screen flex flex-col'>
      <PublicHeader>{headerChildren}</PublicHeader>
      <main className={`container mx-auto flex-1 flex flex-col ${classes}`}>{children}</main>
      <PublicFooter />
    </div>
  );
}
