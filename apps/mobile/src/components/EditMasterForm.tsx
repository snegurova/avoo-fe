  import { View, Pressable, ScrollView } from 'react-native';
  import { useEffect } from 'react';
  import { Text } from 'react-native-paper';
  import FormTextInput from '@/shared/FormTextInput';
  import FormSearchInput from '@/shared/FormSearchInput';
  import { masterHooks } from '@avoo/hooks';
  import { colors } from '@avoo/design-tokens';
  import { MasterWithRelationsEntityResponse } from '@avoo/axios/types/apiTypes';
  import { MaterialIcons } from '@/shared/icons';

  type Props = {
    master: MasterWithRelationsEntityResponse;
    onClose: () => void;
  };

  const EditMasterForm = ({ master, onClose }: Props) => {
    const { control, handleSubmit, errors, reset } = masterHooks.useUpdateMasterForm({
      master,
      onSuccess: () => {
        onClose();
      },
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
        <ModalHeader onClose={onClose} onConfirm={handleSubmit} />
        <ScrollView 
          contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
          keyboardShouldPersistTaps="handled"
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
            <Text style={{ marginBottom: 8 }}>Languages</Text>
            <FormSearchInput name='languages' control={control} error={errors.languages?.message} />
          </View>

          <Pressable
            className='py-3 mt-4 bg-white rounded-md'
            style={{ borderWidth: 1, borderColor: colors.red[800] }}
            onPress={() => deleteMaster(master.id)}
            disabled={isDeleting}
          >
            <Text
              variant='titleSmall'
              style={{ lineHeight: 16, color: colors.red[800], textAlign: 'center', fontWeight: 'bold' }}
            >
              Delete Master
            </Text>
          </Pressable>
        </ScrollView>
      </View>
    );
  };

  const ModalHeader = ({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) => {
    return (
      <View style={{ paddingBottom: 8 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20 }}>
          <Pressable onPress={onClose} style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primary[400], alignItems: 'center', justifyContent: 'center' }} hitSlop={8}>
            <MaterialIcons name='close' size={30} color={colors.white} />
          </Pressable>
          <Pressable onPress={onConfirm} style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primary[400], alignItems: 'center', justifyContent: 'center' }} hitSlop={8}>
            <MaterialIcons name='check' size={30} color={colors.white} />
          </Pressable>
        </View>
      </View>
    );
  };

  export default EditMasterForm;
