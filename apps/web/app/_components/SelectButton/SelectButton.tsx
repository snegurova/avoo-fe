import ArrowDownIcon from '@/_icons/ArrowDownIcon';
import React, { useState, useCallback } from 'react';
import { tv } from 'tailwind-variants';
import DropdownList from '@/_components/DropdownList/DropdownList';

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

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <div className='relative select-button-container'>
      <button
        type='button'
        className='px-6 py-2.5 rounded-2xl text-white bg-black cursor-pointer flex gap-6 items-center'
        onClick={toggleOpen}
      >
        <span>{label}</span>
        <ArrowDownIcon className={selectButton({ open: isOpen })} />
      </button>
      {isOpen && <DropdownList options={options} closeDropdown={closeDropdown} />}
    </div>
  );
}
