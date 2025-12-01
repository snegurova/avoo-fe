import React from 'react';
import { tv } from 'tailwind-variants';

type Props = {
  options: { label: string; handler: () => void }[];
  closeDropdown: () => void;
  isRight?: boolean;
};

const dropdownList = tv({
  base: 'absolute top-full min-w-max translate-y-1 overflow-hidden rounded-2xl',
  variants: {
    right: {
      true: 'right-0',
      false: 'left-0',
    },
  },
});

export default function DropdownList(props: Props) {
  const { options, closeDropdown, isRight = false } = props;

  return (
    <ul className={dropdownList({ right: isRight })}>
      {options.map((option, index) => (
        <li key={index}>
          <button
            className='text-white bg-black px-6 py-2.5 w-full cursor-pointer text-start'
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
