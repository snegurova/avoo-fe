import { tv } from 'tailwind-variants';
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
  isSmall?: boolean;
  addButtonPosition?: 'last' | 'first';
};

export default function ServiceGalleryUpload(props: Props) {
  const {
    id,
    medias,
    onFilePicked,
    onRemove,
    isUploading,
    isSmall = false,
    addButtonPosition = 'last',
  } = props;
  const accept = '.jpg,.png';

  const imagePerRow = isSmall ? 3 : 4;

  const imageVariants = tv({
    base: 'gallery-item-height rounded-lg overflow-hidden relative overflow-hidden group transition-opacity',
    variants: {
      wide: {
        true: 'col-span-2',
        false: 'col-span-1',
      },
      isSmall: {
        true: 'h-[165px]',
        false: '',
      },
    },
  });

  const galleryWrapper = tv({
    base: 'gallery-item-height',
    variants: {
      isSmall: {
        true: 'min-w-[270px] h-[165px]',
        false: 'min-w-[477px]',
      },
    },
  });

  const imageWrapper = tv({
    base: 'grid gap-1 lg:gap-4 w-full relative',
    variants: {
      isSmall: {
        true: 'grid-cols-3',
        false: 'grid-cols-5',
      },
    },
  });

  const buttonWrapper = tv({
    base: 'gallery-item-height',
    variants: {
      isSmall: {
        true: 'h-[165px]',
        false: '',
      },
    },
  });

  const isWide = (index: number) => {
    if (isSmall) {
      const i = index % 5;
      return i === 4;
    }
    const i = index % 12;
    return i === 3 || i === 5 || i === 11;
  };

  const isLast = (total: number, itemPerRow: number) => {
    if (isSmall) {
      return total % 5 === 0;
    }
    return total % itemPerRow === 0;
  };

  const indexRemove = addButtonPosition === 'first' ? 0 : 1;

  return (
    <div id={id}>
      {
        <>
          {medias.length > 0 ? (
            <ul id='gallery-uploader' className={imageWrapper({ isSmall })}>
              {addButtonPosition === 'first' && (
                <li key='add-more-button' className={buttonWrapper({ isSmall })}>
                  <DragAndDropZone
                    title='Add photo'
                    buttonTitle='Select file'
                    accept={accept}
                    onFilePicked={onFilePicked}
                    icon={<AddIcon fill={colors.primary[300]} width={60} height={60} />}
                    isUploading={isUploading}
                    isSmall={isSmall}
                    displayButton={false}
                    variant='outline'
                    className='h-full'
                  />
                </li>
              )}

              {medias.map((media, index) => {
                const wide = isWide(index + 1 - indexRemove);
                const lastIndex = index === medias.length - 1;
                return (
                  <li key={media.id} className={imageVariants({ wide, isSmall })}>
                    <img src={media.url} alt='media' className='w-full h-full object-cover' />

                    <button
                      onClick={() => onRemove(media.id)}
                      className='gallery-remove-button'
                      type='button'
                    >
                      <CloseIcon
                        fill={colors.black}
                        width={isSmall ? 16 : 20}
                        height={isSmall ? 16 : 20}
                      />
                    </button>

                    {addButtonPosition === 'last' &&
                      lastIndex &&
                      isLast(medias.length, imagePerRow) && (
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

              {addButtonPosition === 'last' && !isLast(medias.length, imagePerRow) && (
                <li key='add-more-button' className={buttonWrapper({ isSmall })}>
                  <DragAndDropZone
                    title='Add photo'
                    buttonTitle='Select file'
                    accept={accept}
                    onFilePicked={onFilePicked}
                    icon={<AddIcon fill={colors.primary[300]} width={60} height={60} />}
                    isUploading={isUploading}
                    isSmall={isSmall}
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
                description={isSmall ? '' : 'Upload up to 5 images (JPG, PNG only, max 10MB each)'}
                buttonTitle='Select file'
                accept={accept}
                onFilePicked={onFilePicked}
                icon={<BackupIcon fill={colors.primary[300]} width={60} height={60} />}
                isUploading={isUploading}
                className={galleryWrapper({ isSmall })}
              />
            </div>
          )}
        </>
      }
    </div>
  );
}
