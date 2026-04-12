import { Text, View } from 'react-native';

import { colors } from '@avoo/design-tokens';
import { authHooks, utils } from '@avoo/hooks';
import { useApiStatusStore } from '@avoo/store';

import { VisibilityIcon, VisibilityOffIcon } from '@/icons';
import Button from '@/shared/Button/Button';
import FormCheckBox from '@/shared/FormCheckBox';
import FormTextInput from '@/shared/FormTextInput';

const getLabelStyle = (hasError: boolean) => ({
  fontFamily: 'Roboto-Medium',
  fontSize: 14,
  color: hasError ? colors.red['500'] : colors.gray['900'],
});

const placeholderStyle = {
  fontSize: 14,
  fontFamily: 'Roboto-Regular',
} as const;

export default function RegistrationForm() {
  const { value: isShowPassword, toggleValue: toggleShowPassword } = utils.useBooleanState(false);
  const { value: isShowConfirmPassword, toggleValue: toggleConfirmPassword } =
    utils.useBooleanState(false);

  const { control, handleSubmit, errors } = authHooks.useRegisterForm();

  const isPending = useApiStatusStore((state) => state.isPending);

  const iconPassword = isShowPassword ? (
    <VisibilityIcon size={24} color={colors.gray['500']} />
  ) : (
    <VisibilityOffIcon size={24} color={colors.gray['500']} />
  );

  const iconConfirmPassword = isShowConfirmPassword ? (
    <VisibilityIcon size={24} color={colors.gray['500']} />
  ) : (
    <VisibilityOffIcon size={24} color={colors.gray['500']} />
  );

  return (
    <View className='w-full' style={{ gap: 24 }}>
      <View style={{ gap: 4 }}>
        <Text style={getLabelStyle(!!errors.name)}>Full Name *</Text>
        <FormTextInput
          name='name'
          control={control}
          placeholder='Enter your Name'
          error={errors.name?.message}
          hideErrorText
          inputContainerStyle={{ minHeight: 44, borderRadius: 8 }}
          autoCapitalize='words'
          keyboardType='default'
          placeholderTextColor='#4D5560'
          style={placeholderStyle}
        />
      </View>
      <View style={{ gap: 4 }}>
        <Text style={getLabelStyle(!!errors.email)}>Email address *</Text>
        <FormTextInput
          name='email'
          control={control}
          placeholder='Email'
          error={errors.email?.message}
          hideErrorText
          inputContainerStyle={{ minHeight: 44, borderRadius: 8 }}
          keyboardType='email-address'
          autoCapitalize='none'
          autoCorrect={false}
          placeholderTextColor='#4D5560'
          style={placeholderStyle}
        />
      </View>
      <View style={{ gap: 4 }}>
        <Text style={getLabelStyle(!!errors.password)}>Password *</Text>
        <FormTextInput
          name='password'
          control={control}
          placeholder='Password'
          error={errors.password?.message}
          hideErrorText
          inputContainerStyle={{ minHeight: 44, borderRadius: 8 }}
          secureTextEntry={!isShowPassword}
          accessoryRight={iconPassword}
          onAccessoryRightPress={toggleShowPassword}
          textContentType='newPassword'
          autoComplete='off'
          autoCorrect={false}
          placeholderTextColor='#4D5560'
          style={{ color: colors.gray['500'] }}
        />
      </View>
      <View style={{ gap: 4 }}>
        <Text style={getLabelStyle(!!errors.confirmPassword)}>Confirm Password *</Text>
        <FormTextInput
          name='confirmPassword'
          control={control}
          placeholder='Confirm Password'
          error={errors.confirmPassword?.message}
          hideErrorText
          inputContainerStyle={{ minHeight: 44, borderRadius: 8 }}
          secureTextEntry={!isShowConfirmPassword}
          accessoryRight={iconConfirmPassword}
          onAccessoryRightPress={toggleConfirmPassword}
          textContentType='newPassword'
          autoComplete='off'
          autoCorrect={false}
          placeholderTextColor='#4D5560'
          style={{ color: colors.gray['500'] }}
        />
      </View>
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
        buttonColor={colors.gray['900']}
        textColor={colors.white}
        style={{ borderRadius: 8, height: 44 }}
      />
    </View>
  );
}
