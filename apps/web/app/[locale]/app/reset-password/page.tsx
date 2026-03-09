import { Metadata } from 'next/types';

import AuthorizationWrapper from '@/_components/AuthorizationWrapper/AuthorizationWrapper';
import ResetPasswordForm from '@/_components/ResetPasswordForm/ResetPasswordForm';
import { AuthGuard } from '@/_components/AuthGuard/AuthGuard';

export const metadata: Metadata = {
  title: 'Reset Password - AVOO App',
  description: 'Reset your password',
};

export default function ResetPasswordPage() {
  return (
    <AuthGuard>
      <AuthorizationWrapper
        title='Create a new password'
        description='Choose a strong password to keep your account secure.'
      >
        <ResetPasswordForm />
      </AuthorizationWrapper>
    </AuthGuard>
  );
}
