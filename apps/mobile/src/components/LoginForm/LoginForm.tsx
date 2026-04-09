import { Text, View } from 'react-native';

import { colors } from '@avoo/design-tokens';
import { authHooks, utils } from '@avoo/hooks';
import { useApiStatusStore } from '@avoo/store';

import { VisibilityIcon, VisibilityOffIcon } from '@/icons';
import Button, { Variant } from '@/shared/Button/Button';
import FormTextInput from '@/shared/FormTextInput';

const getLabelStyle = (hasError: boolean) => ({
  fontFamily: 'Roboto-Medium',
  fontSize: 14,
  color: hasError ? colors.red['500'] : colors.gray['900'],
});

export default function LoginForm() {
  const { value: isShowPassword, toggleValue: toggleShowPassword } = utils.useBooleanState(false);

  const { control, handleSubmit, errors } = authHooks.useLoginForm();

  const isPending = useApiStatusStore((state) => state.isPending);

  const icon = isShowPassword ? (
    <VisibilityIcon size={24} color={colors.gray['500']} />
  ) : (
    <VisibilityOffIcon size={24} color={colors.gray['500']} />
  );

  return (
    <View className='w-full' style={{ gap: 24 }}>
      <View style={{ gap: 4 }}>
        <Text style={getLabelStyle(!!errors.email)}>Email address *</Text>
        <FormTextInput
          name='email'
          control={control}
          placeholder='Email'
          error={errors.email?.message}
          hideErrorText
          inputContainerStyle={{ minHeight: 44, paddingVertical: 10, borderRadius: 8 }}
          keyboardType='email-address'
          autoCapitalize='none'
          autoCorrect={false}
          placeholderTextColor='#4D5560'
          style={{ fontSize: 14, fontFamily: 'Roboto-Regular' }}
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
          inputContainerStyle={{ minHeight: 44, paddingVertical: 10, borderRadius: 8 }}
          secureTextEntry={!isShowPassword}
          accessoryRight={icon}
          onAccessoryRightPress={toggleShowPassword}
          textContentType='password'
          autoComplete='off'
          autoCorrect={false}
          placeholderTextColor='#4D5560'
          style={{ color: colors.gray['500'] }}
        />
      </View>
      <Button
        onPress={handleSubmit}
        loading={isPending}
        disabled={isPending}
        variant={Variant.PRIMARY}
        title='Log in'
        buttonColor={colors.gray['900']}
        textColor={colors.white}
        style={{ borderRadius: 8, height: 44 }}
      />
    </View>
  );
}
