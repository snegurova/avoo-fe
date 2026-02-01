import { useRef } from 'react';

type Props = {
  title: string;
  description: string;
  buttonTitle: string;
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
    file,
    icon,
    className,
  } = props;
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  return (
    <div className={className}>
      <button
        type='button'
        aria-label='Upload dnd file'
        className='w-full text-center border-2 border-dashed bg-gray-50 hover:bg-white border-primary-100 hover:border-primary-400 hover:border-primary-500 rounded-lg p-6 text-center cursor-pointer flex flex-col items-center justify-center gap-2 transition-colors'
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const dropped = e.dataTransfer?.files?.[0] ?? null;
          onFilePicked(dropped);
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        {icon ? (
          <div className='rounded-full w-10 h-10 lg:w-20 lg:h-20 bg-primary-100 hover:bg-primary-200 flex items-center justify-center transition-colors'>
            {icon}
          </div>
        ) : null}

        <p className='mb-2 font-semibold'>{file ? file.name : title}</p>
        <p className='text-sm text-gray-500 mb-4'>{description}</p>
        <span className='px-4 py-2 border border-primary-700 text-primary-700 hover:bg-primary-50 hover:text-primary-500 rounded-md inline-block transition-colors transition-text-colors'>
          {buttonTitle}
        </span>
        <input
          id='dndFileInput'
          ref={fileInputRef}
          name='dndFile'
          type='file'
          accept={accept}
          className='hidden'
          onChange={(e) => onFilePicked(e.target.files?.[0] ?? null)}
        />
        {fileError && <p className='text-sm text-red-500 mt-2'>{fileError}</p>}
      </button>
    </div>
  );
}
