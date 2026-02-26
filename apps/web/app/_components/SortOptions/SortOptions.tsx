import { useState } from 'react';
import SortIcon from '@/_icons/SortIcon';
import ArrowDownIcon from '@/_icons/ArrowDownIcon';

type Props = {
  onSelect: (value: string) => void;
  options: { label: string; value: string }[];
  className?: string;
};

export default function SortOptions(props: Props) {
  const { options, className, onSelect } = props;
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div className={className}>
      <button
        className='flex gap-2 items-center justify-between border border-gray-300 rounded-3xl lg:rounded-lg px-3 py-2 h-9 min-w-40 max-w-50 md:bg-white'
        onClick={() => setShowOptions(!showOptions)}
      >
        <SortIcon width={24} height={24} />
        <span className='text-small'>Sort by:</span>
        <ArrowDownIcon width={24} height={24} />
      </button>
      {showOptions && (
        <ul className='absolute top-full left-0 bg-white border border-gray-300 rounded-lg mt-1 w-full p-2'>
          {options.map((option) => (
            <li
              key={option.value}
              className='cursor-pointer hover:bg-gray-100 px-2 py-1 rounded'
              onClick={() => onSelect(option.value)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
