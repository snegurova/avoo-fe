import { View } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { authHooks, utils } from '@avoo/hooks';
import { useApiStatusStore } from '@avoo/store';

import Button from '@/shared/Button/Button';
import FormTextInput from '@/shared/FormTextInput';
import { MaterialIcons } from '@/shared/icons';
import { RootScreens } from '@/types/navigation';

export default function ResetPasswordForm() {
  const { value: isShowPassword, toggleValue: toggleShowPassword } = utils.useBooleanState(false);
  const { value: isShowConfirmPassword, toggleValue: toggleConfirmPassword } =
    utils.useBooleanState(false);

  const isPending = useApiStatusStore((state) => state.isPending);

  const navigation = useNavigation();

  const { control, handleSubmit, errors } = authHooks.useResetPasswordForm({
    onSuccess: () => {
      navigation.reset({
        index: 0,
        routes: [{ name: RootScreens.LoginScreen }],
      });
    },
  });

  const icon = (
    <MaterialIcons
      name={isShowPassword ? 'visibility' : 'visibility-off'}
      size={24}
      color='black'
    />
  );
  const iconConfirmPassword = (
    <MaterialIcons
      name={isShowConfirmPassword ? 'visibility' : 'visibility-off'}
      size={24}
      color='black'
    />
  );

  return (
    <View className='w-full gap-4'>
      <FormTextInput
        name='password'
        control={control}
        placeholder='Password'
        error={errors.password?.message}
        secureTextEntry={!isShowPassword}
        accessoryRight={icon}
        onAccessoryRightPress={toggleShowPassword}
        textContentType='newPassword'
        autoComplete='off'
        autoCorrect={false}
      />
      <FormTextInput
        name='confirmPassword'
        control={control}
        placeholder='Confirm Password'
        error={errors.confirmPassword?.message}
        secureTextEntry={!isShowConfirmPassword}
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
