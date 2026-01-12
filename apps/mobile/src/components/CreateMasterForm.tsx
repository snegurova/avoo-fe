import { View, Text } from 'react-native';
import FormTextInput from '@/shared/FormTextInput';
import FormSearchInput from '@/shared/FormSearchInput';
import { masterHooks } from '@avoo/hooks';
import { BottomSheetHeader } from '@/shared/BottomSheetHeader/BottomSheetHeader';


const CreateMasterForm = () => {
  const { control, errors, handleSubmit } = masterHooks.useCreateMasterForm();

  return (
    <>
      <BottomSheetHeader showCloseButton={true} handleConfirm={handleSubmit} />
      <View style={{ padding: 16 }}>
        <View style={{ marginBottom: 16 }}>
          <Text style={{ marginBottom: 8 }}>Email *</Text>
          <FormTextInput
            name='email'
            control={control}
            placeholder='master@example.com'
            keyboardType='email-address'
            autoCapitalize='none'
            error={errors.email?.message}
          />
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={{ marginBottom: 8 }}>Name *</Text>
          <FormTextInput
            name='name'
            control={control}
            placeholder='Jane Smith'
            error={errors.name?.message}
          />
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={{ marginBottom: 8 }}>Bio</Text>
          <FormTextInput
            name='bio'
            control={control}
            placeholder='Professional stylist...'
            multiline
            numberOfLines={4}
            error={errors.bio?.message}
          />
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={{ marginBottom: 8 }}>Phone</Text>
          <FormTextInput
            name='phone'
            control={control}
            placeholder='+45112233'
            keyboardType='phone-pad'
            error={errors.phone?.message}
          />
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={{ marginBottom: 8 }}>Languages</Text>
          <FormSearchInput name='languages' control={control} error={errors.languages?.message} />
        </View>
      </View>
    </>
  );
};

export default CreateMasterForm;


