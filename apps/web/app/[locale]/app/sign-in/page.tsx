import { Metadata } from 'next/types';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

import AuthorizationWrapper from '@/_components/AuthorizationWrapper/AuthorizationWrapper';
import { LocalizedLink } from '@/_components/LocalizedLink/LocalizedLink';
import LoginForm from '@/_components/LoginForm/LoginForm';
import { AppRoutes } from '@/_routes/routes';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'public.login.page' });

  return {
    title: t('metaTitle'),
    description: t('description'),
  };
}

export default function SignInPage() {
  const t = useTranslations('private.signIn');
  const tPage = useTranslations('public.login.page');
  return (
    <AuthorizationWrapper title={t('logIn')} description={tPage('description')}>
      <LoginForm />

      <div className='w-full mt-8 2xl:mt-14 flex items-center justify-between'>
        <LocalizedLink
          href={AppRoutes.SignUp}
          className='hover:text-primary-600 focus:text-primary-600'
        >
          {t('createAccount')}
        </LocalizedLink>
        <LocalizedLink
          href={AppRoutes.ForgotPassword}
          className='hover:text-primary-600 focus:text-primary-600 text-sm'
        >
          {t('forgotPassword')}
        </LocalizedLink>
      </div>
    </AuthorizationWrapper>
  );
}
