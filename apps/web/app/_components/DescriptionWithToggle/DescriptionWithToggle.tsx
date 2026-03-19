import React, { useState } from 'react';
import { useTranslations } from 'next-intl';

type Props = {
  description: string;
};

export default function DescriptionWithToggle(props: Props) {
  const t = useTranslations('public.salon.page');
  const { description } = props;
  const [expanded, setExpanded] = useState(false);
  const isLong = description.length > 250;
  const displayText = !expanded && isLong ? description.slice(0, 250) + '...' : description;

  return (
    <div className='flex flex-col'>
      <h2 className='font-medium mb-1'>{t('about')}</h2>
      <p className='text-sm leading-tight'>{displayText}</p>
      {isLong && (
        <button
          className='text-xs underline mt-2.5 hover:text-primary-500 focus:text-primary-500 transition-colors self-end'
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? t('showLess') : t('showMore')}
        </button>
      )}
    </div>
  );
}
