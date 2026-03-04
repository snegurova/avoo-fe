import { memo } from 'react';

import { tv } from 'tailwind-variants';

import VisibilityIcon from '@/_icons/VisibilityIcon';
import VisibilityOffIcon from '@/_icons/VisibilityOffIcon';

type Props = {
  value: boolean;
  toggle: () => void;
};

const iconClass = tv({
  base: 'fill-gray-500 h-5 w-5 group-hover:fill-gray-700 group-focus:fill-gray-700 transition-colors',
});

const ShowPasswordToggler = memo((props: Props) => {
  const { value, toggle } = props;

  return (
    <button
      type='button'
      onClick={toggle}
      className='h-full flex justify-center cursor-pointer group'
    >
      {value ? (
        <VisibilityIcon className={iconClass()} />
      ) : (
        <VisibilityOffIcon className={iconClass()} />
      )}
    </button>
  );
});

ShowPasswordToggler.displayName = 'ShowPasswordToggler';

export default ShowPasswordToggler;
