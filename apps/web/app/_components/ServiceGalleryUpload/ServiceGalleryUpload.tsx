import React, { useRef } from 'react';
import DragAndDropZone from '../DragAndDropZone/DragAndDropZone';
import AddPhotoIcon from '@/_icons/AddPhotoIcon';
import { colors } from '@avoo/design-tokens';
import { UploadMediaResponse } from '@avoo/axios/types/apiTypes';

type Props = {
  id: string;
  medias: UploadMediaResponse[];
  onFilePicked: (file: File | null) => void;
};

export default function ServiceGalleryUpload(props: Props) {
  const { id, medias, onFilePicked } = props;
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div id={id}>
      {
        <div className='flex items-center justify-center'>
          {medias.length > 0 ? (
            <ul id='gallery-uploader' className='flex flex-wrap gap-4 w-full'>
              {medias.map((media) => (
                <li
                  key={media.id}
                  className='rounded-lg overflow-hidden max-w-[182px] h-[274px] object-cover'
                >
                  <img src={media.url} alt='media' className='w-full h-full object-cover' />
                </li>
              ))}
              <button
                type='button'
                onClick={() => fileInputRef.current?.click()}
                className='flex items-center justify-center w-[182px] h-[274px] border-2 border-dashed border-gray-300 rounded-lg'
              >
                <div className='rounded-full w-10 h-10 lg:w-20 lg:h-20 bg-primary-100 hover:bg-primary-200 flex items-center justify-center transition-colors'>
                  <AddPhotoIcon fill={colors.primary[300]} width={60} height={60} />
                  <input
                    id='dndFileInput'
                    ref={fileInputRef}
                    name='dndFile'
                    type='file'
                    accept='.jpg,.png'
                    className='hidden'
                    onChange={(e) => onFilePicked(e.target.files?.[0] ?? null)}
                  />
                </div>
              </button>
            </ul>
          ) : (
            <DragAndDropZone
              title='Select a file or drag and drop here'
              description='Upload up to 5 images (JPG, PNG only, max 10MB each)'
              buttonTitle='Select file'
              accept='.jpg,.png'
              onFilePicked={onFilePicked}
              icon={<AddPhotoIcon fill={colors.primary[300]} width={60} height={60} />}
            />
          )}
        </div>
      }
    </div>
  );
}
