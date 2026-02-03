import ArrowDownIcon from '@/_icons/ArrowDownIcon';
import React, { useState, useCallback, useRef } from 'react';
import { tv } from 'tailwind-variants';
import DropdownList from '@/_components/DropdownList/DropdownList';
import { ElementStyleType } from '@avoo/hooks/types/elementStyleType';

type Props = {
  label: string;
  options: { label: string; handler: () => void }[];
  type?: ElementStyleType;
};

const selectButton = tv({
  base: 'rounded-2xl cursor-pointer flex items-center transition-colors',
  variants: {
    type: {
      solid: 'text-white bg-black gap-6 px-6 py-2.5',
      outline:
        'text-gray-800 border border-gray-200 bg-transparent gap-2 px-3 py-2.5 text-sm leading-none hover:bg-gray-100 focus:bg-gray-100',
    },
  },
});

const selectIcon = tv({
  base: 'transition-transform',
  variants: {
    open: {
      true: '-scale-y-100',
    },
    type: {
      outline: 'fill-gray-800 w-3.5 h-3.5',
      solid: 'fill-white',
    },
  },
});

export default function SelectButton(props: Props) {
  const { label, options, type = ElementStyleType.SOLID } = props;
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const toggleOpen = () => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (selectRef.current && !selectRef.current.contains(target)) {
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
    <div className='relative' ref={selectRef}>
      <button className={selectButton({ type })} onClick={toggleOpen}>
        <span className='capitalize'>{label}</span>
        <ArrowDownIcon className={selectIcon({ open: isOpen, type })} />
      </button>
      {isOpen && <DropdownList options={options} closeDropdown={closeDropdown} type={type} />}
    </div>
  );
}
