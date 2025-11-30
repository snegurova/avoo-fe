import ArrowDownIcon from '@/_icons/ArrowDownIcon';
import React, { useState } from 'react';

type Props = {
  label: string;
  options: { label: string; handler: () => void }[];
};

export default function SelectButton(props: Props) {
  const { label, options } = props;
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className='relative'>
      <button
        className='px-6 py-2.5 rounded-2xl text-white bg-black cursor-pointer flex gap-6 items-center'
        onClick={toggleOpen}
      >
        <span>{label}</span>
        <ArrowDownIcon
          className={`fill-white transition-transform ${isOpen ? '-scale-y-100' : ''}`}
        />
      </button>
      {isOpen && (
        <ul className='absolute top-full left-0 min-w-max translate-y-1 overflow-hidden rounded-2xl'>
          {options.map((option, index) => (
            <li key={index}>
              <button
                className='text-white bg-black px-6 py-2.5 w-full cursor-pointer'
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
