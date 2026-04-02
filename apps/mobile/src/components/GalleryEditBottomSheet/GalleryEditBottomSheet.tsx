import { MediaEntity } from '@avoo/axios/types/apiTypes';

import { GalleryEditForm } from '@/components/GalleryEditForm/GalleryEditForm';
import { CustomBottomSheet } from '@/shared/CustomBottomSheet/CustomBottomSheet';

type Props = {
  initialMedias: MediaEntity[];
  userId: number | null;
  visible: boolean;
  onClose: () => void;
};

export const GalleryEditBottomSheet = (props: Props) => {
  const { initialMedias, userId, visible, onClose } = props;

  return (
    <CustomBottomSheet visible={visible} onClose={onClose} disableSwipeToClose>
      <GalleryEditForm initialMedias={initialMedias} userId={userId} onClose={onClose} />
    </CustomBottomSheet>
  );
};
