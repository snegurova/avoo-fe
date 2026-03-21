import { Service } from '@avoo/axios/types/apiTypes';

import { CustomBottomSheet } from '@/shared/CustomBottomSheet/CustomBottomSheet';

import { EditServiceForm } from './EditServiceForm';

type Props = {
  service: Service;
  visible: boolean;
  onClose: () => void;
};

export const EditServiceBottomSheet = (props: Props) => {
  const { service, visible, onClose } = props;

  return (
    <CustomBottomSheet visible={visible} onClose={onClose} disableSwipeToClose>
      <EditServiceForm service={service} onClose={onClose} />
    </CustomBottomSheet>
  );
};
