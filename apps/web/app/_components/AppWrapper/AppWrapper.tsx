import { ReactNode } from 'react';
import { tv } from 'tailwind-variants';

type Props = {
  children: ReactNode;
  isWidget?: boolean;
  className?: string;
};

const wrapper = tv({
  base: 'bg-white border border-gray-100 md:rounded-2xl w-full md:min-h-0 flex flex-col overflow-hidden',
  variants: {
    isWidget: {
      true: 'min-h-fit',
    },
  },
});

export default function AppWrapper(props: Props) {
  const { children, isWidget = false, className = '' } = props;

  return <div className={wrapper({ isWidget }) + ' ' + className}>{children}</div>;
}
