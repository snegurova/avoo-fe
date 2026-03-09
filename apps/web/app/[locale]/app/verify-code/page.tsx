import { Metadata } from 'next/types';

import AuthorizationWrapper from '@/_components/AuthorizationWrapper/AuthorizationWrapper';
import VerifyCodeForm from '@/_components/VerifyCodeForm/VerifyCodeForm';

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
