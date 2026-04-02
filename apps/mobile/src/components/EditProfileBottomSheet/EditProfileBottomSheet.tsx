import { EditProfileForm, ProfileData } from '@/components/EditProfileForm/EditProfileForm';
import { CustomBottomSheet } from '@/shared/CustomBottomSheet/CustomBottomSheet';

type Props = {
  profileInfo: ProfileData;
  visible: boolean;
  onClose: () => void;
};

export const EditProfileBottomSheet = (props: Props) => {
  const { profileInfo, visible, onClose } = props;

  return (
    <CustomBottomSheet visible={visible} onClose={onClose} disableSwipeToClose>
      <EditProfileForm profileInfo={profileInfo} onClose={onClose} />
    </CustomBottomSheet>
  );
};
