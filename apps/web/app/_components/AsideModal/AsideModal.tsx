import React, { useEffect, useRef } from 'react';
import { tv } from 'tailwind-variants';
import { IconButton, IconButtonRounded, IconButtonSize } from '@/_components/IconButton/IconButton';
import CloseIcon from '@/_icons/CloseIcon';

type Props = {
  open: boolean;
  handleClose: () => void;
  children: React.ReactNode;
};

const modalStyles = tv({
  base: 'w-full sm:w-93.75 md:w-116.5 fixed top-0 right-0 z-30 border-l border-gray-100 bg-white h-full transform transition-transform duration-300 ease-out translate-x-0 py-15 px-5 md:px-8 lg:px-12',
  variants: {
    open: {
      true: 'translate-x-0',
      false: 'translate-x-full',
    },
  },
});

export default function AsideModal(props: Props) {
  const { open, handleClose, children } = props;
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!modalRef.current) return;

      const path = event.composedPath() as HTMLElement[];
      if (path.includes(modalRef.current)) return;

      const clickedInsideMuiMenu = path.some((el) => {
        if (!(el instanceof HTMLElement)) return false;

        const role = el.getAttribute('role');
        return role === 'menu' || role === 'listbox';
      });

      if (clickedInsideMuiMenu) return;

      handleClose();
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, handleClose]);

  return (
    <div ref={modalRef} className={modalStyles({ open })}>
      <IconButton
        icon={<CloseIcon />}
        onClick={handleClose}
        rounded={IconButtonRounded.Full}
        size={IconButtonSize.Large}
        border
        className='absolute top-6 right-6 z-11'
      />
      {children}
    </div>
  );
}
