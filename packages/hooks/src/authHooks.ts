import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { registerSchema, RegisterFormData, loginSchema, LoginFormData } from './validationSchemas';
import { authApi } from '@avoo/axios';
import { useAuthStore } from '@avoo/store';
import { useMutation } from '@tanstack/react-query';
import { AuthResponse, BaseResponse } from '@avoo/axios/types/apiTypes';

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
          name: data.name,
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


    const { mutate: login } = useMutation({
      mutationFn: (data: LoginFormData) => authApi.login({
        email: data.email,
        password: data.password,
      }),
      onSuccess: (response) => {
        setIsAuthenticated(true);
        onSuccess?.(response.user);
      },
      onError: (error) => {
        onError?.(error);
      },
    });



    return {
      register,
      control,
      handleSubmit: handleSubmit((data) => login(data)),
      errors,
      isSubmitting,
    };
  },
};