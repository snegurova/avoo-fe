import React from 'react';

import { tv } from 'tailwind-variants';

type Props = {
  variant?: 'global' | 'card' | 'minimal';
};

export default function Loader(props: Props) {
  const { variant = 'global' } = props;

  const loaderWrapper = tv({
    base: 'flex items-center justify-center',
    variants: {
      variant: {
        global: 'top-0 left-0 w-full h-full absolute bg-white/40 z-900 transition-colors',
        card: 'p-4 bg-white rounded-lg w-full',
        minimal: '',
      },
    },
    defaultVariants: {
      variant: 'global',
    },
  });

  return (
    <div className={loaderWrapper({ variant })}>
      <span className='loader' />
    </div>
  );
}
