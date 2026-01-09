  import { View, Pressable } from 'react-native';
  import { useEffect } from 'react';
  import { Text } from 'react-native-paper';
  import FormTextInput from '@/shared/FormTextInput';
  import FormSearchInput from '@/shared/FormSearchInput';
  import { BottomSheetHeader } from '@/shared/BottomSheetHeader/BottomSheetHeader';
  import { useBottomSheetStore, BottomSheetType } from '@/store/useBottomSheetStore';
  import { masterHooks } from '@avoo/hooks';
  import { colors } from '@avoo/design-tokens';

  const EditMasterForm = () => {
    const type = useBottomSheetStore((state) => state.type);
    const props = useBottomSheetStore((state) => state.props);
    const handleCloseBottomSheet = useBottomSheetStore((state) => state.handleCloseBottomSheet);

    if (type !== BottomSheetType.EDIT_MASTER || !props) {
      return null;
    }

    const master = props.master;

    if (!master?.id) {
      return null;
    }

    const { control, handleSubmit, errors, reset } = masterHooks.useUpdateMasterForm({
      master,
      onSuccess: () => {
        handleCloseBottomSheet();
      },
    });

    const { deleteMaster, isPending: isDeleting } = masterHooks.useDeleteMaster({
      onSuccess: () => {
        handleCloseBottomSheet();
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
        </View>
      </>
    );
  };

  export default EditMasterForm;
