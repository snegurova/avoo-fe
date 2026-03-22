import { useState } from 'react';
import { useFormState } from 'react-hook-form';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { MEDIA_TYPE_ENUM } from '@avoo/axios/types/apiEnums';
import {
  MasterWithRelationsEntityResponse,
  MediaEntity,
  Service,
} from '@avoo/axios/types/apiTypes';
import { categoriesHooks, masterHooks, mediaHooks, servicesHooks, utils } from '@avoo/hooks';
import { UploadFile } from '@avoo/shared';

import { imagePickerHooks } from '@/hooks/imagePickerHooks';
import { uiHooks } from '@/hooks/uiHooks';
import { BottomSheetHeader } from '@/shared/BottomSheetHeader/BottomSheetHeader';
import { ConfirmModal } from '@/shared/ConfirmModal/ConfirmModal';

import { ServiceFormFields } from '../ServiceFormFields/ServiceFormFields';

type Props = {
  service: Service;
  onClose: () => void;
};

export const EditServiceForm = (props: Props) => {
  const { service, onClose } = props;

  const [addedMedias, setAddedMedias] = useState<MediaEntity[]>([]);
  const [removedMediaIds, setRemovedMediaIds] = useState<number[]>([]);

  const categoriesData = categoriesHooks.useGetPublicCategories();
  const mastersData = masterHooks.useGetMastersProfileInfo();
  const masters: MasterWithRelationsEntityResponse[] = mastersData?.items ?? [];

  const { data: mediaData } = mediaHooks.useGetMediaInfinite({
    limit: 9,
    type: MEDIA_TYPE_ENUM.SERVICE,
    typeEntityId: service.id,
  });

  const persistedMedias = mediaData?.pages.flatMap((page) => page.data?.items ?? []) ?? [];
  const visibleMedias: MediaEntity[] = [
    ...addedMedias,
    ...persistedMedias.filter((m) => !removedMediaIds.includes(m.id)),
  ];

  const { control, setValue, getValues, handleSubmit, errors } = servicesHooks.useUpdateServiceForm(
    {
      service,
      onSuccess: onClose,
    },
  );

  const { isDirty } = useFormState({ control });
  const { handleClose, isConfirmVisible, confirmDiscard, cancelDiscard } =
    uiHooks.useUnsavedChanges(isDirty, onClose);

  const { uploadMedia, isUploading } = mediaHooks.useUploadMedia({
    onSuccess: (media) => {
      setAddedMedias((prev) => [...prev, media]);
      setValue('mediaIds', [...getValues('mediaIds'), media.id], { shouldDirty: true });
    },
  });

  const { deleteMedia } = mediaHooks.useDeleteMedia();
  const { deleteServiceMutationAsync } = servicesHooks.useDeleteService();

  const {
    value: isDeleteConfirmVisible,
    enable: showDeleteConfirm,
    disable: hideDeleteConfirm,
  } = utils.useBooleanState(false);

  const confirmDelete = async () => {
    hideDeleteConfirm();
    await deleteServiceMutationAsync(service.id as number);
    onClose();
  };

  const handlePickImage = () => {
    imagePickerHooks.showImagePicker((file: UploadFile) => {
      uploadMedia({ file, type: MEDIA_TYPE_ENUM.SERVICE });
    });
  };

  const handleRemoveMedia = (mediaId: number) => {
    const isNewlyAdded = addedMedias.some((m) => m.id === mediaId);

    if (isNewlyAdded) {
      setAddedMedias((prev) => prev.filter((m) => m.id !== mediaId));
    } else {
      deleteMedia({ mediaId, params: { type: MEDIA_TYPE_ENUM.SERVICE, typeEntityId: service.id } });
      setRemovedMediaIds((prev) => [...prev, mediaId]);
    }

    setValue(
      'mediaIds',
      getValues('mediaIds').filter((id) => id !== mediaId),
      { shouldDirty: true },
    );
  };

  return (
    <>
      <ConfirmModal
        visible={isConfirmVisible}
        onClose={cancelDiscard}
        onCancel={cancelDiscard}
        onConfirm={confirmDiscard}
        title='Unsaved changes'
        description='You have unsaved changes. Are you sure you want to leave?'
        onCancelText='Cancel'
        onConfirmText='Discard changes'
      />
      <ConfirmModal
        visible={isDeleteConfirmVisible}
        onClose={hideDeleteConfirm}
        onCancel={hideDeleteConfirm}
        onConfirm={confirmDelete}
        title={`Delete service ${service.name}`}
        description='Are you sure you want to permanently delete this service? Clients will no longer be able to book it.'
        onCancelText='Cancel'
        onConfirmText='Delete service'
      />
      <BottomSheetHeader handleClose={handleClose} handleConfirm={handleSubmit} />

      <ScrollView
        className='px-5'
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps='handled'
      >
        <Text className='text-xl font-bold text-gray-900 mb-4'>Edit service</Text>

        <ServiceFormFields
          control={control}
          errors={errors}
          setValue={setValue}
          getValues={getValues}
          categories={categoriesData ?? []}
          masters={masters}
          medias={visibleMedias}
          onPickImage={handlePickImage}
          onRemoveMedia={handleRemoveMedia}
          isUploading={isUploading}
        />

        <View className='mt-4 mb-2'>
          <Pressable
            className='flex-row items-center justify-center rounded-xl py-4 border border-red-200'
            onPress={showDeleteConfirm}
          >
            <Text className='text-base font-semibold text-red-600'>Delete service</Text>
          </Pressable>
        </View>
      </ScrollView>
    </>
  );
};
