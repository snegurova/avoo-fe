import { View, Button, Text } from 'react-native';
import { Control, FieldErrors } from 'react-hook-form';
import FormTextInput from '@/shared/FormTextInput';
import FormSearchInput from '@/shared/FormSearchInput';
import { CreateMasterFormData } from '@avoo/hooks/schemas/validationSchemas';

type Props = {
  control: Control<CreateMasterFormData>;
  handleSubmit: () => void;
  errors: FieldErrors<CreateMasterFormData>;
  isPending: boolean;
};

export default function CreateMasterForm({ control, handleSubmit, errors, isPending }: Props) {
  return (
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
        <FormSearchInput
          name='languages'
          control={control}
          error={errors.languages?.message}
        />
      </View>

      <Button
        title={isPending ? 'Creating...' : 'Create Master'}
        onPress={handleSubmit}
        disabled={isPending}
      />
    </View>
  );
}

