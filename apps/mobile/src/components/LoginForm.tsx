import { View } from 'react-native';
import FormTextInput from '../shared/FormTextInput';
import Button from '../shared/Button/Button';
import { authHooks, usePasswordVisibility } from '@avoo/hooks';
import { useApiStore } from 'packages/store/src/api.store';

export default function LoginForm() {
  const { icon, togglePassword, secureTextEntry } = usePasswordVisibility();

  const { control, handleSubmit, errors } = authHooks.useLoginForm();

  const isPending = useApiStore((state) => state.isPending);

  return (
    <View className='w-full gap-4'>
      <FormTextInput
        name='email'
        control={control}
        placeholder='Email'
        error={errors.email?.message}
        keyboardType='email-address'
        autoCapitalize='none'
        autoCorrect={false}
      />
      <FormTextInput
        name='password'
        control={control}
        placeholder='Password'
        error={errors.password?.message}
        secureTextEntry={secureTextEntry}
        accessoryRight={icon}
        onAccessoryRightPress={togglePassword}
        textContentType='password'
        autoComplete='off'
        autoCorrect={false}
      />
      <Button onPress={handleSubmit} title='Log in' loading={isPending} disabled={isPending} />
    </View>
  );
}
