import { View } from 'react-native';
import FormTextInput from '@/shared/FormTextInput';
import Button from '@/shared/Button/Button';
import { utils, authHooks } from '@avoo/hooks';
import { useNavigation } from '@react-navigation/native';
import { RootScreens } from '@/types/navigation';
import { useApiStore } from '@avoo/store';
import { FontAwesome } from '@expo/vector-icons';


export default function ResetPasswordForm() {
  const { value: isShowPassword, toggleValue: toggleShowPassword } = utils.useBoolean(false);
  const { value: isShowConfirmPassword, toggleValue: toggleConfirmPassword } = utils.useBoolean(false);

  const isPending = useApiStore((state) => state.isPending);

  const navigation = useNavigation();

  const { control, handleSubmit, errors } = authHooks.useResetPasswordForm({
    onSuccess: () => {
      navigation.reset({
        index: 0,
        routes: [{ name: RootScreens.LoginScreen }],
      });
    },
  });

  const icon = <FontAwesome name={isShowPassword ? 'eye' : 'eye-slash'} size={24} color='black' />;
  const iconConfirmPassword = <FontAwesome name={isShowConfirmPassword ? 'eye' : 'eye-slash'} size={24} color='black' />;

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
