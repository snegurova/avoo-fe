import { Metadata } from 'next/types';

import AuthorizationWrapper from '@/_components/AuthorizationWrapper/AuthorizationWrapper';
import { LocalizedLink } from '@/_components/LocalizedLink/LocalizedLink';
import LoginForm from '@/_components/LoginForm/LoginForm';
import { AppRoutes } from '@/_routes/routes';

export const metadata: Metadata = {
  title: 'Sign In - AVOO App',
  description: 'Sign in to your AVOO account',
};

export default function SignInPage() {
  return (
    <AuthorizationWrapper
      title='Log In'
      description='Access your dashboard and manage your business.'
    >
      <LoginForm />

      <div className='w-full mt-8 2xl:mt-14 flex items-center justify-between'>
        <LocalizedLink
          href={AppRoutes.SignUp}
          className='hover:text-primary-600 focus:text-primary-600'
        >
          Create an account
        </LocalizedLink>
        <LocalizedLink
          href={AppRoutes.ForgotPassword}
          className='hover:text-primary-600 focus:text-primary-600 text-sm'
        >
          Forgot Password
        </LocalizedLink>
      </div>
    </AuthorizationWrapper>
  );
}
