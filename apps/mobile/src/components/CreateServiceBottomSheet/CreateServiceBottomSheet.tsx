import { CustomBottomSheet } from '@/shared/CustomBottomSheet/CustomBottomSheet';

import { CreateServiceForm } from '../CreateServiceForm/CreateServiceForm';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export const CreateServiceBottomSheet = (props: Props) => {
  const { visible, onClose } = props;

  return (
    <CustomBottomSheet visible={visible} onClose={onClose} disableSwipeToClose>
      <CreateServiceForm onClose={onClose} />
    </CustomBottomSheet>
  );
};
