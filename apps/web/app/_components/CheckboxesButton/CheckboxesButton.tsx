import React, { useState, useRef, useEffect } from 'react';
import { tv } from 'tailwind-variants';
import ArrowDownIcon from '@/_icons/ArrowDownIcon';
import CheckboxesList from '../CheckboxesList/CheckboxesList';

type Props = {
  addCount?: boolean;
  label: string;
  options: {
    label: string;
    handler: () => void;
    items?: { label: string | null; id: number | string; handler: () => void }[];
  }[];
  values: ((string | number)[] | boolean | undefined)[];
};

const selectButton = tv({
  base: 'rounded-2xl cursor-pointer flex items-center text-gray-800 border border-gray-200 bg-transparent gap-2 px-3 py-[7px] text-sm leading-none hover:bg-gray-100 focus:bg-gray-100 transition-colors',
});

const selectIcon = tv({
  base: 'transition-transform fill-gray-800 w-3.5 h-3.5',
  variants: {
    open: {
      true: '-scale-y-100',
    },
  },
});

export default function CheckboxesButton(props: Props) {
  const { addCount = false, label, options, values } = props;
  const ref = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [counter, setCounter] = useState(options[0].items?.length || 0);

  useEffect(() => {
    let count = 0;
    values.forEach((val, index) => {
      if (val === undefined) {
        count += options[index].items?.length || 0;
      } else if (Array.isArray(val)) {
        count += val.length;
      }
    });
    setCounter(count);
  }, [values, options]);

  const toggleOpen = () => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (ref.current && !ref.current.contains(target)) {
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
    <div className='relative' ref={ref}>
      <button className={selectButton()} onClick={toggleOpen}>
        {addCount &&
          (options[0].items?.length ? (
            <span className='w-5 h-5 flex items-center justify-center rounded-full bg-primary-500 text-white text-sm font-medium -mr-1'>
              {counter}
            </span>
          ) : (
            <span className='-mr-1'>All</span>
          ))}
        <span className='capitalize'>{label}</span>
        <ArrowDownIcon className={selectIcon({ open: isOpen })} />
      </button>
      {isOpen && <CheckboxesList options={options} values={values} />}
    </div>
  );
}
