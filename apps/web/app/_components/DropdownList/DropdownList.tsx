import React from 'react';
import { tv } from 'tailwind-variants';

type Props = {
  options: { label: string; handler: () => void }[];
  closeDropdown: () => void;
  isRight?: boolean;
  type?: 'solid' | 'outline';
};

const dropdownList = tv({
  base: 'absolute top-full min-w-max translate-y-1 overflow-hidden rounded-2xl z-15',
  variants: {
    right: {
      true: 'right-0',
      false: 'left-0',
    },
    type: {
      outline: 'bg-white py-4 px-3 border border-controlsBorder',
      solid: '',
    },
  },
});

const button = tv({
  base: 'w-full cursor-pointer text-start transition-colors',
  variants: {
    type: {
      outline:
        'text-dropdownText font-medium p-2 text-sm leading-[1.15] rounded-xl hover:bg-light focus:bg-light',
      solid: 'text-white bg-black px-6 py-2.5 ',
    },
  },
});

export default function DropdownList(props: Props) {
  const { options, closeDropdown, isRight = false, type = 'solid' } = props;

  return (
    <ul className={dropdownList({ right: isRight, type })}>
      {options.map((option, index) => (
        <li key={index}>
          <button
            className={button({ type })}
            onClick={() => {
              option.handler();
              closeDropdown();
            }}
          >
            {option.label}
          </button>
        </li>
      ))}
    </ul>
  );
}
