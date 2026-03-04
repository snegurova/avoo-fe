import { Metadata } from 'next/types';

import AuthorizationWrapper from '@/_components/AuthorizationWrapper/AuthorizationWrapper';
import ForgotPasswordForm from '@/_components/ForgotPasswordForm/ForgotPasswordForm';
import { LocalizedLink } from '@/_components/LocalizedLink/LocalizedLink';
import { AppRoutes } from '@/_routes/routes';

export const metadata: Metadata = {
  title: 'Forgot Password - AVOO App',
  description: 'Reset your password',
};

export default function ForgotPasswordPage() {
  return (
    <AuthorizationWrapper
      title='Recovery password'
      description='Enter your email to reset your password'
    >
      <ForgotPasswordForm />

      <div className='w-full mt-8 2xl:mt-14 flex items-center justify-center'>
        <LocalizedLink
          href={AppRoutes.SignIn}
          className='hover:text-primary-600 focus:text-primary-600'
        >
          Back to login
        </LocalizedLink>
      </div>
    </AuthorizationWrapper>
  );
}
