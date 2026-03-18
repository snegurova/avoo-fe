import { Metadata } from 'next/types';
import { useTranslations } from 'next-intl';

import { AuthGuard } from '@/_components/AuthGuard/AuthGuard';
import AuthorizationWrapper from '@/_components/AuthorizationWrapper/AuthorizationWrapper';
import ResetPasswordForm from '@/_components/ResetPasswordForm/ResetPasswordForm';

export const metadata: Metadata = {
  title: 'Reset Password - AVOO App',
  description: 'Reset your password',
};

export default function ResetPasswordPage() {
  const t = useTranslations('private.resetPassword');
  return (
    <AuthGuard>
      <AuthorizationWrapper
        title={t('createNewPassword')}
        description='Choose a strong password to keep your account secure.'
      >
        <ResetPasswordForm />
      </AuthorizationWrapper>
    </AuthGuard>
  );
}
