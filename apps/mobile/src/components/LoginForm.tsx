import { View } from 'react-native';
import FormTextInput from '@/shared/FormTextInput';
// import Button from '@/shared/Button/Button';
import { authHooks, utils } from '@avoo/hooks';
import { useApiStatusStore } from '@avoo/store';
import { MaterialIcons } from '@/shared/icons';
import { Button, useTheme } from 'react-native-paper';

export default function LoginForm() {
  const theme = useTheme();
  
  const { value: isShowPassword, toggleValue: toggleShowPassword } = utils.useBooleanState(false);

  const { control, handleSubmit, errors } = authHooks.useLoginForm();

  const isPending = useApiStatusStore((state) => state.isPending);

  const icon = <MaterialIcons name={isShowPassword ? 'visibility' : 'visibility-off'} size={24} color='black' />;

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
        mode="contained"
        buttonColor={theme.colors.secondary}
      >
        Log in
      </Button>
    </View>
  );
}
