import { View, Text } from 'react-native';
import FormTextInput from '@/shared/FormTextInput';
import LanguageSelector from '@/shared/LanguageSelector/LanguageSelector';
import { masterHooks } from '@avoo/hooks';
import { BottomSheetHeader } from '@/shared/BottomSheetHeader/BottomSheetHeader';
import { Snackbar, Portal } from 'react-native-paper';
import { useApiStatusStore } from '@avoo/store';
import { MaterialIcons } from '@/shared/icons';
import { colors } from '@avoo/design-tokens';

type Props = {
  onClose: () => void;
};

const CreateMasterForm = ({ onClose }: Props) => {
  const { control, errors, handleSubmit } = masterHooks.useCreateMasterForm({
    onSuccess: () => {
      onClose();
    },
  });

  const {isError, errorMessage} = useApiStatusStore();
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
          <LanguageSelector name='languages' control={control} error={errors.languages?.message} />
        </View>
      </View>
      <Portal>
        <Snackbar
          visible={isError && !!errorMessage}
          onDismiss={() => useApiStatusStore.setState({ isError: false, errorMessage: null })}
          duration={4000}
          style={[{ backgroundColor: colors.red[800], zIndex: 10001, elevation: 10001 }]}
          icon={({ size, color }) => <MaterialIcons name='close' size={size} color={color} />}
          onIconPress={() => useApiStatusStore.setState({ isError: false, errorMessage: null })}
        >
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'white' }}>{errorMessage}</Text>
        </Snackbar>
      </Portal>
    </>
  );
};

export default CreateMasterForm;
