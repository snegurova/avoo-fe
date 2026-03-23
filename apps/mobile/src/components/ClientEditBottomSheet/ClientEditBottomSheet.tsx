import { CustomerInfoResponse } from '@avoo/axios/types/apiTypes';

import { ClientEditForm } from '@/components/ClientEditForm/ClientEditForm';
import { CustomBottomSheet } from '@/shared/CustomBottomSheet/CustomBottomSheet';

type Props = {
  client: CustomerInfoResponse;
  visible: boolean;
  onClose: () => void;
};

export const ClientEditBottomSheet = (props: Props) => {
  const { client, visible, onClose } = props;

  return (
    <CustomBottomSheet visible={visible} onClose={onClose} disableSwipeToClose>
      <ClientEditForm client={client} onClose={onClose} />
    </CustomBottomSheet>
  );
};
