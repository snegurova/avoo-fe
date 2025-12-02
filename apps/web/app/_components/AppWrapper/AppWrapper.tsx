import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function AppWrapper(props: Props) {
  const { children } = props;

  return <div className='bg-white border border-border2 rounded-2xl w-full'>{children}</div>;
}
