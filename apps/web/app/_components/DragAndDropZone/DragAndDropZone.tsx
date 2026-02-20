import React, { useRef } from 'react';
import { tv } from 'tailwind-variants';

type Props = {
  title: string;
  description: string;
  buttonTitle: string;
  isUploading: boolean;
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
    description = 'Drag and drop or click to upload',
    buttonTitle = 'SELECT FILE',
    accept = '.jpg,.png',
    onFilePicked,
    fileError,
    icon,
    isUploading,
    variant = 'base',
    displayButton = true,
    className,
  } = props;
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const buttonVariants = tv({
    base: 'w-full text- border-1 border-dashed border-primary-400 hover:bg-white border-primary-100 hover:border-primary-500 rounded-lg p-6 text-center cursor-pointer flex flex-col items-center justify-center gap-2 transition-colors',
    variants: {
      isUploading: {
        true: 'pointer-events-none border-2 border-blue-400 animate-pulse bg-blue-50',
        false: '',
      },
    },
  });

  const iconVariants = tv({
    base: 'rounded-full w-10 h-10 lg:w-20 lg:h-20 bg-primary-50 hover:bg-primary-100 flex items-center justify-center transition-colors',
    variants: {
      variant: {
        outline: 'border-1 border-gray-100 bg-white',
        base: '',
      },
      isUploading: {
        true: 'bg-primary-100',
        false: '',
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
        {icon ? <div className={iconVariants({ isUploading, variant })}>{icon}</div> : null}

        <p className='mb-2 font-semibold'>
          {isUploading ? 'Uploading file. Please wait...' : title}
        </p>
        <p className='text-sm text-gray-500 mb-4'>
          {isUploading ? 'It may take a few seconds' : description}
        </p>
        {displayButton && (
          <span className='px-4 py-2 border border-primary-700 text-primary-700 hover:bg-primary-50 hover:text-primary-500 rounded-md inline-block transition-colors transition-text-colors'>
            {isUploading ? 'Uploading...' : buttonTitle}
          </span>
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
