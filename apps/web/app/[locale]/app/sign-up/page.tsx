import { Metadata } from 'next/types';
import { useTranslations } from 'next-intl';

import AuthorizationWrapper from '@/_components/AuthorizationWrapper/AuthorizationWrapper';
import { LocalizedLink } from '@/_components/LocalizedLink/LocalizedLink';
import RegisterForm from '@/_components/RegisterForm/RegisterForm';
import { AppRoutes } from '@/_routes/routes';

export const metadata: Metadata = {
  title: 'Sign Up - AVOO App',
  description: 'Create your professional account on AVOO App',
};

export default function SignUpPage() {
  const t = useTranslations('private.signUp');
  return (
    <AuthorizationWrapper
      title={t('createProfAccount')}
      description='Set up your profile to start managing your services and bookings.'
    >
      <RegisterForm />

      <div className='w-full mt-14'>
        <p className='text-center'>
          Having account?{' '}
          <LocalizedLink
            href={AppRoutes.SignIn}
            className='text-primary-800 hover:text-primary-600 focus:text-primary-600 underline font-bold'
          >
            {t('logInSmall')}
          </LocalizedLink>
        </p>
      </div>
    </AuthorizationWrapper>
  );
}
