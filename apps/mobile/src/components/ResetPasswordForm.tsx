import { View } from 'react-native';
import FormTextInput from '../shared/FormTextInput';
import Button from '../shared/Button/Button';
import { authHooks, usePasswordVisibility } from 'packages/hooks/src';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { useApiStore } from 'packages/store/src/api.store';

export default function ResetPasswordForm() {
  const { icon, togglePassword, secureTextEntry } = usePasswordVisibility();
  const {
    icon: iconConfirmPassword,
    togglePassword: toggleConfirmPassword,
    secureTextEntry: secureTextEntryConfirmPassword,
  } = usePasswordVisibility();

  const isPending = useApiStore((state) => state.isPending);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const { control, handleSubmit, errors } = authHooks.useResetPasswordForm({
    onSuccess: () => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'LoginScreen' }],
      });
    },
  });

  return (
    <View className='w-full gap-4'>
      <FormTextInput
        name='password'
        control={control}
        placeholder='Password'
        error={errors.password?.message}
        secureTextEntry={secureTextEntry}
        accessoryRight={icon}
        onAccessoryRightPress={togglePassword}
        textContentType='newPassword'
        autoComplete='off'
        autoCorrect={false}
      />
      <FormTextInput
        name='confirmPassword'
        control={control}
        placeholder='Confirm Password'
        error={errors.confirmPassword?.message}
        secureTextEntry={secureTextEntryConfirmPassword}
        accessoryRight={iconConfirmPassword}
        onAccessoryRightPress={toggleConfirmPassword}
        textContentType='newPassword'
        autoComplete='off'
        autoCorrect={false}
      />
      <Button
        onPress={handleSubmit}
        title='Save New Password'
        loading={isPending}
        disabled={isPending}
      />
    </View>
  );
}
