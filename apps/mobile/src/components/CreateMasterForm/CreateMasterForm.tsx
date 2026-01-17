import { View, Text } from 'react-native';
import FormTextInput from '@/shared/FormTextInput';
import LanguageSelector from '@/shared/LanguageSelector/LanguageSelector';
import { masterHooks } from '@avoo/hooks';
import { BottomSheetHeader } from '@/shared/BottomSheetHeader/BottomSheetHeader';

type Props = {
  onClose: () => void;
};

const CreateMasterForm = ({ onClose }: Props) => {
  const { control, errors, handleSubmit } = masterHooks.useCreateMasterForm({
    onSuccess: onClose,
  });

  return (
    <>
      <BottomSheetHeader handleClose={onClose} handleConfirm={handleSubmit} />
      <View className='p-4'>
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
          <Text className='mb-2'>Name *</Text>
          <FormTextInput
            name='name'
            control={control}
            placeholder='Jane Smith'
            error={errors.name?.message}
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

        <View className='mb-4'>
          <Text className='mb-2'>Phone</Text>
          <FormTextInput
            name='phone'
            control={control}
            placeholder='+45112233'
            keyboardType='phone-pad'
            error={errors.phone?.message}
          />
        </View>

        <View className='mb-4'>
          <LanguageSelector
            name='languages'
            control={control}
            error={errors.languages?.message}
          />
        </View>
      </View>
    </>
  );
};

export default CreateMasterForm;
