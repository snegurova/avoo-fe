import { Metadata } from 'next/types';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

import AuthorizationWrapper from '@/_components/AuthorizationWrapper/AuthorizationWrapper';
import { LocalizedLink } from '@/_components/LocalizedLink/LocalizedLink';
import RegisterForm from '@/_components/RegisterForm/RegisterForm';
import { AppRoutes } from '@/_routes/routes';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'public.signUp.page' });

  return {
    title: t('metaTitle'),
    description: t('description'),
  };
}

export default function SignUpPage() {
  const t = useTranslations('private.signUp');
  const tPage = useTranslations('public.signUp.page');
  return (
    <AuthorizationWrapper title={t('createProfAccount')} description={tPage('description')}>
      <RegisterForm />

      <div className='w-full mt-14'>
        <p className='text-center'>
          {tPage.rich('accountPrompt', {
            link: (chunks) => (
              <LocalizedLink
                href={AppRoutes.SignIn}
                className='text-primary-800 hover:text-primary-600 focus:text-primary-600 underline font-bold'
              >
                {chunks}
              </LocalizedLink>
            ),
          })}
        </p>
      </div>
    </AuthorizationWrapper>
  );
}
