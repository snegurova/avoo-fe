import ArrowDownIcon from '@/_icons/ArrowDownIcon';
import React, { useEffect, useState } from 'react';
import { tv } from 'tailwind-variants';

type Props = {
  label: string;
  options: { label: string; handler: () => void }[];
};

const selectButton = tv({
  base: 'fill-white transition-transform',
  variants: {
    open: {
      true: '-scale-y-100',
    },
  },
});

export default function SelectButton(props: Props) {
  const { label, options } = props;
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.select-button-container')) {
        setIsOpen(false);
      }
    };
    if (!isOpen) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }

    setIsOpen((prev) => !prev);
  };

  return (
    <div className='relative select-button-container'>
      <button
        className='px-6 py-2.5 rounded-2xl text-white bg-black cursor-pointer flex gap-6 items-center'
        onClick={toggleOpen}
      >
        <span>{label}</span>
        <ArrowDownIcon className={selectButton({ open: isOpen })} />
      </button>
      {isOpen && (
        <ul className='absolute top-full left-0 min-w-max translate-y-1 overflow-hidden rounded-2xl'>
          {options.map((option, index) => (
            <li key={index}>
              <button
                className='text-white bg-black px-6 py-2.5 w-full cursor-pointer text-start'
                onClick={() => {
                  option.handler();
                  setIsOpen(false);
                }}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
