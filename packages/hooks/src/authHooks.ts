import { utils } from './../utils/utils';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  registerSchema,
  RegisterFormData,
  loginSchema,
  LoginFormData,
  forgotPasswordSchema,
  ForgotPasswordFormData,
  verifyCodeSchema,
  VerifyCodeFormData,
  ResetPasswordFormData,
  resetPasswordSchema,
} from '../schemas/validationSchemas';
import { authApi } from '@avoo/axios';
import { useAuthStore } from '@avoo/store';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  AuthResponse,
  BaseResponse,
  LoginRequest,
  VerifyCodeRequest,
  VerifyCodeResponse,
  ResetPasswordRequest,
  ApiStatus,
} from '@avoo/axios/types/apiTypes';
import {
  RegisterCustomRequest,
  ForgotPasswordRequest as ForgotPasswordRequestType,
} from '@avoo/axios/src/modules/auth';

type UseRegisterFormParams = {
  onSuccess?: () => void;
};

type UseLoginFormParams = {
  onSuccess?: () => void;
};

type UseForgotPasswordFormParams = {
  sendCodeHandler: (data: ForgotPasswordRequestType) => void;
};

type UseVerifyCodeFormParams = {
  email?: string;
  onSuccess?: () => void;
};

type UseResetPasswordFormParams = {
  token?: string;
  onSuccess?: () => void;
};

type UseSendCodeParams = {
  onSuccess?: (email: string) => void;
};

export const authHooks = {
  useRegisterForm: ({ onSuccess }: UseRegisterFormParams = {}) => {
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

    const { mutate: registerMutation, isPending } = useMutation<
      BaseResponse<AuthResponse>,
      Error,
      RegisterCustomRequest
    >({
      mutationFn: authApi.register,
      onSuccess: (response) => {
        if (response.status === ApiStatus.SUCCESS) {
          setIsAuthenticated(true);
          onSuccess?.();
        }
      },
    });

    utils.useSetPendingApi(isPending);

    return {
      register,
      control,
      handleSubmit: handleSubmit(utils.submitAdapter<RegisterCustomRequest>(registerMutation)),
      errors,
    };
  },
  useLoginForm: ({ onSuccess }: UseLoginFormParams = {}) => {
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
    const setAccessToken = useAuthStore((state) => state.setAccessToken);

    const { mutate: login, isPending } = useMutation<
      BaseResponse<AuthResponse>,
      Error,
      LoginRequest
    >({
      mutationFn: authApi.login,
      meta: {
        successMessage: 'Login successful',
      },
      onSuccess: (response) => {
        if (response.status === ApiStatus.SUCCESS) {
          setIsAuthenticated(true);
          setAccessToken(response.data?.token);
          onSuccess?.();
        }
      },
    });

    utils.useSetPendingApi(isPending);

    return {
      register,
      control,
      handleSubmit: handleSubmit(utils.submitAdapter<LoginRequest>(login)),
      errors,
    };
  },
  useForgotPasswordForm: ({ sendCodeHandler }: UseForgotPasswordFormParams) => {
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

    return {
      register,
      control,
      handleSubmit: handleSubmit(utils.submitAdapter<ForgotPasswordRequestType>(sendCodeHandler)),
      errors,
    };
  },
  useVerifyCodeForm: ({ email, onSuccess }: UseVerifyCodeFormParams = {}) => {
    const {
      register,
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<VerifyCodeFormData>({
      resolver: yupResolver(verifyCodeSchema),
      mode: 'onSubmit',
      defaultValues: {
        code: '',
      },
    });

    const setAccessToken = useAuthStore((state) => state.setAccessToken);

    const { mutate: verifyCode, isPending } = useMutation<
      BaseResponse<VerifyCodeResponse>,
      Error,
      VerifyCodeRequest
    >({
      mutationFn: authApi.verifyCode,
      onSuccess: (response) => {
        if (response.status === ApiStatus.SUCCESS) {
          setAccessToken(response.data?.token);
          onSuccess?.();
        }
      },
    });

    utils.useSetPendingApi(isPending);

    const onSubmit = handleSubmit((formData) => {
      if (!email) {
        return;
      }
      verifyCode({
        email,
        code: formData.code,
      });
    });

    return {
      register,
      control,
      handleSubmit: onSubmit,
      errors,
    };
  },
  useResetPasswordForm: ({ onSuccess }: UseResetPasswordFormParams = {}) => {
    const {
      register,
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<ResetPasswordFormData>({
      resolver: yupResolver(resetPasswordSchema),
      mode: 'onSubmit',
      defaultValues: {
        password: '',
        confirmPassword: '',
      },
    });

    const { mutate: resetPassword, isPending } = useMutation<
      BaseResponse<Record<string, never>>,
      Error,
      ResetPasswordRequest
    >({
      mutationFn: authApi.resetPassword,
      onSuccess: (response) => {
        if (response.status === ApiStatus.SUCCESS) {
          onSuccess?.();
        }
      },
    });

    utils.useSetPendingApi(isPending);

    return {
      register,
      control,
      handleSubmit: handleSubmit(utils.submitAdapter<ResetPasswordRequest>(resetPassword)),
      errors,
    };
  },
  useSendCode: ({ onSuccess }: UseSendCodeParams = {}) => {
    const { mutate: sendCodeHandler, isPending } = useMutation<
      BaseResponse<Record<string, never>>,
      Error,
      ForgotPasswordRequestType
    >({
      mutationFn: authApi.forgotPassword,
      onSuccess: (response, variables) => {
        if (response.status === ApiStatus.SUCCESS) {
          onSuccess?.(variables.email);
        }
      },
    });

    utils.useSetPendingApi(isPending);

    return {
      sendCodeHandler,
    };
  },
  useLogout: () => {
    const queryClient = useQueryClient();
    const { mutate: logoutMutation, isPending } = useMutation<
      BaseResponse<Record<string, never>>,
      Error,
      void
    >({
      mutationFn: authApi.logout,
      onSettled: () => {
        useAuthStore.getState().logoutStore();
        queryClient.clear();
      },
    });

    utils.useSetPendingApi(isPending);

    return {
      logoutMutation,
    };
  },
};
