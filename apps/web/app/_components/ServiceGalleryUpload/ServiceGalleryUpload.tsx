import DragAndDropZone from '../DragAndDropZone/DragAndDropZone';
import { colors } from '@avoo/design-tokens';
import { UploadMediaResponse } from '@avoo/axios/types/apiTypes';
import AddMoreButton from '../AddMoreButton/AddMoreButton';
import BackupIcon from '@/_icons/BackupIcon';
import { tv } from 'tailwind-variants';
import CloseIcon from '@/_icons/CloseIcon';

type Props = {
  id: string;
  medias: UploadMediaResponse[];
  onFilePicked: (file: File | null) => void;
  onRemove: (id: number) => void;
  isUploading: boolean;
};

export default function ServiceGalleryUpload(props: Props) {
  const { id, medias, onFilePicked, onRemove, isUploading } = props;

  const accept = '.jpg,.png';

  const imageVariants = tv({
    base: 'h-[274px] rounded-lg overflow-hidden relative overflow-hidden group transition-opacity',
    variants: {
      wide: {
        true: 'col-span-2',
        false: 'col-span-1',
      },
    },
  });

  const isWide = (index: number) => {
    const i = index % 12;
    return i === 3 || i === 5 || i === 11;
  };

  const isLast = (total: number, itemPerRow: number) => {
    return total % itemPerRow === 0;
  };

  return (
    <div id={id}>
      {
        <>
          {medias.length > 0 ? (
            <ul id='gallery-uploader' className='grid grid-cols-5 gap-4 w-full relative'>
              {medias.map((media, index) => {
                const wide = isWide(index);
                const lastIndex = index === medias.length - 1;
                return (
                  <li key={media.id} className={imageVariants({ wide })}>
                    <img src={media.url} alt='media' className='w-full h-full object-cover' />

                    <button
                      onClick={() => onRemove(media.id)}
                      className='
        absolute top-0 right-0 
        border-1 border-gray-100
        w-8 h-8 bg-white hover:bg-primary-50
        text-black rounded-full 
        flex items-center justify-center 
        opacity-0 group-hover:opacity-100 
        duration-200 z-20
        cursor-pointer
      '
                      type='button'
                    >
                      <CloseIcon fill={colors.black} width={20} height={20} />
                    </button>

                    {lastIndex && isLast(medias.length, 4) && (
                      <AddMoreButton
                        variant='inline'
                        accept={accept}
                        onFilePicked={onFilePicked}
                        isUploading={isUploading}
                      />
                    )}
                  </li>
                );
              })}

              {!isLast(medias.length, 4) && (
                <li className='h-[274px] col-span-1'>
                  <AddMoreButton
                    variant='overlay'
                    accept={accept}
                    onFilePicked={onFilePicked}
                    isUploading={isUploading}
                  />
                </li>
              )}
            </ul>
          ) : (
            <div className='flex flex-col items-center justify-center'>
              <DragAndDropZone
                title='Select a file or drag and drop here'
                description='Upload up to 5 images (JPG, PNG only, max 10MB each)'
                buttonTitle='Select file'
                accept={accept}
                onFilePicked={onFilePicked}
                icon={<BackupIcon fill={colors.primary[300]} width={60} height={60} />}
                isUploading={isUploading}
                className='min-w-[477px]'
              />
            </div>
          )}
        </>
      }
    </div>
  );
}
