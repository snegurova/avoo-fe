'use client';

import { IconButton, IconButtonVariant } from '@/_components/IconButton/IconButton';
import EditSquareIcon from '@/_icons/EditSquareIcon';

type Props = {
  title: string;
  onEdit?: () => void;
  headingSize?: string;
};

export const SectionHeader = (props: Props) => {
  const { title, onEdit, headingSize = 'text-xl' } = props;

  return (
    <div className='flex items-center justify-between mb-4'>
      <h2 className={`${headingSize} font-bold text-slate-900`}>{title}</h2>
      {onEdit && (
        <IconButton
          icon={<EditSquareIcon fill='currentColor' />}
          variant={IconButtonVariant.Secondary}
          onClick={onEdit}
          ariaLabel={`Edit ${title}`}
          className='flex items-center justify-center p-2.5 cursor-pointer hover:bg-primary-50'
        />
      )}
    </div>
  );
};
