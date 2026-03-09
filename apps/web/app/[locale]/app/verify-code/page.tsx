import { Metadata } from 'next/types';

import AuthorizationWrapper from '@/_components/AuthorizationWrapper/AuthorizationWrapper';
import { LocalizedLink } from '@/_components/LocalizedLink/LocalizedLink';
import VerifyCodeForm from '@/_components/VerifyCodeForm/VerifyCodeForm';
import { AppRoutes } from '@/_routes/routes';

export const metadata: Metadata = {
  title: 'Verify Code - AVOO App',
  description: 'Verify your email code',
};

export default function VerifyCodePage() {
  return (
    <AuthorizationWrapper title='Verify Code'>
      <VerifyCodeForm />
    </AuthorizationWrapper>
  );
}
