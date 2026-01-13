import { View, Pressable, ScrollView } from 'react-native';
import { useEffect } from 'react';
import { Text } from 'react-native-paper';
import FormTextInput from '@/shared/FormTextInput';
import LanguageSelector from '@/shared/LanguageSelector/LanguageSelector';
import { masterHooks } from '@avoo/hooks';
import { colors } from '@avoo/design-tokens';
import { MasterWithRelationsEntityResponse } from '@avoo/axios/types/apiTypes';
import { BottomSheetHeader } from '@/shared/BottomSheetHeader/BottomSheetHeader';

type Props = {
  master: MasterWithRelationsEntityResponse;
  onClose: () => void;
};

const EditMasterForm = ({ master, onClose }: Props) => {
  const { control, handleSubmit, errors, reset } = masterHooks.useUpdateMasterForm({
    master,
    onSuccess: onClose,
  });

  const { deleteMaster, isPending: isDeleting } = masterHooks.useDeleteMaster({
    onSuccess: () => {
      onClose();
    },
  });

  useEffect(() => {
    if (master) {
      reset({
        email: master.email || '',
        name: master.name || '',
        bio: master.bio || '',
        phone: master.phone || '',
        languages: master.languages || [],
      });
    }
  }, [master, reset]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <BottomSheetHeader handleClose={onClose} handleConfirm={handleSubmit} />
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
        keyboardShouldPersistTaps='handled'
      >
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
          <LanguageSelector
            name='languages'
            control={control}
            error={errors.languages?.message}
          />
        </View>

        <Pressable
          className='py-3 mt-4 bg-white rounded-md'
          style={{ borderWidth: 1, borderColor: colors.red[800] }}
          onPress={() => deleteMaster(master.id)}
          disabled={isDeleting}
        >
          <Text
            variant='titleSmall'
            style={{
              lineHeight: 16,
              color: colors.red[800],
              textAlign: 'center',
              fontWeight: 'bold',
            }}
          >
            Delete Master
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

export default EditMasterForm;
