'use client';

import { IconButton } from '@/_components/IconButton/IconButton';

type Props = {
  title: string;
  onEdit?: () => void;
};

export const SectionHeader = (props: Props) => {
  const { title, onEdit } = props;

  return (
    <div className='flex items-center justify-between mb-4'>
      <h2 className='text-xl font-bold text-slate-900'>{title}</h2>
      {onEdit && <IconButton icon='✏️' onClick={onEdit} ariaLabel={`Edit ${title}`} />}
    </div>
  );
};
