import { utils } from './../utils/utils';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { registerSchema, RegisterFormData, loginSchema, LoginFormData, forgotPasswordSchema, ForgotPasswordFormData } from './validationSchemas';
import { authApi } from '@avoo/axios';
import { useAuthStore } from '@avoo/store';
import { useMutation } from '@tanstack/react-query';


import {
  AuthResponse,
  BaseResponse,
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
} from '@avoo/axios/types/apiTypes';
import { useApiStore } from '@avoo/store/src/api.store';
import { apiStatus } from './constants';
import { RegisterCustomRequest } from '@avoo/axios/src/modules/auth';

export const authHooks = {
  useRegisterForm: ({
    onSuccess,
    onError,
  }: {
    onSuccess?: () => void;
    onError?: (error: any) => void;
  } = {}) => {
    const {
      register,
      control,
      handleSubmit,
      formState: { errors },
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

    const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);
    const setIsPending = useApiStore((state) => state.setIsPending);
    const isPending = useApiStore((state) => state.isPending);

    const { mutate: registerMutation } = useMutation<
      BaseResponse<AuthResponse>,
      Error,
      RegisterCustomRequest
    >({
      mutationFn: authApi.register,
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
      handleSubmit: handleSubmit((data: RegisterCustomRequest) => registerMutation(data)),
      errors,
    };
  },
  useLoginForm: ({
    onSuccess,
    onError,
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

    const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);
    const setIsPending = useApiStore((state) => state.setIsPending);
    const isPending = useApiStore((state) => state.isPending);

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


      handleSubmit: handleSubmit(utils.submitAdapter<LoginRequest>(login)),
      errors,
    };
  },
  useForgotPasswordForm: ({
    onSuccess,
    onError,
  }: {
    onSuccess?: (email: string) => void;
    onError?: (error: any) => void;
  } = {}) => {
    const {
      register,
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<ForgotPasswordFormData>({
      resolver: yupResolver(forgotPasswordSchema),
      mode: 'onSubmit',
      defaultValues: {
        email: '',
      },
    });

    const setIsPending = useApiStore((state) => state.setIsPending);
    const isPending = useApiStore((state) => state.isPending);

    const { mutate: forgotPassword } = useMutation<BaseResponse<{}>, Error, ForgotPasswordRequest>({
      mutationFn: (data: ForgotPasswordRequest) => authApi.forgotPassword(data),
      onMutate: () => setIsPending(true),
      onSuccess: (response, variables) => {
        if (response.status === apiStatus.SUCCESS) {
          onSuccess?.(variables.email);
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
      handleSubmit: handleSubmit((data: ForgotPasswordRequest) => forgotPassword(data)),
      errors,
    };
  },

  
};
