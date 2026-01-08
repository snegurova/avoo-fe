import React from 'react';
import { tv } from 'tailwind-variants';
import { ElementStyleType } from '@avoo/hooks/types/elementStyleType';

type Props = {
  options: { icon?: React.ReactNode; label: string; handler: () => void }[];
  closeDropdown: () => void;
  type?: ElementStyleType;
};

const dropdownList = tv({
  base: 'absolute top-full min-w-max translate-y-2 overflow-hidden rounded-2xl z-15 right-0 bg-white border border-gray-200',
  variants: {
    type: {
      outline: 'py-4 px-3 translate-x-2',
      solid: 'p-3',
    },
  },
});

const button = tv({
  base: 'w-full cursor-pointer text-start transition-colors rounded-xl flex items-center gap-2.5',
  variants: {
    type: {
      outline:
        'text-gray-700 font-medium p-2 text-sm leading-[1.15] hover:bg-primary-50 focus:bg-primary-50',
      solid: 'text-black p-2.5 leading-none hover:bg-primary-100 focus:bg-primary-100',
    },
  },
});

export default function DropdownList(props: Props) {
  const { options, closeDropdown, type = ElementStyleType.SOLID } = props;

  return (
    <ul className={dropdownList({ type })}>
      {options.map((option, index) => (
        <li key={index}>
          <button
            className={button({ type })}
            onClick={() => {
              option.handler();
              closeDropdown();
            }}
          >
            {option.icon && option.icon}
            {option.label}
          </button>
        </li>
      ))}
    </ul>
  );
}
