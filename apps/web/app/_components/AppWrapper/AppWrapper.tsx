import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  classes?: string;
};

export default function AppWrapper(props: Props) {
  const { children, classes } = props;

  return (
    <div className={`bg-white border border-border2 rounded-2xl ${classes || ''}`}>{children}</div>
  );
}
