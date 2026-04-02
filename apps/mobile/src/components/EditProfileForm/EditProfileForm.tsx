import { Controller, useForm } from 'react-hook-form';
import { ScrollView, Text, TextInput, View } from 'react-native';

import { colors } from '@avoo/design-tokens';
import { buildUpdateProfilePayload, userHooks } from '@avoo/hooks';

import { LockedField } from '@/components/LockedField/LockedField';
import { uiHooks } from '@/hooks/uiHooks';
import { BottomSheetHeader } from '@/shared/BottomSheetHeader/BottomSheetHeader';
import { ConfirmModal } from '@/shared/ConfirmModal/ConfirmModal';
import FormTextInput from '@/shared/FormTextInput';

type FormValues = {
  name: string;
  headline: string;
  phone: string;
  address: string;
  description: string;
};

export type ProfileData = {
  name: string | null;
  headline: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  description: string | null;
};

type Props = {
  profileInfo: ProfileData;
  onClose: () => void;
};

export const EditProfileForm = (props: Props) => {
  const { profileInfo, onClose } = props;
  const { handleUpdateProfile } = userHooks.useUpdateProfile();

  const { control, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: {
      name: profileInfo.name ?? '',
      headline: profileInfo.headline ?? '',
      phone: profileInfo.phone ?? '',
      address: profileInfo.address ?? '',
      description: profileInfo.description ?? '',
    },
  });

  const onSubmit = handleSubmit((values) => {
    handleUpdateProfile(buildUpdateProfilePayload(values), {
      onSuccess: onClose,
    });
  });

  const { handleClose, isConfirmVisible, confirmDiscard, cancelDiscard } =
    uiHooks.useUnsavedChanges(formState.isDirty, onClose);

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
      <BottomSheetHeader handleClose={handleClose} handleConfirm={onSubmit} />
      <ScrollView
        className='px-5'
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps='handled'
      >
        <Text className='text-xl font-bold text-gray-900 mb-4'>Edit profile</Text>
        <View className='mb-4'>
          <Text className='text-sm font-medium text-gray-900 mb-2'>Name</Text>
          <FormTextInput name='name' control={control} placeholder='Name' />
        </View>
        <View className='mb-4'>
          <Text className='text-sm font-medium text-gray-900 mb-2'>Headline</Text>
          <FormTextInput name='headline' control={control} placeholder='Headline' />
        </View>
        <View className='mb-4'>
          <Text className='text-sm font-medium text-gray-900 mb-2'>Email</Text>
          <LockedField value={profileInfo.email ?? '—'} disabled />
        </View>
        <View className='mb-4'>
          <Text className='text-sm font-medium text-gray-900 mb-2'>Address</Text>
          <FormTextInput name='address' control={control} placeholder='Address' />
        </View>
        <View className='mb-4'>
          <Text className='text-sm font-medium text-gray-900 mb-2'>Phone</Text>
          <FormTextInput
            name='phone'
            control={control}
            placeholder='Phone number'
            keyboardType='phone-pad'
          />
        </View>
        <View className='mb-4'>
          <Text className='text-sm font-medium text-gray-900 mb-2'>About</Text>
          <Controller
            name='description'
            control={control}
            render={({ field }) => (
              <TextInput
                className='rounded-lg bg-white border border-gray-200 px-4 py-3 text-base text-gray-900'
                style={{ minHeight: 80, textAlignVertical: 'top' }}
                placeholder='Tell about yourself...'
                placeholderTextColor={colors.gray[400]}
                multiline
                value={field.value}
                onChangeText={field.onChange}
              />
            )}
          />
        </View>
      </ScrollView>
    </>
  );
};
