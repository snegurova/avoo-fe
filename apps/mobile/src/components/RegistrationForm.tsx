import { View } from 'react-native';
import FormTextInput from '@/shared/FormTextInput';
import FormCheckBox from '@/shared/FormCheckBox';
import Button from '@/shared/Button/Button';
import { utils, authHooks } from '@avoo/hooks';
import { useApiStatusStore } from '@avoo/store';
import { FontAwesome } from '@expo/vector-icons';

export default function RegistrationForm() {
  const { value: isShowPassword, toggleValue: toggleShowPassword } = utils.useBoolean(false);
  const { value: isShowConfirmPassword, toggleValue: toggleConfirmPassword } = utils.useBoolean(false);

  const { control, handleSubmit, errors } = authHooks.useRegisterForm();

  const isPending = useApiStatusStore((state) => state.isPending);

  const icon = <FontAwesome name={isShowPassword ? 'eye' : 'eye-slash'} size={24} color='black' />;
  const iconConfirmPassword = <FontAwesome name={isShowConfirmPassword ? 'eye' : 'eye-slash'} size={24} color='black' />;

  return (
    <View className='w-full gap-4'>
      <FormTextInput
        name='name'
        control={control}
        placeholder='Full Name'
        error={errors.name?.message}
        autoCapitalize='words'
        keyboardType='default'
      />
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
      <FormCheckBox
        name='agreeToTerms'
        control={control}
        label='I agree to the Privacy Policy, Terms of Service and Terms of Business.'
        error={errors.agreeToTerms?.message}
      />
      <Button
        onPress={handleSubmit}
        title='Create Account'
        loading={isPending}
        disabled={isPending}
      />
    </View>
  );
}
