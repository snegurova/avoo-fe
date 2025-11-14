import { View } from 'react-native';
import FormTextInput from '../shared/FormTextInput';
import Button from '../shared/Button/Button';
import { authHooks } from 'packages/hooks/src';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { useApiStore } from 'packages/store/src/api.store';
import { utils } from 'packages/hooks/utils/utils';
import { FontAwesome } from '@expo/vector-icons';


export default function ResetPasswordForm() {
  const { value: isShowPassword, toggle } = utils.useBoolean(false);
  const { value: isShowConfirmPassword, toggle: toggleConfirmPassword } = utils.useBoolean(false);

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
        onAccessoryRightPress={toggle}
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
