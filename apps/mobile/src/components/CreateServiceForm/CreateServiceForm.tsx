import { useState } from 'react';
import { ScrollView, Text } from 'react-native';

import { MEDIA_TYPE_ENUM } from '@avoo/axios/types/apiEnums';
import { MasterWithRelationsEntityResponse, MediaEntity } from '@avoo/axios/types/apiTypes';
import { categoriesHooks, masterHooks, mediaHooks, servicesHooks } from '@avoo/hooks';
import { UploadFile } from '@avoo/shared';

import { imagePickerHooks } from '@/hooks/imagePickerHooks';
import { BottomSheetHeader } from '@/shared/BottomSheetHeader/BottomSheetHeader';

import { ServiceFormFields } from '../ServiceFormFields/ServiceFormFields';

type Props = {
  onClose: () => void;
};

export const CreateServiceForm = (props: Props) => {
  const { onClose } = props;

  const [uploadedMedia, setUploadedMedia] = useState<MediaEntity[]>([]);

  const categoriesData = categoriesHooks.useGetPublicCategories();
  const mastersData = masterHooks.useGetMastersProfileInfo();
  const masters: MasterWithRelationsEntityResponse[] = mastersData?.items ?? [];

  const { control, setValue, getValues, handleSubmit, errors } = servicesHooks.useCreateServiceForm(
    {
      onSuccess: onClose,
    },
  );

  const { uploadMedia, isUploading } = mediaHooks.useUploadMedia({
    onSuccess: (media) => {
      setUploadedMedia((prev) => [...prev, media]);
      setValue('mediaIds', [...getValues('mediaIds'), media.id]);
    },
  });

  const handlePickImage = () => {
    imagePickerHooks.showImagePicker((file: UploadFile) => {
      uploadMedia({ file, type: MEDIA_TYPE_ENUM.SERVICE });
    });
  };

  const handleRemoveMedia = (mediaId: number) => {
    setUploadedMedia((prev) => prev.filter((m) => m.id !== mediaId));
    setValue(
      'mediaIds',
      getValues('mediaIds').filter((id) => id !== mediaId),
    );
  };

  return (
    <>
      <BottomSheetHeader handleClose={onClose} handleConfirm={handleSubmit} />

      <ScrollView
        className='px-5'
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps='handled'
      >
        <Text className='text-xl font-bold text-gray-900 mb-4'>Add service</Text>

        <ServiceFormFields
          control={control}
          errors={errors}
          setValue={setValue}
          getValues={getValues}
          categories={categoriesData ?? []}
          masters={masters}
          medias={uploadedMedia}
          onPickImage={handlePickImage}
          onRemoveMedia={handleRemoveMedia}
          isUploading={isUploading}
        />
      </ScrollView>
    </>
  );
};
