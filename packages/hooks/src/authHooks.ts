import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { registerSchema, RegisterFormData, loginSchema, LoginFormData } from './validationSchemas';
import { authApi } from '@avoo/axios';
import { useAuthStore } from '@avoo/store';
import { useMutation } from '@tanstack/react-query';
import { AuthResponse, BaseResponse, LoginRequest } from '@avoo/axios/types/apiTypes';
import { useApiStore } from '@avoo/store/src/api.store';
import { apiStatus } from './constants';

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
    onSuccess?: () => void;
    onError?: (error: any) => void;
  } = {}) => {
    const {
      register,
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<LoginFormData>({
      resolver: yupResolver(loginSchema),
      mode: 'onSubmit',
      defaultValues: {
        email: '',
        password: '',
      },
    });

    const setIsAuthenticated = useAuthStore(state => state.setIsAuthenticated);
    const setIsPending = useApiStore(state => state.setIsPending);
    const isPending = useApiStore(state => state.isPending);

    const { mutate: login } = useMutation<BaseResponse<AuthResponse>, Error, LoginRequest>({
      mutationFn: (data: LoginRequest) => authApi.login(data),
      onMutate: () => setIsPending(true),
      onSuccess: (response) => {
        if (response.status === apiStatus.SUCCESS) {
          setIsAuthenticated(true);
          onSuccess?.();
        }
      },
      onError: (error) => {
        onError?.(error);
      },
      onSettled: () => setIsPending(false),
    });



    return {
      register,
      control,
      isPending,
      handleSubmit: handleSubmit((data: LoginRequest) => login(data)),
      errors,
    };
  },
};