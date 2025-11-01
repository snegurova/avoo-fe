import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { registerSchema, RegisterFormData, loginSchema, LoginFormData } from './validationSchemas';
import { authApi } from '@avoo/axios';
import { useAuthStore } from '@avoo/store';

export const authHooks = {
  useRegisterForm: ({
    onSuccess,
    onError
  }: {
    onSuccess?: (data: RegisterFormData) => void;
    onError?: (error: any) => void;
  } = {}) => {
    const {
      register,
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

    const setIsAuthenticated = useAuthStore(state => state.setIsAuthenticated);

    const onSubmit = async (data: RegisterFormData) => {
      try {
        await authApi.register({
          email: data.email,
          password: data.password,
          name: data.name,
        });
        
        setIsAuthenticated(true);
        onSuccess?.(data);
      } catch (error) {
        onError?.(error);
      }
    };

    return {
      register,
      control,
      handleSubmit: handleSubmit(onSubmit),
      errors,
      isSubmitting,
    };
  },
  useLoginForm: ({
    onSuccess,
    onError
  }: {
    onSuccess?: (data: LoginFormData) => void;
    onError?: (error: any) => void;
  } = {}) => {
    const {
      register,
      control,
      handleSubmit,
      formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
      resolver: yupResolver(loginSchema),
      mode: 'onSubmit',
      defaultValues: {
        email: '',
        password: '',
      },
    });
  
    const setIsAuthenticated = useAuthStore(state => state.setIsAuthenticated);
  
    const onSubmit = async (data: LoginFormData) => {
      try {
        await authApi.login({
          email: data.email,
          password: data.password,
        });
        
        setIsAuthenticated(true);
        onSuccess?.(data);
      } catch (error) {
        onError?.(error);
      }
    };
  
    return {
      register,
      control,
      handleSubmit: handleSubmit(onSubmit),
      errors,
      isSubmitting,
    };
  },
};