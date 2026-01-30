import React, { useEffect, useRef } from 'react';
import { tv } from 'tailwind-variants';

type Props = {
  open: boolean;
  handleClose: () => void;
  children: React.ReactNode;
};

const modalStyles = tv({
  base: 'fixed top-0 right-0 z-30 border-l border-gray-100 bg-white h-full transform transition-transform duration-300 ease-out translate-x-0 py-15 px-12',
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
    const handlePointerDown = (event: PointerEvent) => {
      if (!modalRef.current) return;
      if (!modalRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown, true);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown, true);
    };
  }, [open, handleClose]);

  return (
    <div ref={modalRef} className={modalStyles({ open })}>
      {children}
    </div>
  );
}
