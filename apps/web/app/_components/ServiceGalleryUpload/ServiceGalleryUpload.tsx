import { tv } from 'tailwind-variants';
import { useMediaQuery } from '@mui/material';
import { colors } from '@avoo/design-tokens';
import { UploadMediaResponse } from '@avoo/axios/types/apiTypes';
import DragAndDropZone from '@/_components/DragAndDropZone/DragAndDropZone';
import AddMoreButton from '@/_components/AddMoreButton/AddMoreButton';
import BackupIcon from '@/_icons/BackupIcon';
import CloseIcon from '@/_icons/CloseIcon';
import AddIcon from '@/_icons/AddIcon';

type Props = {
  id: string;
  medias: UploadMediaResponse[];
  onFilePicked: (file: File | null) => void;
  onRemove: (id: number) => void;
  isUploading: boolean;
};

export default function ServiceGalleryUpload(props: Props) {
  const { id, medias, onFilePicked, onRemove, isUploading } = props;
  const isMobile = useMediaQuery('(max-width: 767px)');
  const accept = '.jpg,.png';

  const imagePerRow = isMobile ? 3 : 4;

  const imageVariants = tv({
    base: 'gallery-item-height rounded-lg overflow-hidden relative overflow-hidden group transition-opacity',
    variants: {
      wide: {
        true: 'col-span-2',
        false: 'col-span-1',
      },
    },
  });

  const isWide = (index: number) => {
    if (isMobile) {
      const i = index % 5;
      return i === 4;
    }
    const i = index % 12;
    return i === 3 || i === 5 || i === 11;
  };

  const isLast = (total: number, itemPerRow: number) => {
    if (isMobile) {
      return total % 5 === 0;
    }
    return total % itemPerRow === 0;
  };

  return (
    <div id={id}>
      {
        <>
          {medias.length > 0 ? (
            <ul
              id='gallery-uploader'
              className='grid grid-cols-3 md:grid-cols-5 gap-1 lg:gap-4 w-full relative'
            >
              {medias.map((media, index) => {
                const wide = isWide(index);
                const lastIndex = index === medias.length - 1;
                return (
                  <li key={media.id} className={imageVariants({ wide })}>
                    <img src={media.url} alt='media' className='w-full h-full object-cover' />

                    <button
                      onClick={() => onRemove(media.id)}
                      className='gallery-remove-button'
                      type='button'
                    >
                      <CloseIcon
                        fill={colors.black}
                        width={isMobile ? 16 : 20}
                        height={isMobile ? 16 : 20}
                      />
                    </button>

                    {lastIndex && isLast(medias.length, imagePerRow) && (
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

              {!isLast(medias.length, imagePerRow) && (
                <li className='gallery-item-height col-span-1'>
                  <DragAndDropZone
                    title='Add photo'
                    buttonTitle='Select file'
                    accept={accept}
                    onFilePicked={onFilePicked}
                    icon={<AddIcon fill={colors.primary[300]} width={60} height={60} />}
                    isUploading={isUploading}
                    displayButton={false}
                    variant='outline'
                    className='h-full'
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
                className='lg:min-w-[477px] min-w-[270px] gallery-item-height'
              />
            </div>
          )}
        </>
      }
    </div>
  );
}
