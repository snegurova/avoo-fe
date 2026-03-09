import { View } from 'react-native';

import { authHooks, utils } from '@avoo/hooks';
import { useApiStatusStore } from '@avoo/store';

import Button, { Variant } from '@/shared/Button/Button';
import FormTextInput from '@/shared/FormTextInput';
import { MaterialIcons } from '@/shared/icons';

export default function LoginForm() {
  const { value: isShowPassword, toggleValue: toggleShowPassword } = utils.useBooleanState(false);

  const { control, handleSubmit, errors } = authHooks.useLoginForm();

  const isPending = useApiStatusStore((state) => state.isPending);

  const icon = (
    <MaterialIcons
      name={isShowPassword ? 'visibility' : 'visibility-off'}
      size={24}
      color='black'
    />
  );

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
        secureTextEntry={!isShowPassword}
        accessoryRight={icon}
        onAccessoryRightPress={toggleShowPassword}
        textContentType='password'
        autoComplete='off'
        autoCorrect={false}
      />
      <Button
        onPress={handleSubmit}
        loading={isPending}
        disabled={isPending}
        variant={Variant.PRIMARY}
        title='Log in'
      />
    </View>
  );
}
