import AddIcon from '@/_icons/AddIcon';
import { colors } from '@avoo/design-tokens';
import { useRef } from 'react';
import { tv } from 'tailwind-variants';

type Props = {
  accept: string;
  variant: 'inline' | 'overlay';
  onFilePicked: (file: File | null) => void;
  isUploading: boolean;
};

export default function AddMoreButton(props: Props) {
  const { accept, variant, onFilePicked, isUploading } = props;
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const wrapper = tv({
    base: 'w-[182px] h-[274px] rounded-lg flex-col gap-2 transition-background duration-200 cursor-pointer',
    variants: {
      variant: {
        inline:
          'absolute right-0 bottom-0 bg-white h-[36px] lg:h-[44px] w-[90px] lg:w-[150px] border-2 border-gray-200 flex flex-row items-center justify-center p-2 hover:bg-primary-50',
        overlay:
          'flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-gray-400',
      },
      isUploading: {
        true: 'pointer-events-none border-2 border-blue-400 animate-pulse bg-blue-50',
        false: '',
      },
    },
  });

  const inputWrapper = tv({
    base: 'flex gap-3 hover:bg-primary-50 transition-colors',
    variants: {
      variant: {
        inline: 'items-center justify-center',
        overlay:
          'rounded-full w-10 h-10 lg:w-20 lg:h-20 bg-white border-1 border-gray-100 items-center justify-center',
      },
    },
  });

  const textVariants = tv({
    base: 'text-xs lg:text-base font-medium font-weight-500',
    variants: {
      variant: {
        inline: 'text-black',
        overlay: 'text-gray-500',
      },
    },
  });

  return (
    <button
      type='button'
      disabled={isUploading}
      onClick={() => fileInputRef.current?.click()}
      className={wrapper({ variant, isUploading })}
    >
      <div className={inputWrapper({ variant })}>
        <AddIcon
          fill={variant === 'inline' ? colors.black : colors.primary[300]}
          width={variant === 'inline' ? 24 : 60}
          height={variant === 'inline' ? 24 : 60}
        />
        <input
          id='addFileInput'
          ref={fileInputRef}
          name='addFile'
          type='file'
          accept={accept}
          className='hidden'
          onChange={(e) => onFilePicked(e.target.files?.[0] ?? null)}
          disabled={isUploading}
        />
      </div>
      <span className={textVariants({ variant })}>
        {isUploading ? 'Uploading...' : 'Add photo'}
      </span>
    </button>
  );
}
