import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { registerSchema, RegisterFormData } from './authValidationSchemas';
import { authApi } from '@avoo/axios';

export function useRegisterForm({
  onSuccess,
  onError
}: {
  onSuccess?: (data: RegisterFormData) => void;
  onError?: (error: any) => void;
} = {}) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
    mode: 'onSubmit',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await authApi.register({
        email: data.email,
        password: data.password,
        name: data.name,
      });
      onSuccess?.(data);
    } catch (error) {
      onError?.(error);
    }
  };

  return {
    control,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting,
  };
}