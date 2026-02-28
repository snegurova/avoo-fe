import React, { useRef } from 'react';
import { tv } from 'tailwind-variants';

type Props = {
  title: string;
  buttonTitle: string;
  isUploading: boolean;
  isSmall?: boolean;
  description?: string;
  displayButton?: boolean;
  variant?: 'outline' | 'base';
  accept?: string;
  onFilePicked: (file: File | null) => void;
  fileError?: string;
  file?: File | null;
  icon?: React.ReactNode;
  className?: string;
};

export default function DragAndDropZone(props: Props) {
  const {
    title = 'Upload file',
    description,
    buttonTitle = 'SELECT FILE',
    accept = '.jpg,.png',
    onFilePicked,
    fileError,
    icon,
    isUploading,
    isSmall = false,
    variant = 'base',
    displayButton = true,
    className,
  } = props;
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const buttonVariants = tv({
    base: 'drag-and-drop-zone',
    variants: {
      isUploading: {
        true: 'pointer-events-none border-2 border-blue-400 animate-pulse bg-blue-50',
        false: '',
      },
    },
  });

  const iconVariants = tv({
    base: 'drag-and-drop-icon',
    variants: {
      variant: {
        outline: 'border-1 border-gray-100 bg-white hover:bg-primary-100',
        base: '',
      },
      isUploading: {
        true: 'bg-primary-100',
        false: '',
      },
      isSmall: {
        true: 'w-12 h-12',
        false: 'w-16 h-16',
      },
    },
  });

  return (
    <div className={className}>
      <button
        type='button'
        aria-label='Upload dnd file'
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const dropped = e.dataTransfer?.files?.[0] ?? null;
          onFilePicked(dropped);
        }}
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className={buttonVariants({ isUploading })}
      >
        {icon ? <div className={iconVariants({ isUploading, variant, isSmall })}>{icon}</div> : null}

        <p className='lg:mb-2 text-xs lg:text-sm font-semibold '>
          {isUploading ? 'Uploading...' : title}
        </p>

        {description && (
          <p className='text-xs lg:text-sm text-gray-500 lg:mb-4'>
            {isUploading ? 'It may take a few seconds' : description}
          </p>
        )}
        {displayButton && (
          <span className='drag-and-drop-button'>{isUploading ? 'Uploading...' : buttonTitle}</span>
        )}
        <input
          id='dndFileInput'
          ref={fileInputRef}
          name='dndFile'
          type='file'
          accept={accept}
          className='hidden'
          onChange={(e) => onFilePicked(e.target.files?.[0] ?? null)}
          disabled={isUploading}
        />
        {fileError && <p className='text-sm text-red-500 mt-2'>{fileError}</p>}
      </button>
    </div>
  );
}
