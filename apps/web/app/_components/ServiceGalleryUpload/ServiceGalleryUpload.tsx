import React from 'react';
import DragAndDropZone from '../DragAndDropZone/DragAndDropZone';
import AddPhotoIcon from '@/_icons/AddPhotoIcon';
import { colors } from '@avoo/design-tokens';

type Props = {
  id: string;
};

export default function ServiceGalleryUpload(props: Props) {
  const { id } = props;
  return (
    <div id={id}>
      {
        <div className='flex items-center justify-center'>
          <DragAndDropZone
            title='Select a file or drag and drop here'
            description='Upload up to 5 images (JPG, PNG only, max 10MB each)'
            buttonTitle='Select file'
            accept='.jpg,.png'
            onFilePicked={() => {}}
            icon={<AddPhotoIcon fill={colors.primary[300]} width={60} height={60} />}
          />
        </div>
      }
    </div>
  );
}
