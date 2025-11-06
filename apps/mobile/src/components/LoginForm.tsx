import { StyleSheet, View } from 'react-native';
import FormTextInput from '../shared/FormTextInput';
import { useState } from 'react';
import Button from '../shared/Button/Button';
import { authHooks } from '@avoo/hooks';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const { control, handleSubmit, errors, isPending } = authHooks.useLoginForm();

  return (
    <View style={styles.form}>
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
        secureTextEntry={!showPassword}
        accessoryRight={
          showPassword ? (
            <FontAwesome name='eye' size={24} color='black' />
          ) : (
            <FontAwesome name='eye-slash' size={24} color='black' />
          )
        }
        onAccessoryRightPress={() => setShowPassword(!showPassword)}
        textContentType='password'
        autoComplete='off'
        autoCorrect={false}
      />
      <Button onPress={handleSubmit} title='Log in' loading={isPending} disabled={isPending} />
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    width: '100%',
    gap: 16,
  },
});
