import { Metadata } from 'next/types';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

import AuthorizationWrapper from '@/_components/AuthorizationWrapper/AuthorizationWrapper';
import ForgotPasswordForm from '@/_components/ForgotPasswordForm/ForgotPasswordForm';
import { LocalizedLink } from '@/_components/LocalizedLink/LocalizedLink';
import { AppRoutes } from '@/_routes/routes';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'public.forgotPassword.page' });

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default function ForgotPasswordPage() {
  const t = useTranslations('private.forgotPassword');
  const tPage = useTranslations('public.forgotPassword.page');
  return (
    <AuthorizationWrapper title={t('recoveryPassword')} description={tPage('description')}>
      <ForgotPasswordForm />

      <div className='w-full mt-8 2xl:mt-14 flex items-center justify-center'>
        <LocalizedLink
          href={AppRoutes.SignIn}
          className='hover:text-primary-600 focus:text-primary-600'
        >
          {t('backToLogin')}
        </LocalizedLink>
      </div>
    </AuthorizationWrapper>
  );
}
