import React from 'react';
import { tv } from 'tailwind-variants';

type Props = {
  option: { icon?: React.ReactNode; label: string | React.ReactNode; handler: () => void };
  isActive?: boolean;
};

const button = tv({
  base: 'w-full cursor-pointer text-start transition-colors rounded-md flex items-center gap-2.5 text-gray-700 font-medium p-2 text-sm leading-[1.15] hover:bg-primary-100 focus:bg-primary-100',
  variants: {
    isActive: {
      true: 'bg-primary-100',
    },
  },
});

export default function CheckboxesListButton(props: Props) {
  const { option, isActive } = props;

  return (
    <button className={button({ isActive })} onClick={option.handler}>
      {option.icon && option.icon}
      {option.label}
    </button>
  );
}
