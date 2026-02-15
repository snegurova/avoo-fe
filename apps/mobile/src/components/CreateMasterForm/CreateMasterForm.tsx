import { View, Text } from 'react-native';
import FormTextInput from '@/shared/FormTextInput';
import LanguageSelector from '@/shared/LanguageSelector/LanguageSelector';
import { masterHooks, filesHooks } from '@avoo/hooks';
import { BottomSheetHeader } from '@/shared/BottomSheetHeader/BottomSheetHeader';
import AvatarUpload from '../Avatar/AvatarUpload';
import { ScrollView } from 'react-native-gesture-handler';
import { FILE_UPLOAD_TYPE_ENUM } from '@avoo/axios/types/apiEnums';
import { UploadFile } from '@avoo/shared';
import { FormPhoneField } from '@/shared/FormPhoneField/FormPhoneField';

type Props = {
  onClose: () => void;
};

const CreateMasterForm = ({ onClose }: Props) => {
  const { control, errors, handleSubmit, setValue, watch } = masterHooks.useCreateMasterForm({
    onSuccess: onClose,
  });

  const { uploadFile, isPending: isUploadingAvatar } = filesHooks.useUploadFile({
    onSuccess: (data) => {
      if (data?.url) setValue('avatarUrl', data.url);
      if (data?.previewUrl) setValue('avatarPreviewUrl', data.previewUrl);
    },
  });

  const avatarPreviewUrl = watch('avatarPreviewUrl');
  const avatarUrl = watch('avatarUrl');

  const handleImageSelected = (file: UploadFile) => {
    uploadFile({ file, type: FILE_UPLOAD_TYPE_ENUM.AVATAR });
  };

  return (
    <ScrollView>
      <BottomSheetHeader handleClose={onClose} handleConfirm={handleSubmit} />
      <View className='p-4'>
        <View className='mb-8 items-center'>
          <AvatarUpload
            size={150}
            iconSize={120}
            editIconSize={24}
            imageUri={avatarPreviewUrl || avatarUrl}
            onImageSelected={handleImageSelected}
            isUploading={isUploadingAvatar}
          />
        </View>
        <View className='mb-4'>
          <Text className='mb-2'>Email *</Text>
          <FormTextInput
            name='email'
            control={control}
            placeholder='master@example.com'
            keyboardType='email-address'
            autoCapitalize='none'
            error={errors.email?.message}
          />
        </View>

        <View className='mb-4'>
          <Text className='mb-2'>Name</Text>
          <FormTextInput
            name='name'
            control={control}
            placeholder='Jane Smith'
            error={errors.name?.message}
          />
        </View>

        <View className='mb-4'>
          <Text className='mb-2'>Headline</Text>
          <FormTextInput
            name='headline'
            control={control}
            placeholder='Hairdresser'
            error={errors.headline?.message}
          />
        </View>

        <View className='mb-4'>
          <Text className='mb-2'>Bio</Text>
          <FormTextInput
            name='bio'
            control={control}
            placeholder='Professional stylist...'
            multiline
            numberOfLines={4}
            error={errors.bio?.message}
          />
        </View>

        <FormPhoneField
          name='phone'
          control={control}
          label='Phone'
          placeholder='066-66-78-890'
          error={errors.phone?.message}
        />

        <View className='mb-4'>
          <LanguageSelector name='languages' control={control} error={errors.languages?.message} />
        </View>
      </View>
    </ScrollView>
  );
};

export default CreateMasterForm;
