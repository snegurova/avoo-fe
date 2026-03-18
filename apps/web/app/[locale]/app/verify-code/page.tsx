import { Metadata } from 'next/types';
import { useTranslations } from 'next-intl';

import AuthorizationWrapper from '@/_components/AuthorizationWrapper/AuthorizationWrapper';
import VerifyCodeForm from '@/_components/VerifyCodeForm/VerifyCodeForm';

export const metadata: Metadata = {
  title: 'Verify Code - AVOO App',
  description: 'Verify your email code',
};

export default function VerifyCodePage() {
  const t = useTranslations('private.verifyCode');
  return (
    <AuthorizationWrapper title={t('verifyCode')}>
      <VerifyCodeForm />
    </AuthorizationWrapper>
  );
}
