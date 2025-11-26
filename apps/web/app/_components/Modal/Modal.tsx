import React, { useState, useEffect, ReactNode, useRef } from 'react';
import { createPortal } from 'react-dom';

export type Props = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

export const Modal = ({ isOpen, onClose, children }: Props) => {
  const [mounted, setMounted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      className='fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50'
      onClick={handleOverlayClick}
    >
      <div
        className='bg-white p-6 rounded-lg shadow-lg max-w-sm w-full max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200'
        ref={modalRef}
      >
        <button
          onClick={onClose}
          className='float-right text-gray-600 hover:text-gray-800 cursor-pointer'
        >
          &times;
        </button>
        {children}
      </div>
    </div>,
    document.body,
  );
};
