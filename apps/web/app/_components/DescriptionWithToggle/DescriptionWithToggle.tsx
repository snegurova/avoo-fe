import React, { useState } from 'react';

type Props = {
  description: string;
};

export default function DescriptionWithToggle(props: Props) {
  const { description } = props;
  const [expanded, setExpanded] = useState(false);
  const isLong = description.length > 250;
  const displayText = !expanded && isLong ? description.slice(0, 250) + '...' : description;

  return (
    <div className='flex flex-col'>
      <h2 className='font-medium mb-1'>About</h2>
      <p className='text-sm leading-tight'>{displayText}</p>
      {isLong && (
        <button
          className='text-xs underline mt-2.5 hover:text-primary-500 focus:text-primary-500 transition-colors self-end'
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? 'show less' : 'show more'}
        </button>
      )}
    </div>
  );
}
