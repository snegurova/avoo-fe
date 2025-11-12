import { useState, useMemo, ReactNode } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export const usePasswordVisibility = () => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const icon: ReactNode = useMemo(
    () =>
      showPassword ? (
        <FontAwesome name='eye' size={24} color='black' />
      ) : (
        <FontAwesome name='eye-slash' size={24} color='black' />
      ),
    [showPassword],
  );

  return {
    showPassword,
    togglePassword,
    icon,
    secureTextEntry: !showPassword,
  };
};

