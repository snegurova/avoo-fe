import { Controller } from 'react-hook-form';
import { ScrollView, Text, TextInput, View } from 'react-native';

import { CustomerInfoResponse } from '@avoo/axios/types/apiTypes';
import { colors } from '@avoo/design-tokens';
import { customerHooks } from '@avoo/hooks';

import { BooleanFormField } from '@/components/BooleanFormField/BooleanFormField';
import { ClientOrdersHistory } from '@/components/ClientOrdersHistory/ClientOrdersHistory';
import { LockedField } from '@/components/LockedField/LockedField';
import { uiHooks } from '@/hooks/uiHooks';
import { BottomSheetHeader } from '@/shared/BottomSheetHeader/BottomSheetHeader';
import { ConfirmModal } from '@/shared/ConfirmModal/ConfirmModal';
import FormTextInput from '@/shared/FormTextInput';

type Props = {
  client: CustomerInfoResponse;
  onClose: () => void;
};

export const ClientEditForm = (props: Props) => {
  const { client, onClose } = props;

  const { control, onSubmit, isDirty } = customerHooks.useUpdateCustomerForm({
    customer: client,
    onSuccess: onClose,
  });

  const { handleClose, isConfirmVisible, confirmDiscard, cancelDiscard } =
    uiHooks.useUnsavedChanges(isDirty, onClose);

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
        <Text className='text-xl font-bold text-gray-900 mb-4'>Client information</Text>
        <View className='mb-4'>
          <Text className='text-sm font-medium text-gray-900 mb-2'>Name</Text>
          <FormTextInput name='name' control={control} placeholder='Client name' />
        </View>
        <View className='mb-4'>
          <Text className='text-sm font-medium text-gray-900 mb-2'>Email address *</Text>
          <LockedField value={client.email ?? '—'} disabled />
        </View>
        <View className='mb-4'>
          <Text className='text-sm font-medium text-gray-900 mb-2'>Phone number</Text>
          <FormTextInput
            name='phone'
            control={control}
            placeholder='Phone number'
            keyboardType='phone-pad'
          />
        </View>
        <View className='mb-4'>
          <Text className='text-sm font-medium text-gray-900 mb-2'>Note</Text>
          <Controller
            name='notes'
            control={control}
            render={({ field }) => (
              <TextInput
                className='rounded-lg bg-white border border-gray-200 px-4 py-3 text-base text-gray-900'
                style={{ minHeight: 80, textAlignVertical: 'top' }}
                placeholder='Add a note...'
                placeholderTextColor={colors.gray[400]}
                multiline
                value={field.value}
                onChangeText={field.onChange}
              />
            )}
          />
        </View>
        <Controller
          name='isNotificationEnable'
          control={control}
          render={({ field }) => (
            <BooleanFormField
              value={field.value}
              onChange={field.onChange}
              title='Notification'
              description='Automatically sending appointment information to client via email'
            />
          )}
        />
        <View className='h-px bg-gray-100 mb-6' />
        <ClientOrdersHistory customerId={client.id} />
      </ScrollView>
    </>
  );
};
