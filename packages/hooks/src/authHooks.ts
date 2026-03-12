import { useForm } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { authApi } from '@avoo/axios';
import {
  ForgotPasswordRequest as ForgotPasswordRequestType,
  RegisterCustomRequest,
} from '@avoo/axios';
import {
  ApiStatus,
  AuthResponse,
  BaseResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
  LoginRequest,
  ResetPasswordRequest,
  VerifyCodeRequest,
  VerifyCodeResponse,
} from '@avoo/axios/types/apiTypes';
import { useAuthStore } from '@avoo/store';

import {
  ChangePasswordFormData,
  changePasswordSchema,
  ForgotPasswordFormData,
  forgotPasswordSchema,
  LoginFormData,
  loginSchema,
  RegisterFormData,
  registerSchema,
  ResetPasswordFormData,
  resetPasswordSchema,
  VerifyCodeFormData,
  verifyCodeSchema,
} from '../schemas/validationSchemas';
import { utils } from './../utils/utils';

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
  onError?: () => void;
};

type UseResetPasswordFormParams = {
  token?: string;
  onSuccess?: () => void;
};

type UseChangePasswordFormParams = {
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
      handleSubmit: handleSubmit(
        utils.submitAdapter<RegisterCustomRequest, RegisterFormData>(registerMutation),
      ),
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
      handleSubmit: handleSubmit(utils.submitAdapter<LoginRequest, LoginFormData>(login)),
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
      handleSubmit: handleSubmit(
        utils.submitAdapter<ForgotPasswordRequestType, ForgotPasswordFormData>(sendCodeHandler),
      ),
      errors,
    };
  },
  useVerifyCodeForm: ({ email, onSuccess, onError }: UseVerifyCodeFormParams = {}) => {
    const {
      register,
      control,
      handleSubmit,
      formState: { errors },
      setValue,
    } = useForm<VerifyCodeFormData>({
      resolver: yupResolver(verifyCodeSchema),
      mode: 'onSubmit',
      defaultValues: {
        code: '',
      },
    });

    const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);
    const setAccessToken = useAuthStore((state) => state.setAccessToken);

    const { mutate: verifyCode, isPending } = useMutation<
      BaseResponse<VerifyCodeResponse>,
      Error,
      VerifyCodeRequest
    >({
      mutationFn: authApi.verifyCode,
      onSuccess: (response) => {
        if (response.status === ApiStatus.SUCCESS) {
          setIsAuthenticated(true);
          setAccessToken(response.data?.token);
          onSuccess?.();
        }
      },
      onError: () => {
        onError?.();
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
      setValue,
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
      handleSubmit: handleSubmit(
        utils.submitAdapter<ResetPasswordRequest, ResetPasswordFormData>(resetPassword),
      ),
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
  useChangePasswordForm: ({ onSuccess }: UseChangePasswordFormParams = {}) => {
    const {
      register,
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<ChangePasswordFormData>({
      resolver: yupResolver(changePasswordSchema),
      mode: 'onSubmit',
      defaultValues: {
        oldPassword: '',
        password: '',
        confirmPassword: '',
      },
    });

    const { mutate: changePassword, isPending } = useMutation<
      BaseResponse<ChangePasswordResponse>,
      Error,
      ChangePasswordRequest
    >({
      mutationFn: authApi.changePassword,
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
      handleSubmit: handleSubmit(
        utils.submitAdapter<ChangePasswordRequest, ChangePasswordFormData>(changePassword),
      ),
      errors,
    };
  },
};
